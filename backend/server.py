from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
import jwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

SECRET_KEY = os.environ.get("JWT_SECRET", "your-secret-key-change-in-production")
ALGORITHM = "HS256"

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(hours=24)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = await db.users.find_one({"email": email}, {"_id": 0})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    email: EmailStr
    name: str
    created_at: str

class AuthResponse(BaseModel):
    token: str
    user: User

class Bond(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    country: str
    country_code: str
    yield_percentage: float
    maturity_date: str
    minimum_entry: float
    flag_url: str
    description: str
    issuer: str

class Portfolio(BaseModel):
    model_config = ConfigDict(extra="ignore")
    total_value: float
    total_tokens: float
    holdings: List[dict]
    earnings_history: List[dict]

class Wallet(BaseModel):
    model_config = ConfigDict(extra="ignore")
    usdc_balance: float
    email: str

class TransactionCreate(BaseModel):
    bond_id: str
    amount: float

class Transaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: str
    bond_id: str
    bond_country: str
    amount: float
    tokens_received: float
    timestamp: str
    transaction_type: str

@api_router.post("/auth/register", response_model=AuthResponse)
async def register(user_data: UserRegister):
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pw = hash_password(user_data.password)
    user_doc = {
        "email": user_data.email,
        "password": hashed_pw,
        "name": user_data.name,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(user_doc)
    
    wallet_doc = {
        "email": user_data.email,
        "usdc_balance": 100.0
    }
    await db.wallets.insert_one(wallet_doc)
    
    token = create_access_token({"sub": user_data.email})
    return {
        "token": token,
        "user": {
            "email": user_data.email,
            "name": user_data.name,
            "created_at": user_doc["created_at"]
        }
    }

@api_router.post("/auth/login", response_model=AuthResponse)
async def login(login_data: UserLogin):
    user = await db.users.find_one({"email": login_data.email})
    if not user or not verify_password(login_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": login_data.email})
    return {
        "token": token,
        "user": {
            "email": user["email"],
            "name": user["name"],
            "created_at": user["created_at"]
        }
    }

@api_router.get("/bonds", response_model=List[Bond])
async def get_bonds():
    bonds = await db.bonds.find({}, {"_id": 0}).to_list(100)
    return bonds

@api_router.get("/bonds/{bond_id}", response_model=Bond)
async def get_bond(bond_id: str):
    bond = await db.bonds.find_one({"id": bond_id}, {"_id": 0})
    if not bond:
        raise HTTPException(status_code=404, detail="Bond not found")
    return bond

@api_router.get("/portfolio", response_model=Portfolio)
async def get_portfolio(current_user: dict = Depends(get_current_user)):
    transactions = await db.transactions.find(
        {"email": current_user["email"], "transaction_type": "buy"},
        {"_id": 0}
    ).to_list(1000)
    
    holdings_map = {}
    for txn in transactions:
        bond_id = txn["bond_id"]
        if bond_id not in holdings_map:
            bond = await db.bonds.find_one({"id": bond_id}, {"_id": 0})
            holdings_map[bond_id] = {
                "bond_id": bond_id,
                "country": txn["bond_country"],
                "tokens": 0,
                "invested": 0,
                "current_value": 0,
                "yield_percentage": bond["yield_percentage"] if bond else 0
            }
        holdings_map[bond_id]["tokens"] += txn["tokens_received"]
        holdings_map[bond_id]["invested"] += txn["amount"]
    
    holdings = list(holdings_map.values())
    for holding in holdings:
        holding["current_value"] = holding["invested"] * (1 + holding["yield_percentage"] / 100 * 0.5)
    
    total_value = sum(h["current_value"] for h in holdings)
    total_tokens = sum(h["tokens"] for h in holdings)
    
    earnings_history = []
    for i in range(30):
        date = (datetime.now(timezone.utc) - timedelta(days=29-i)).strftime("%Y-%m-%d")
        value = total_value * (0.7 + (i / 30) * 0.3)
        earnings_history.append({"date": date, "value": round(value, 2)})
    
    return {
        "total_value": round(total_value, 2),
        "total_tokens": round(total_tokens, 2),
        "holdings": holdings,
        "earnings_history": earnings_history
    }

@api_router.get("/wallet", response_model=Wallet)
async def get_wallet(current_user: dict = Depends(get_current_user)):
    wallet = await db.wallets.find_one({"email": current_user["email"]}, {"_id": 0})
    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")
    return wallet

@api_router.post("/wallet/topup")
async def topup_wallet(amount: float, current_user: dict = Depends(get_current_user)):
    result = await db.wallets.update_one(
        {"email": current_user["email"]},
        {"$inc": {"usdc_balance": amount}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Wallet not found")
    
    wallet = await db.wallets.find_one({"email": current_user["email"]}, {"_id": 0})
    return {"message": "Top-up successful", "new_balance": wallet["usdc_balance"]}

@api_router.post("/transactions/buy", response_model=Transaction)
async def buy_bond(txn_data: TransactionCreate, current_user: dict = Depends(get_current_user)):
    bond = await db.bonds.find_one({"id": txn_data.bond_id}, {"_id": 0})
    if not bond:
        raise HTTPException(status_code=404, detail="Bond not found")
    
    if txn_data.amount < bond["minimum_entry"]:
        raise HTTPException(status_code=400, detail=f"Minimum entry is ${bond['minimum_entry']}")
    
    wallet = await db.wallets.find_one({"email": current_user["email"]})
    if wallet["usdc_balance"] < txn_data.amount:
        raise HTTPException(status_code=400, detail="Insufficient USDC balance")
    
    await db.wallets.update_one(
        {"email": current_user["email"]},
        {"$inc": {"usdc_balance": -txn_data.amount}}
    )
    
    tokens = txn_data.amount
    
    txn_id = f"txn_{datetime.now(timezone.utc).timestamp()}"
    transaction = {
        "id": txn_id,
        "email": current_user["email"],
        "bond_id": txn_data.bond_id,
        "bond_country": bond["country"],
        "amount": txn_data.amount,
        "tokens_received": tokens,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "transaction_type": "buy"
    }
    await db.transactions.insert_one(transaction)
    
    return transaction

@api_router.get("/transactions", response_model=List[Transaction])
async def get_transactions(current_user: dict = Depends(get_current_user)):
    transactions = await db.transactions.find(
        {"email": current_user["email"]},
        {"_id": 0}
    ).sort("timestamp", -1).to_list(100)
    return transactions

@api_router.get("/")
async def root():
    return {"message": "Fractional Bond DApp API"}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_db():
    bonds_count = await db.bonds.count_documents({})
    if bonds_count == 0:
        mock_bonds = [
            {
                "id": "bond_us_1",
                "country": "United States",
                "country_code": "US",
                "yield_percentage": 4.2,
                "maturity_date": "2028-12-31",
                "minimum_entry": 1.0,
                "flag_url": "https://flagcdn.com/w80/us.png",
                "description": "US Treasury bonds backed by the full faith of the United States government.",
                "issuer": "U.S. Department of Treasury"
            },
            {
                "id": "bond_sg_1",
                "country": "Singapore",
                "country_code": "SG",
                "yield_percentage": 3.8,
                "maturity_date": "2029-06-30",
                "minimum_entry": 1.0,
                "flag_url": "https://flagcdn.com/w80/sg.png",
                "description": "Singapore Government Securities with AAA credit rating.",
                "issuer": "Monetary Authority of Singapore"
            },
            {
                "id": "bond_de_1",
                "country": "Germany",
                "country_code": "DE",
                "yield_percentage": 2.9,
                "maturity_date": "2030-03-15",
                "minimum_entry": 1.0,
                "flag_url": "https://flagcdn.com/w80/de.png",
                "description": "German Bundesanleihen, considered one of the safest investments in Europe.",
                "issuer": "Federal Republic of Germany"
            },
            {
                "id": "bond_jp_1",
                "country": "Japan",
                "country_code": "JP",
                "yield_percentage": 1.5,
                "maturity_date": "2027-09-30",
                "minimum_entry": 1.0,
                "flag_url": "https://flagcdn.com/w80/jp.png",
                "description": "Japanese Government Bonds (JGBs) known for stability.",
                "issuer": "Ministry of Finance Japan"
            },
            {
                "id": "bond_ca_1",
                "country": "Canada",
                "country_code": "CA",
                "yield_percentage": 3.5,
                "maturity_date": "2029-11-15",
                "minimum_entry": 1.0,
                "flag_url": "https://flagcdn.com/w80/ca.png",
                "description": "Government of Canada bonds with strong credit rating.",
                "issuer": "Government of Canada"
            },
            {
                "id": "bond_au_1",
                "country": "Australia",
                "country_code": "AU",
                "yield_percentage": 4.0,
                "maturity_date": "2028-08-31",
                "minimum_entry": 1.0,
                "flag_url": "https://flagcdn.com/w80/au.png",
                "description": "Australian Government Bonds with attractive yields.",
                "issuer": "Australian Office of Financial Management"
            },
            {
                "id": "bond_uk_1",
                "country": "United Kingdom",
                "country_code": "GB",
                "yield_percentage": 4.5,
                "maturity_date": "2029-04-30",
                "minimum_entry": 1.0,
                "flag_url": "https://flagcdn.com/w80/gb.png",
                "description": "UK Gilts issued by Her Majesty's Treasury.",
                "issuer": "UK Debt Management Office"
            },
            {
                "id": "bond_ch_1",
                "country": "Switzerland",
                "country_code": "CH",
                "yield_percentage": 1.8,
                "maturity_date": "2030-12-31",
                "minimum_entry": 1.0,
                "flag_url": "https://flagcdn.com/w80/ch.png",
                "description": "Swiss Confederation bonds, ultra-safe haven assets.",
                "issuer": "Swiss Federal Finance Administration"
            }
        ]
        await db.bonds.insert_many(mock_bonds)
        logger.info("Mock bonds initialized")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

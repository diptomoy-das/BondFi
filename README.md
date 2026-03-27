# BondFi — Fractional Government Bond DApp

[![Blockchain](https://img.shields.io/badge/Blockchain-Stellar-blueviolet?style=for-the-badge&logo=stellar)](https://stellar.org)
[![Framework](https://img.shields.io/badge/Smart_Contracts-Soroban-black?style=for-the-badge&logo=rust)](https://soroban.stellar.org)
[![Frontend](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org)
[![Backend](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![Database](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com)

BondFi is a decentralized application (DApp) that enables **fractional ownership of government bonds** on the [Stellar](https://stellar.org) blockchain. By tokenizing traditional fixed-income securities, BondFi makes high-value assets accessible, transparent, and liquid for everyday investors — starting from as little as **$1.00**.

---

## 📸 Screenshots & Demo

### 🎬 Demo Video

https://github.com/user-attachments/assets/demo-video.mp4

> *If the video does not render above, you can find it at [`screenshots/demo-video.mp4`](screenshots/demo-video.mp4).*

<details>
<summary><strong>📷 View Screenshots</strong></summary>

### Registration
![Registration](screenshots/registration.png)

### Marketplace(Transactions)
![Marketplace](screenshots/marketplace.png)

### Wallet
![Wallet](screenshots/wallet.png)

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Government Bonds
![Government Bonds](screenshots/bonds.jpg)

</details>

---

## 🚀 Key Features

| Feature | Description |
|---|---|
| **Fractional Ownership** | Break high-entry government bonds into affordable digital tokens |
| **On-Chain Settlement** | Bond purchases are settled on the Stellar Testnet via Soroban smart contracts |
| **Wallet Integration** | Seamless [Freighter](https://www.freighter.app/) wallet connect for signing transactions |
| **USDC Stablecoin Payments** | Buy bond tokens with USDC — no volatile crypto exposure |
| **Portfolio Dashboard** | Real-time portfolio tracking with earnings history and yield analytics |
| **Multi-Country Bonds** | Access bonds from the US, Singapore, Germany, Japan, Canada, Australia, UK, and Switzerland |
| **Education Hub** | Built-in educational resources about bond investing and DeFi |
| **JWT Authentication** | Secure user registration and login with hashed passwords |

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                       │
│  React 18 · Vite · Tailwind CSS · Radix UI · React Router     │
│  Freighter API · Stellar SDK · Framer Motion · Recharts        │
└───────────────┬──────────────────────┬─────────────────────────┘
                │  REST API (Axios)    │  Soroban RPC
                ▼                      ▼
┌──────────────────────┐   ┌──────────────────────────────┐
│  Backend (FastAPI)   │   │  Stellar Testnet (Soroban)   │
│  JWT Auth · CORS     │   │  BondMarketplace Contract    │
│  Motor (async Mongo) │   │  Token Contracts (USDC/Bond) │
└──────────┬───────────┘   └──────────────────────────────┘
           │
           ▼
┌──────────────────────┐
│  MongoDB             │
│  users · wallets     │
│  bonds · transactions│
└──────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI framework |
| **Vite** | Build tool & dev server |
| **Tailwind CSS** | Utility-first styling |
| **Radix UI** | Accessible component primitives |
| **React Router v7** | Client-side routing |
| **Framer Motion** | Animations & transitions |
| **Recharts** | Portfolio charts |
| **Stellar SDK** | Blockchain interaction |
| **Freighter API** | Wallet connection & transaction signing |

### Backend
| Technology | Purpose |
|---|---|
| **FastAPI** | Async REST API framework |
| **Motor** | Async MongoDB driver |
| **PyJWT** | JWT token authentication |
| **Passlib + bcrypt** | Password hashing |
| **Pydantic v2** | Data validation & serialization |

### Blockchain
| Technology | Purpose |
|---|---|
| **Stellar Testnet** | Blockchain network |
| **Soroban** | Smart contract platform (Rust) |
| **Soroban SDK 20.0** | Contract development kit |

### Infrastructure
| Technology | Purpose |
|---|---|
| **Docker** | Containerized frontend deployment |
| **Nginx** | Production static file server |
| **MongoDB** | NoSQL database for user & transaction data |

---

## 📜 Smart Contract

The bond marketplace logic is deployed as a Soroban smart contract on the Stellar Testnet.

> **Contract Address:** `CDLQE2E5A2XVRJOCSS3VUCZXDYCO33PWSR36LLOKLUWJPQPA4V2YSW4T`

**Key function — `buy_bond`:**
```
buy_bond(buyer, payment_token, bond_token, amount)
```
The contract accepts a buyer's address, the USDC payment token, the bond token address, and the purchase amount. It handles the atomic swap of USDC for bond tokens on-chain.

---

## 📂 Project Structure

```text
BondFi/
├── frontend/                    # React client application
│   ├── src/
│   │   ├── pages/               # Route pages
│   │   │   ├── IntroLandingPage.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── MarketplacePage.jsx
│   │   │   ├── WalletPage.jsx
│   │   │   └── EducationPage.jsx
│   │   ├── components/          # Reusable UI components
│   │   ├── context/             # React context (WalletContext)
│   │   ├── hooks/               # Custom hooks
│   │   ├── utils/               # Helpers (auth, soroban)
│   │   ├── lib/                 # Utility functions
│   │   ├── App.jsx              # Root component & routing
│   │   └── index.jsx            # Entry point
│   ├── public/                  # Static assets
│   ├── vite.config.js           # Vite configuration
│   ├── tailwind.config.js       # Tailwind CSS configuration
│   └── package.json
│
├── backend/                     # FastAPI server
│   ├── server.py                # API routes & business logic
│   ├── requirements.txt         # Python dependencies
│   └── .env                     # Environment variables
│
├── contracts/                   # Soroban smart contracts
│   └── bond-token/
│       ├── Cargo.toml           # Rust dependencies
│       └── src/
│           └── lib.rs           # Contract source code
│
├── screenshots/                 # App screenshots & demo video
├── Dockerfile                   # Multi-stage Docker build
├── .dockerignore
├── .gitignore
└── README.md
```

---

## ⚡ Prerequisites

Before you begin, ensure you have the following installed:

| Tool | Version | Install Guide |
|---|---|---|
| **Node.js** | >= 18.x | [nodejs.org](https://nodejs.org) |
| **npm** | >= 9.x | Comes with Node.js |
| **Python** | >= 3.10 | [python.org](https://www.python.org) |
| **MongoDB** | >= 6.0 | [mongodb.com/docs](https://www.mongodb.com/docs/manual/installation/) |
| **Rust** | latest stable | [rustup.rs](https://rustup.rs) |
| **Soroban CLI** | latest | [soroban.stellar.org](https://soroban.stellar.org/docs/getting-started/setup) |
| **Freighter Wallet** | latest | [freighter.app](https://www.freighter.app/) |
| **Docker** *(optional)* | >= 24.x | [docker.com](https://docs.docker.com/get-docker/) |

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/BondFi.git
cd BondFi
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # Linux/Mac
# venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt
```

**Configure environment variables** — create/edit `backend/.env`:

```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="bondfi"
CORS_ORIGINS="http://localhost:5173"
JWT_SECRET="your-secure-secret-key-here"
```

**Start MongoDB** (if not already running):

```bash
# Using systemd
sudo systemctl start mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Start the backend server:**

```bash
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

The API will be available at `http://localhost:8001`. The API auto-seeds 8 government bonds into MongoDB on first startup.

### 3. Frontend Setup

```bash
# Navigate to frontend (from project root)
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

### 4. Smart Contract Setup (Optional)

If you want to build and deploy the Soroban contract yourself:

```bash
# Navigate to the contract
cd contracts/bond-token

# Build the contract
soroban contract build

# Deploy to Stellar Testnet
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/bond_token.wasm \
  --source <YOUR_SECRET_KEY> \
  --network testnet
```

### 5. Freighter Wallet Setup

1. Install the [Freighter browser extension](https://www.freighter.app/)
2. Create or import a wallet
3. Switch to **Testnet** in Freighter settings
4. Fund your testnet account via the [Stellar Friendbot](https://friendbot.stellar.org/?addr=YOUR_PUBLIC_KEY)
5. Connect your wallet in the BondFi app

---

## 🐳 Docker Deployment

Build and run the frontend production bundle:

```bash
# Build the Docker image
docker build -t bondfi-frontend .

# Run the container
docker run -d -p 80:80 bondfi-frontend
```

The production frontend will be served at `http://localhost`.

> **Note:** The Dockerfile builds only the frontend. The backend and MongoDB must be run separately.

---

## 🔌 API Reference

All API endpoints are prefixed with `/api`.

### Authentication

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | ✗ |
| `POST` | `/api/auth/login` | Login and receive JWT | ✗ |

### Bonds

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/bonds` | List all available bonds | ✗ |
| `GET` | `/api/bonds/{bond_id}` | Get a specific bond | ✗ |

### Portfolio

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/portfolio` | Get user's portfolio & earnings | ✓ |

### Wallet

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/wallet` | Get user's USDC balance | ✓ |
| `POST` | `/api/wallet/topup?amount=N` | Add USDC to wallet | ✓ |

### Transactions

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/transactions/buy` | Purchase bond tokens | ✓ |
| `GET` | `/api/transactions` | Get transaction history | ✓ |

> **Auth** endpoints require a `Bearer <token>` header.

---

## 🔄 Application Flow

```
1. User registers/logs in → receives JWT token
2. User connects Freighter wallet (Stellar Testnet)
3. User browses the Marketplace → views bonds from 8 countries
4. User clicks "Buy Now" on a bond:
   a. Backend deducts USDC from user's off-chain wallet
   b. Soroban contract executes buy_bond on-chain
   c. Freighter prompts user to sign the transaction
   d. Transaction is submitted to Stellar Testnet
   e. User receives bond tokens
5. Portfolio dashboard updates with holdings & yield analytics
6. Transaction appears in Wallet → Transaction History
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ on <a href="https://stellar.org">Stellar</a> · Powered by <a href="https://soroban.stellar.org">Soroban</a>
</p>

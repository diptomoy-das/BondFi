#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, token, Address, Env, String, Symbol};

#[contract]
pub struct BondToken;

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    TotalSupply,
    Balance(Address),
    Authorized(Address),
    MetadataUrl,
    PaymentToken, // New: Store the address of the accepted stablecoin (e.g. USDC)
}

#[contractimpl]
impl BondToken {
    pub fn initialize(env: Env, admin: Address, _decimal: u32, _name: String, _symbol: Symbol) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::TotalSupply, &0i128);
    }

    pub fn set_payment_token(env: Env, admin: Address, token: Address) {
        admin.require_auth();
        let stored_admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        if admin != stored_admin {
            panic!("Unauthorized");
        }
        env.storage().instance().set(&DataKey::PaymentToken, &token);
    }

    // Atomic Swap: Buy Bond Token with Payment Token (e.g. USDC)
    pub fn buy(env: Env, user: Address, amount: i128) {
        user.require_auth(); // 1. Authenticate user

        if amount <= 0 {
            panic!("Amount must be positive");
        }

        // 2. Get Payment Token and Admin Address
        let payment_token_addr: Address = env.storage().instance().get(&DataKey::PaymentToken).expect("Payment token not set");
        let admin_addr: Address = env.storage().instance().get(&DataKey::Admin).unwrap();

        // 3. Transfer Payment Token from User to Admin (Reserve)
        // using standard Soroban Token Interface
        let token_client = token::Client::new(&env, &payment_token_addr);
        token_client.transfer(&user, &admin_addr, &amount);

        // 4. Mint Bond Token to User (1:1 Peg logic)
        // Internal minting logic
        let mut total_supply: i128 = env.storage().instance().get(&DataKey::TotalSupply).unwrap_or(0);
        total_supply += amount;
        env.storage().instance().set(&DataKey::TotalSupply, &total_supply);

        let mut balance: i128 = env.storage().instance().get(&DataKey::Balance(user.clone())).unwrap_or(0);
        balance += amount;
        env.storage().instance().set(&DataKey::Balance(user), &balance);
    }

    // Admin Minting (for manual issuance if needed)
    pub fn issue_bond_tokens(env: Env, admin: Address, user: Address, amount: i128) {
        admin.require_auth();
        let stored_admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        if admin != stored_admin {
            panic!("Unauthorized");
        }

        let mut total_supply: i128 = env.storage().instance().get(&DataKey::TotalSupply).unwrap_or(0);
        total_supply += amount;
        env.storage().instance().set(&DataKey::TotalSupply, &total_supply);

        let mut balance: i128 = env.storage().instance().get(&DataKey::Balance(user.clone())).unwrap_or(0);
        balance += amount;
        env.storage().instance().set(&DataKey::Balance(user), &balance);
    }

    pub fn set_authorized(env: Env, admin: Address, id: Address, authorize: bool) {
        admin.require_auth();
        let stored_admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        if admin != stored_admin {
            panic!("Unauthorized");
        }
        env.storage().instance().set(&DataKey::Authorized(id), &authorize);
    }
    
    pub fn is_authorized(env: Env, id: Address) -> bool {
        env.storage().instance().get(&DataKey::Authorized(id)).unwrap_or(true)
    }

    pub fn set_metadata_url(env: Env, admin: Address, url: String) {
        admin.require_auth();
        let stored_admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        if admin != stored_admin {
            panic!("Unauthorized");
        }
        env.storage().instance().set(&DataKey::MetadataUrl, &url);
    }

    pub fn metadata_url(env: Env) -> String {
        env.storage().instance().get(&DataKey::MetadataUrl).unwrap_or(String::from_str(&env, ""))
    }
    
    pub fn balance(env: Env, id: Address) -> i128 {
        env.storage().instance().get(&DataKey::Balance(id)).unwrap_or(0)
    }
}

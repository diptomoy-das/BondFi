#![no_std]
use soroban_sdk::{contract, contractimpl, Address, Env, token, symbol_short};

#[contract]
pub struct BondMarketplace;

#[contractimpl]
impl BondMarketplace {
    /// Buys a fraction of a bond. 
    /// The user sends payment_amount in a stablecoin (e.g., USDC) 
    /// and receives an equivalent amount of BondTokens.
    pub fn buy_bond(
        env: Env, 
        buyer: Address, 
        payment_token: Address, 
        bond_token: Address, 
        amount: i128
    ) {
        // 1. Authenticate the buyer
        buyer.require_auth();

        // 2. Setup clients for the tokens
        let payment_client = token::Client::new(&env, &payment_token);
        let bond_client = token::Client::new(&env, &bond_token);

        // 3. Transfer payment from Buyer to the Marketplace (Escrow)
        payment_client.transfer(&buyer, &env.current_contract_address(), &amount);

        // 4. Send the Bond-Backed Stablecoins to the Buyer's wallet
        // Note: For a real bond, the Marketplace would be the "Issuer"
        bond_client.transfer(&env.current_contract_address(), &buyer, &amount);

        // 5. Emit a success event for your frontend AnimatedList
        env.events().publish(
            (symbol_short!("buy_bond"), buyer),
            amount
        );
    }
}
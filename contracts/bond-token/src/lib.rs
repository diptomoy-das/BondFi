import {
  isConnected,
  requestAccess,
  signTransaction,
} from "@stellar/freighter-api";
import * as StellarSdk from "@stellar/stellar-sdk";

const server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");

// Your BondMarketplace Contract ID
const MARKETPLACE_CONTRACT_ID = "CDLQE2E5A2XVRJOCSS3VUCZXDYCO33PWSR36LLOKLUWJPQPA4V2YSW4T";

// Replace these with your actual deployed Token IDs on Testnet
const PAYMENT_TOKEN_ID = "CAS3J7GYCCXG6S27SVD6S5V7E6V7E6V7E6V7E6V7E6V7E6V7E6V7E6V7"; // e.g., Mock USDC
const BOND_TOKEN_ID = "CB667TFFB6V6V6V6V6V6V6V6V6V6V6V6V6V6V6V6V6V6V6V6V6V6V6V6";    // e.g., Bond-Backed Stablecoin

export const buyBondToken = async (userAddress, amount) => {
  console.log("Initiating Bond Purchase Transaction...");

  if (!(await isConnected())) {
    throw new Error("Freighter not connected");
  }

  const { address } = await requestAccess();
  if (!address) throw new Error("User denied access");

  try {
    const account = await server.loadAccount(address);
    const contract = new StellarSdk.Contract(MARKETPLACE_CONTRACT_ID);

    // Prepare the arguments for buy_bond(buyer, payment_token, bond_token, amount)
    // Match the order and types in your lib.rs
    const params = [
      new StellarSdk.Address(address).toScVal(),             // buyer
      new StellarSdk.Address(PAYMENT_TOKEN_ID).toScVal(),    // payment_token
      new StellarSdk.Address(BOND_TOKEN_ID).toScVal(),       // bond_token
      StellarSdk.nativeToScVal(amount, { type: "i128" }),    // amount
    ];

    console.log("Building Soroban Contract Call...");
    const tx = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(contract.call("buy_bond", ...params))
      .setTimeout(30)
      .build();

    const xdr = tx.toXDR();
    console.log("Requesting Signature from Freighter...");
    
    const signedResponse = await signTransaction(xdr, { 
      network: "TESTNET",
      networkPassphrase: StellarSdk.Networks.TESTNET 
    });

    // Handle different Freighter return formats to prevent 'e6.switch' error
    const signedXdr = typeof signedResponse === 'string' 
      ? signedResponse 
      : (signedResponse.signedTxXdr || signedResponse.xdr);

    if (signedXdr) {
      console.log("Submitting to network...");
      const transactionToSubmit = new StellarSdk.Transaction(signedXdr, StellarSdk.Networks.TESTNET);
      const result = await server.submitTransaction(transactionToSubmit);
      
      console.log("Transaction Success! Hash:", result.hash);
      return { status: "success", txHash: result.hash };
    } else {
      throw new Error("User rejected signature");
    }
  } catch (error) {
    console.error("Bond Purchase Failed:", error);
    throw new Error(`Blockchain Error: ${error.message || "Unknown error"}`);
  }
};
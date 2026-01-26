import {
  isConnected,
  requestAccess,
  signTransaction,
} from "@stellar/freighter-api";
import * as StellarSdk from "@stellar/stellar-sdk";

// Use Testnet for widely available public nodes
const server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");

// ID of the deployed contract
const BOND_TOKEN_CONTRACT_ID = "CDLQE2E5A2XVRJOCSS3VUCZXDYCO33PWSR36LLOKLUWJPQPA4V2YSW4T";

export const mintBondToken = async (userAddress, amount) => {
  // Placeholder for internal testing
  return { status: "success", txHash: "mock_mint_hash" };
};

export const buyBondToken = async (userAddress, amount) => {
  console.log("Initiating Bond Purchase Transaction...");

  if (!(await isConnected())) {
    throw new Error("Freighter not connected");
  }

  // Double check address from Freighter
  const { address } = await requestAccess();
  if (!address) {
    throw new Error("User denied access");
  }

  try {
    console.log(`Loading account for ${address}...`);
    const account = await server.loadAccount(address);

    console.log("Building Transaction...");
    // Utilize a standard Payment transaction (0.00001 XLM to self) for stability
    const tx = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET
    })
      .addOperation(StellarSdk.Operation.payment({
        destination: address,
        asset: StellarSdk.Asset.native(),
        amount: "0.00001"
      }))
      .addMemo(StellarSdk.Memo.text("BondFi Purchase"))
      .setTimeout(30)
      .build();

    const xdr = tx.toXDR();
    console.log("Requesting Signature...");

    // Sign with Freighter
    const signedResponse = await signTransaction(xdr, {
      network: "TESTNET",
      networkPassphrase: StellarSdk.Networks.TESTNET
    });

    // Handle different Freighter return formats to prevent 'e6.switch' error
    const signedXdr = typeof signedResponse === 'string'
      ? signedResponse
      : (signedResponse.signedTxXdr || signedResponse.xdr);

    if (signedXdr) {
      console.log("Transaction signed! Submitting...");
      try {
        // Use the Transaction class directly instead of TransactionBuilder.fromXDR
        // to avoid internal SDK mismatch bugs
        const transactionToSubmit = new StellarSdk.Transaction(
          signedXdr,
          StellarSdk.Networks.TESTNET
        );

        const result = await server.submitTransaction(transactionToSubmit);
        console.log("Transaction Success! Hash:", result.hash);
        return { status: "success", txHash: result.hash };

      } catch (innerError) {
        console.error("Submission Failed:", innerError);
        throw new Error(`Submission Failed: ${innerError.message}`);
      }
    } else {
      throw new Error("User rejected signature");
    }

  } catch (error) {
    console.error("Bond Purchase Failed:", error);

    // Friendly error for unfunded accounts
    if (error.response && error.response.status === 404) {
      throw new Error("Wallet not funded on Testnet. Please fund your wallet using the Stellar Faucet (https://faucet.stellar.org).");
    }

    throw new Error(`Blockchain Error: ${error.message || "Unknown error"}`);
  }
};
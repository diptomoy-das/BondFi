# BondFi

[![Blockchain](https://img.shields.io/badge/Blockchain-Stellar-blueviolet?style=for-the-badge&logo=stellar)](https://stellar.org)
[![Framework](https://img.shields.io/badge/Smart_Contracts-Soroban-black?style=for-the-badge&logo=rust)](https://soroban.stellar.org)
[![Frontend](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org)
[![Backend](https://img.shields.io/badge/Backend-Python-3776AB?style=for-the-badge&logo=python)](https://www.python.org)

A decentralized application (DApp) designed to provide fractional ownership of government bonds. This platform leverages blockchain technology to make high-value financial assets accessible, transparent, and liquid for all investors.

---

## 🚀 Key Features

* **Fractional Ownership:** Break high-entry government bonds into affordable digital tokens.
* **On-Chain Yield:** Automated interest distribution directly to user wallets via smart contracts.
* **Instant Liquidity:** Trade bond fractions 24/7 on a decentralized exchange.
* **Transparency:** Publicly verifiable proof of the underlying real-world assets.
* **Low Barriers to Entry:** Start investing with small amounts of stablecoins.

---

## 📸 Screenshots

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

---

## 🛠️ Tech Stack

### Frontend
* **Framework:** React.js / Next.js
* **Styling:** Tailwind CSS
* **Wallet:** Stellar-compatible wallet (e.g., Freighter)

### Backend
* **Language:** Python (Flask or FastAPI)
* **SDK:** Stellar SDK

### Blockchain
* **Network:** Stellar
* **Smart Contracts:** Soroban (Rust)
* **Asset Standard:** Stellar Assets / SEP-20

---

## 📜 Smart Contract Information

The issuance logic and payout distributions are managed by the Soroban smart contract.

> **Contract Address: CDLQE2E5A2XVRJOCSS3VUCZXDYCO33PWSR36LLOKLUWJPQPA4V2YSW4T** > ` `  ---

## 📂 Project Structure

```text
├── backend/            # API for off-chain services and user data
├── frontend/           # React/Next.js client application
├── smart-contracts/    # Soroban Rust contracts for bond logic
└── docs/               # Technical documentation and architecture

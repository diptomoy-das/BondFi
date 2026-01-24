
import { jwtDecode } from "jwt-decode";

const STORAGE_KEYS = {
    USERS: 'bondfi_users',
    TOKENS: 'bondfi_tokens',
    WALLETS: 'bondfi_wallets',
    TRANSACTIONS: 'bondfi_transactions',
};

// Helper: Simulate delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper: Get from storage
const getStorage = (key) => JSON.parse(localStorage.getItem(key) || '[]');
const setStorage = (key, value) => localStorage.setItem(key, JSON.stringify(value));

// Mock Data
const MOCK_BONDS = [
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
];

// Helper: Fake JWT
const createFakeToken = (email) => {
    const payload = {
        sub: email,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 24 hours
        iat: Math.floor(Date.now() / 1000)
    };
    // This is a dummy signature part, it won't be valid in real backend but works for frontend decoding if library doesn't verify signature strictly or if we use our own decoder.
    // Actually, we can just base64 encode the payload to make it look real enough for jwt-decode.
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const body = btoa(JSON.stringify(payload));
    return `${header}.${body}.dummy_signature`;
};

const getEmailFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
        const decoded = jwtDecode(token);
        return decoded.sub;
    } catch (e) {
        return null;
    }
}


export const mockApi = {
    get: async (url) => {
        await delay(500);
        console.log(`[MOCK GET] ${url}`);

        if (url.includes('/bonds/') && !url.endsWith('/bonds')) {
            const id = url.split('/').pop();
            const bond = MOCK_BONDS.find(b => b.id === id);
            if (bond) return { data: bond };
            throw { response: { data: { detail: 'Bond not found' } } };
        }

        switch (true) {
            case url.endsWith('/bonds'):
                return { data: MOCK_BONDS };

            case url.endsWith('/portfolio'): {
                const email = getEmailFromToken();
                const transactions = getStorage(STORAGE_KEYS.TRANSACTIONS).filter(t => t.email === email && t.transaction_type === 'buy');

                let totalVal = 0;
                let totalTok = 0;
                const holdingsMap = {};

                transactions.forEach(txn => {
                    if (!holdingsMap[txn.bond_id]) {
                        const bond = MOCK_BONDS.find(b => b.id === txn.bond_id);
                        holdingsMap[txn.bond_id] = {
                            bond_id: txn.bond_id,
                            country: txn.bond_country,
                            tokens: 0,
                            invested: 0,
                            current_value: 0,
                            yield_percentage: bond ? bond.yield_percentage : 0
                        };
                    }
                    holdingsMap[txn.bond_id].tokens += txn.tokens_received;
                    holdingsMap[txn.bond_id].invested += txn.amount;
                });

                const holdings = Object.values(holdingsMap).map(h => {
                    const current_value = h.invested * (1 + h.yield_percentage / 100 * 0.5); // Dummy calculation
                    h.current_value = current_value;
                    totalVal += current_value;
                    totalTok += h.tokens;
                    return h;
                });

                // Generate 30-day earnings history
                const earnings_history = [];
                for (let i = 0; i < 30; i++) {
                    const date = new Date();
                    date.setDate(date.getDate() - (29 - i));
                    const dateStr = date.toISOString().split('T')[0];
                    // Simulate a growing curve ending at totalVal
                    // If totalVal is 0, we can fake a theoretical growth or just show 0
                    const val = totalVal > 0 ? totalVal * (0.7 + (i / 30) * 0.3) : 0;
                    earnings_history.push({ date: dateStr, value: parseFloat(val.toFixed(2)) });
                }

                return {
                    data: {
                        total_value: totalVal,
                        total_tokens: totalTok,
                        holdings,
                        earnings_history
                    }
                };
            }

            case url.endsWith('/wallet'): {
                const email = getEmailFromToken();
                const wallets = getStorage(STORAGE_KEYS.WALLETS);
                const wallet = wallets.find(w => w.email === email);
                if (wallet) return { data: wallet };
                throw { response: { status: 404, data: { detail: 'Wallet not found' } } };
            }

            case url.endsWith('/transactions'): {
                const email = getEmailFromToken();
                const txns = getStorage(STORAGE_KEYS.TRANSACTIONS)
                    .filter(t => t.email === email)
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                return { data: txns };
            }

            default:
                throw { response: { status: 404, data: { detail: 'Not Found' } } };
        }
    },

    post: async (url, body) => {
        await delay(800);
        console.log(`[MOCK POST] ${url}`, body);

        if (url.endsWith('/auth/register')) {
            const users = getStorage(STORAGE_KEYS.USERS);
            if (users.find(u => u.email === body.email)) {
                throw { response: { data: { detail: 'Email already registered' } } };
            }

            const newUser = { ...body, created_at: new Date().toISOString() };
            users.push(newUser);
            setStorage(STORAGE_KEYS.USERS, users);

            // Create Wallet
            const wallets = getStorage(STORAGE_KEYS.WALLETS);
            wallets.push({ email: body.email, usdc_balance: 100.0 });
            setStorage(STORAGE_KEYS.WALLETS, wallets);

            const token = createFakeToken(body.email);
            return { data: { token, user: newUser } };
        }

        if (url.endsWith('/auth/login')) {
            const users = getStorage(STORAGE_KEYS.USERS);
            const user = users.find(u => u.email === body.email && u.password === body.password);

            if (!user) {
                throw { response: { data: { detail: 'Invalid credentials' } } };
            }

            const token = createFakeToken(user.email);
            return { data: { token, user } };
        }

        if (url.endsWith('/wallet/topup')) {
            const email = getEmailFromToken();
            const wallets = getStorage(STORAGE_KEYS.WALLETS);
            const walletIndex = wallets.findIndex(w => w.email === email);

            if (walletIndex === -1) throw { response: { status: 404, data: { detail: "Wallet not found" } } };

            wallets[walletIndex].usdc_balance += body.amount;
            setStorage(STORAGE_KEYS.WALLETS, wallets);

            // Create Deposit Transaction
            const txn = {
                id: `txn_${Date.now()}`,
                email,
                bond_id: 'topup',
                bond_country: 'Deposit',
                amount: -body.amount, // Negative amount for display logic if needed, but wait, WalletPage logic says:
                // txn.transaction_type === 'buy' ? purchase : deposit
                // But looking at WalletPage:
                // <td className="p-4 font-mono text-sm text-right text-primary">
                //   +{txn.tokens_received.toFixed(2)}
                // </td>
                // Wait, for deposit, what does it show?
                // It only maps transactions.
                // Let's see WalletPage transaction mapping:
                tokens_received: body.amount, // Just treating USDC as tokens for display simplicity or 0?
                timestamp: new Date().toISOString(),
                transaction_type: 'deposit'
            };

            // Actually WalletPage does:
            // if type == buy: -${txn.amount}  +${txn.tokens_received}
            // if type == deposit: ... it doesn't seem to have specific column logic for deposit amount distinct from buy amount logic?
            // Let's check WalletPage again.
            // It iterates `transactions`.
            // The columns are: Date, Type, Bond, Amount, Tokens.
            // For deposit, Bond is "Deposit".
            // Amount: -${txn.amount.toFixed(2)} (Red)
            // Tokens: +${txn.tokens_received.toFixed(2)} (Green)

            // So if I want "Amount" to be green/positive for deposit, I might need to adjust logic or just let it be.
            // However, usually topup means +USDC.
            // If `amount` is displayed as -${amount}, that implies spending.
            // Let's look at `WalletPage`:
            /*
              <td className="p-4 font-mono text-sm text-right text-destructive">
                  -${txn.amount.toFixed(2)}
              </td>
            */
            // It HARDCODES the negative sign and red color!
            // This means the current UI assumes all transactions in this table are BUYS (spendings).
            // But `fetchWalletData` calls `api.get('/transactions')`.

            // If I want to support deposits in the list, I'd need to update WalletPage to handle `transaction_type === 'deposit'` styling.
            // But the user didn't ask for that feature, just to fix registration.
            // I will just implement the balance update for now. 
            // I'll add the transaction so it appears, but user might see it styled as a "spend" which is a UI bug but acceptable for now given the scope.
            // Or I can just NOT add a transaction record for topup to avoid confusion, just update balance.
            // I'll update balance only for safety.

            return { data: { message: "Top-up successful", new_balance: wallets[walletIndex].usdc_balance } };
        }

        if (url.endsWith('/transactions/buy')) {
            const email = getEmailFromToken();
            const wallets = getStorage(STORAGE_KEYS.WALLETS);
            const walletIndex = wallets.findIndex(w => w.email === email);

            if (walletIndex === -1) throw { response: { status: 404, data: { detail: "Wallet not found" } } };

            if (wallets[walletIndex].usdc_balance < body.amount) {
                throw { response: { status: 400, data: { detail: "Insufficient USDC balance" } } };
            }

            const bond = MOCK_BONDS.find(b => b.id === body.bond_id);

            // Update wallet
            wallets[walletIndex].usdc_balance -= body.amount;
            setStorage(STORAGE_KEYS.WALLETS, wallets);

            // Create Transaction
            const txn = {
                id: `txn_${Date.now()}`,
                email,
                bond_id: body.bond_id,
                bond_country: bond ? bond.country : 'Unknown',
                amount: body.amount,
                tokens_received: body.amount,
                timestamp: new Date().toISOString(),
                transaction_type: 'buy'
            };

            const txns = getStorage(STORAGE_KEYS.TRANSACTIONS);
            txns.push(txn);
            setStorage(STORAGE_KEYS.TRANSACTIONS, txns);

            return { data: txn };
        }

        throw { response: { status: 404, data: { detail: 'Endpoint not found' } } };
    },

    put: async () => { }, // Not used yet
    delete: async () => { }, // Not used yet
    interceptors: {
        request: { use: (fn) => fn({ headers: {} }) } // Mock interceptor
    }
};

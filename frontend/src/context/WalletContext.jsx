import { createContext, useContext, useState, useEffect } from 'react';
import { isConnected, requestAccess, getPublicKey } from '@stellar/freighter-api';
import { toast } from 'sonner';

const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
    const [address, setAddress] = useState(null);
    const [isConnecting, setIsConnecting] = useState(false);

    // Check connection on mount (persistence)
    useEffect(() => {
        checkConnection();
    }, []);

    const checkConnection = async () => {
        try {
            if (await isConnected()) {
                // Freighter is unlocked/available. 
                // Note: isConnected() just checks extension presence usually.
                // We try to get key if we had a previous session or just check.
                const key = await getPublicKey();
                if (key) {
                    setAddress(key);
                }
            }
        } catch (e) {
            // Not connected or not authorized yet, silent fail
        }
    };

    const connect = async () => {
        setIsConnecting(true);
        try {
            // 1. Check if installed
            if (!(await isConnected())) {
                toast.error("Freighter extension not detected");
                return null;
            }

            // 2. Request Access
            // Note: requestAccess can return an address (string) or an object { address, error } or throw
            const response = await requestAccess();

            let key = null;
            if (typeof response === 'string') {
                key = response;
            } else if (response && response.address) {
                key = response.address;
            } else if (response && response.error) {
                throw new Error(response.error);
            } else {
                // Fallback: try separate call
                key = await getPublicKey();
            }

            if (key) {
                setAddress(key);
                toast.success("Wallet connected successfully");
                return key;
            } else {
                throw new Error("No public key returned");
            }
        } catch (error) {
            console.error("Connection failed", error);
            toast.error(`Failed to connect wallet: ${error.message || error}`);
        } finally {
            setIsConnecting(false);
        }
        return null;
    };

    const disconnect = () => {
        setAddress(null);
        toast.info("Wallet disconnected");
    };

    return (
        <WalletContext.Provider value={{ address, connect, disconnect, isConnecting }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};

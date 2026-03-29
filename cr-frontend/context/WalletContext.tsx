"use client";
import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from "react";
import { useAuth } from "./AuthContext";

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: string;
  description: string;
}

export interface Account {
  id: string;
  accountNumber: string;
  balance: number;
}

interface WalletContextType {
  account: Account | null;
  balance: number;
  transactions: Transaction[];
  walletLoading: boolean;
  error: string | null;
  refreshWallet: () => Promise<void>;
  deposit: (amount: number, description?: string) => Promise<void>;
  addTransaction: (destinationAccount: string, amount: number) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error("useWallet must be used within a WalletProvider");
  return context;
};

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [account, setAccount] = useState<Account | null>(null);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [walletLoading, setWalletLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWallet = useCallback(async () => {
    if (!user) return;
    setWalletLoading(true);
    setError(null);
    try {
      // Mock data artificial delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const sessionData = localStorage.getItem("mock_wallet_data");
      if (sessionData) {
        const data = JSON.parse(sessionData);
        setAccount(data.account);
        setBalance(data.balance);
        setTransactions(data.transactions);
      } else {
        const initialAccount = {
          id: "acc_1",
          accountNumber: "CC-90210",
          balance: 1500.50
        };
        const initialTx = [
          { id: "tx_1", date: new Date().toISOString(), amount: 1500.50, type: "DEPOSIT", description: "Bono de bienvenida" }
        ];
        setAccount(initialAccount);
        setBalance(1500.50);
        setTransactions(initialTx);
        localStorage.setItem("mock_wallet_data", JSON.stringify({
          account: initialAccount,
          balance: 1500.50,
          transactions: initialTx
        }));
      }
    } catch (err: any) {
      setError(err.message || "Error al cargar la billetera");
    } finally {
      setWalletLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadWallet();
    } else {
      setAccount(null);
      setBalance(0);
      setTransactions([]);
    }
  }, [user, loadWallet]);

  const deposit = async (amount: number, description = "") => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Generar nueva transaccion y recargar
    loadWallet().then(() => {
      const newTx = {
        id: `tx_${Date.now()}`,
        date: new Date().toISOString(),
        amount,
        type: "DEPOSIT",
        description: description || "Depósito local"
      };
      
      setTransactions(prev => {
        const newTransactions = [newTx, ...prev];
        const newBalance = balance + amount;
        
        setBalance(newBalance);
        
        if (account) {
          localStorage.setItem("mock_wallet_data", JSON.stringify({
            account,
            balance: newBalance,
            transactions: newTransactions
          }));
        }
        
        return newTransactions;
      });
    });
  };

  const addTransaction = async (destinationAccount: string, amount: number) => {
    if (!account) throw new Error("Wallet no inicializada");
    if (amount > balance) throw new Error("Fondos insuficientes");
    
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const newTx = {
      id: `tx_${Date.now()}`,
      date: new Date().toISOString(),
      amount: -amount,
      type: "TRANSFER",
      description: `Giro a ${destinationAccount}`
    };
    
    setTransactions(prev => {
      const newTransactions = [newTx, ...prev];
      const newBalance = balance - amount;
      
      setBalance(newBalance);
      
      localStorage.setItem("mock_wallet_data", JSON.stringify({
        account,
        balance: newBalance,
        transactions: newTransactions
      }));
      
      return newTransactions;
    });
  };

  return (
    <WalletContext.Provider
      value={{
        account,
        balance,
        transactions,
        addTransaction,
        deposit,
        walletLoading,
        error,
        refreshWallet: loadWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

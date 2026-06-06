"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import {
  clearLegacyWalletStorage,
  createInitialWalletData,
  loadWalletData,
  saveWalletData,
} from "@/lib/wallet-storage";

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

const MOCK_DELAY_MS = 800;

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [account, setAccount] = useState<Account | null>(null);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [walletLoading, setWalletLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyWalletData = useCallback(
    (data: { account: Account; balance: number; transactions: Transaction[] }) => {
      setAccount(data.account);
      setBalance(data.balance);
      setTransactions(data.transactions);
    },
    []
  );

  const persistWallet = useCallback(
    (
      walletId: string,
      nextAccount: Account,
      nextBalance: number,
      nextTransactions: Transaction[]
    ) => {
      saveWalletData(walletId, {
        account: nextAccount,
        balance: nextBalance,
        transactions: nextTransactions,
      });
    },
    []
  );

  const loadWallet = useCallback(async () => {
    if (!user?.wallet_id) return;
    const walletId = user.wallet_id;

    setWalletLoading(true);
    setError(null);
    try {
      clearLegacyWalletStorage();
      await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

      const stored = loadWalletData(walletId);
      if (stored) {
        applyWalletData(stored);
      } else {
        const initial = createInitialWalletData(walletId);
        applyWalletData(initial);
        saveWalletData(walletId, initial);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al cargar la billetera";
      setError(message);
    } finally {
      setWalletLoading(false);
    }
  }, [user, applyWalletData]);

  useEffect(() => {
    if (user?.wallet_id) {
      loadWallet();
    } else {
      setAccount(null);
      setBalance(0);
      setTransactions([]);
    }
  }, [user, loadWallet]);

  const deposit = async (amount: number, description = "") => {
    if (!account || !user?.wallet_id) return;

    await new Promise((resolve) => setTimeout(resolve, 500));

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      date: new Date().toISOString(),
      amount,
      type: "DEPOSIT",
      description: description || "Depósito local",
    };

    const newTransactions = [newTx, ...transactions];
    const newBalance = balance + amount;

    setTransactions(newTransactions);
    setBalance(newBalance);
    persistWallet(user.wallet_id, account, newBalance, newTransactions);
  };

  const addTransaction = async (destinationAccount: string, amount: number) => {
    if (!account || !user?.wallet_id) throw new Error("Wallet no inicializada");
    if (amount > balance) throw new Error("Fondos insuficientes");

    await new Promise((resolve) => setTimeout(resolve, 500));

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      date: new Date().toISOString(),
      amount: -amount,
      type: "TRANSFER",
      description: `Giro a ${destinationAccount}`,
    };

    const newTransactions = [newTx, ...transactions];
    const newBalance = balance - amount;

    setTransactions(newTransactions);
    setBalance(newBalance);
    persistWallet(user.wallet_id, account, newBalance, newTransactions);
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

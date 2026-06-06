import type { Account, Transaction } from "@/context/WalletContext";

const STORAGE_PREFIX = "mock_wallet_data_";

interface WalletData {
  account: Account;
  balance: number;
  transactions: Transaction[];
}

function storageKey(walletId: string): string {
  return `${STORAGE_PREFIX}${walletId}`;
}

export function loadWalletData(walletId: string): WalletData | null {
  const raw = localStorage.getItem(storageKey(walletId));
  if (!raw) return null;
  return JSON.parse(raw);
}

export function saveWalletData(walletId: string, data: WalletData): void {
  localStorage.setItem(storageKey(walletId), JSON.stringify(data));
}

export function createInitialWalletData(walletId: string): WalletData {
  const suffix = walletId.replace(/-/g, "").slice(0, 5).toUpperCase();
  const account: Account = {
    id: walletId,
    accountNumber: `CC-${suffix}`,
    balance: 1500.5,
  };
  const transactions: Transaction[] = [
    {
      id: "tx_1",
      date: new Date().toISOString(),
      amount: 1500.5,
      type: "DEPOSIT",
      description: "Bono de bienvenida",
    },
  ];

  return { account, balance: 1500.5, transactions };
}

/** Elimina la clave global legacy compartida por navegador (migración). */
export function clearLegacyWalletStorage(): void {
  localStorage.removeItem("mock_wallet_data");
}

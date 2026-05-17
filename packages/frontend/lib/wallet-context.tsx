"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { WalletState, Notification } from "@/lib/types";
import { mockNotifications } from "@/lib/mock-data";
import { BrowserProvider, formatEther } from "ethers";

interface WalletContextType {
  wallet: WalletState;
  notifications: Notification[];
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  dismissNotification: (id: string) => void;
}

const WalletContext = createContext<WalletContextType | null>(null);

export interface WalletState {
  connected: boolean;
  address: string;
  balanceAVAX: number;
  balanceLadrillos: number;
  fibraParticipations: number;
  recentTx: any[];
  network?: string;
}

const INITIAL_WALLET_STATE: WalletState = {
  connected: false,
  address: "",
  balanceAVAX: 0,
  balanceLadrillos: 0,
  fibraParticipations: 0,
  recentTx: [],
  network: "Desconocida",
};

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<WalletState>(INITIAL_WALLET_STATE);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const updateWalletInfo = useCallback(async (address: string) => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const [balance, network] = await Promise.all([
          provider.getBalance(address),
          provider.getNetwork()
        ]);
        
        let networkName = "Desconocida";
        if (network.chainId === 43113n) networkName = "Fuji C-Chain";
        else if (network.chainId === 43114n) networkName = "Avalanche Mainnet";
        else networkName = network.name;

        setWallet((prev) => ({
          ...prev,
          connected: true,
          address: address,
          balanceAVAX: Number(formatEther(balance)),
          network: networkName,
        }));
      } catch (error) {
        console.error("Error updating wallet info:", error);
      }
    }
  }, []);

  const connectWallet = useCallback(async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" }) as string[];
        if (accounts.length > 0) {
          await updateWalletInfo(accounts[0]);
        }
      } catch (error) {
        console.error("User rejected connection:", error);
      }
    } else {
      alert("Por favor instala Core Wallet");
    }
  }, [updateWalletInfo]);

  const disconnectWallet = useCallback(() => {
    setWallet(INITIAL_WALLET_STATE);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" }) as string[];
          if (accounts.length > 0) {
            await updateWalletInfo(accounts[0]);
          }
        } catch (error) {
          console.error("Error checking connection:", error);
        }
      }
    };

    checkConnection();

    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = (accounts: any) => {
        if (accounts.length > 0) {
          updateWalletInfo(accounts[0]);
        } else {
          disconnectWallet();
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on?.("accountsChanged", handleAccountsChanged);
      window.ethereum.on?.("chainChanged", handleChainChanged);

      return () => {
        // window.ethereum.removeListener might not always be available in all wallets
        // but we try to be clean if possible. Ethers 6 BrowserProvider handle some of this too.
      };
    }
  }, [updateWalletInfo, disconnectWallet]);

  return (
    <WalletContext.Provider
      value={{ wallet, notifications, connectWallet, disconnectWallet, dismissNotification }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}

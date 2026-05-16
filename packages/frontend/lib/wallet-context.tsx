"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { WalletState, Notification } from "@/lib/types";
import { mockWallet, mockNotifications } from "@/lib/mock-data";

interface WalletContextType {
  wallet: WalletState;
  notifications: Notification[];
  connectWallet: () => void;
  disconnectWallet: () => void;
  dismissNotification: (id: string) => void;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<WalletState>(mockWallet);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const connectWallet = useCallback(() => {
    setWallet((prev) => ({ ...prev, connected: true }));
  }, []);

  const disconnectWallet = useCallback(() => {
    setWallet((prev) => ({ ...prev, connected: false }));
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

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

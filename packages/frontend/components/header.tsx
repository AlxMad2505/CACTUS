"use client";

import { useState } from "react";
import {
  Search,
  Bell,
  Wallet,
  ChevronDown,
  ExternalLink,
  Copy,
  LogOut,
  X,
  CircleDot,
  ArrowUpRight,
  ArrowDownLeft,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWallet } from "@/lib/wallet-context";

export function Header() {
  const { wallet, notifications, connectWallet, disconnectWallet, dismissNotification } =
    useWallet();
  const [walletOpen, setWalletOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  // Función auxiliar para copiar la dirección al portapapeles
  const copiarDireccion = () => {
    if (wallet.address) {
      // Si la dirección del context está recortada (ej: 0x123...abcd), 
      // idealmente en producción copiarías una variable con la dirección completa.
      navigator.clipboard.writeText(wallet.address);
      alert("Dirección copiada al portapapeles");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-xl">
      {/* Search */}
      <div className="relative max-w-md flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar propiedades, tokens, transacciones..."
          className="h-9 w-full rounded-lg border border-border bg-secondary pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-avax-red focus:outline-none focus:ring-1 focus:ring-avax-red/30"
        />
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setWalletOpen(false);
            }}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary text-muted-foreground transition-colors hover:text-foreground"
          >
            <Bell className="h-4 w-4" />
            {notifications.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-avax-red text-[10px] font-bold text-primary-foreground">
                {notifications.length}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
              <div className="border-b border-border px-4 py-3">
                <h3 className="text-sm font-semibold text-card-foreground">
                  Notificaciones On-Chain
                </h3>
              </div>
              <div className="max-h-64 divide-y divide-border overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="flex items-start gap-3 px-4 py-3">
                    <CircleDot
                      className={cn(
                        "mt-0.5 h-3.5 w-3.5 shrink-0",
                        n.type === "success" && "text-success",
                        n.type === "info" && "text-chart-3",
                        n.type === "warning" && "text-chart-4"
                      )}
                    />
                    <div className="flex-1">
                      <p className="text-xs text-card-foreground">{n.message}</p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">{n.timestamp}</p>
                    </div>
                    <button
                      onClick={() => dismissNotification(n.id)}
                      className="shrink-0 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <p className="px-4 py-6 text-center text-xs text-muted-foreground">
                    Sin notificaciones
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Core Wallet Button - ¡COMPLETAMENTE DINÁMICO AHORA! */}
        <div className="relative">
          {!wallet.connected ? (
            <button
              onClick={connectWallet}
              className="flex items-center gap-2 rounded-lg bg-avax-red px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 animate-pulse-glow"
            >
              <Wallet className="h-4 w-4" />
              Conectar Core Wallet
            </button>
          ) : (
            <button
              onClick={() => {
                setWalletOpen(!walletOpen);
                setNotifOpen(false);
              }}
              className="flex items-center gap-2.5 rounded-lg border border-border bg-secondary px-3 py-2 transition-colors hover:bg-accent"
            >
              <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-avax-red to-primary/50">
                <span className="text-[10px] font-bold text-primary-foreground">PD</span>
                <span className="absolute -bottom-0 -right-0 h-2 w-2 rounded-full border border-secondary bg-success" />
              </div>
              <div className="flex flex-col items-start">
                {/* Imprime la dirección real calculada por el context */}
                <span className="text-xs font-medium text-foreground">{wallet.address}</span>
                <span className="text-[10px] text-success">Online en Fuji C-Chain</span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          )}

          {/* Wallet Popover */}
          {walletOpen && wallet.connected && (
            <div className="absolute right-0 top-14 z-50 w-80 overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
              {/* Balance Real */}
              <div className="border-b border-border px-5 py-4">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Balance Principal
                </p>
                <p className="mt-1 text-2xl font-bold text-card-foreground">
                  {/* Lee el balance formateado en Ether/AVAX */}
                  {wallet.balanceAVAX}{" "}
                  <span className="text-sm font-medium text-avax-red">AVAX</span>
                </p>
              </div>

              {/* Token balances */}
              <div className="border-b border-border px-5 py-3">
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-xs text-muted-foreground">LadrilloBricks (ERC-20)</span>
                  <span className="text-xs font-semibold text-card-foreground">
                    {wallet.balanceLadrillos.toLocaleString()} LDR
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-xs text-muted-foreground">Participaciones FIBRA</span>
                  <span className="text-xs font-semibold text-card-foreground">
                    {wallet.fibraParticipations} Fondos
                  </span>
                </div>
              </div>

              {/* Recent transactions */}
              <div className="border-b border-border px-5 py-3">
                <p className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                  Actividad Reciente
                </p>
                {wallet.recentTx.map((tx) => (
                  <div key={tx.id} className="flex items-center gap-2.5 py-1.5">
                    {tx.type === "ICM Message" ? (
                      <Zap className="h-3.5 w-3.5 text-chart-4" />
                    ) : tx.type === "Escrow" ? (
                      <ArrowUpRight className="h-3.5 w-3.5 text-avax-red" />
                    ) : (
                      <ArrowDownLeft className="h-3.5 w-3.5 text-success" />
                    )}
                    <div className="flex-1">
                      <p className="text-xs text-card-foreground">{tx.description}</p>
                      <p className="text-[10px] text-muted-foreground">{tx.timestamp}</p>
                    </div>
                    <span className="text-[10px] font-medium text-muted-foreground">
                      {tx.amount}
                    </span>
                  </div>
                ))}
                {wallet.recentTx.length === 0 && (
                  <p className="py-2 text-center text-xs text-muted-foreground">
                    Sin transacciones recientes
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 px-5 py-3">
                <button 
                  onClick={copiarDireccion}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-secondary py-2 text-[11px] font-medium text-secondary-foreground transition-colors hover:bg-accent"
                >
                  <Copy className="h-3 w-3" /> Copiar
                </button>
                <a 
                  href={`https://testnet.snowtrace.io/address/${wallet.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-secondary py-2 text-[11px] font-medium text-secondary-foreground transition-colors hover:bg-accent text-center"
                >
                  <ExternalLink className="h-3 w-3" /> Snowtrace
                </a>
                <button
                  onClick={() => {
                    disconnectWallet();
                    setWalletOpen(false);
                  }}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-destructive/10 py-2 text-[11px] font-medium text-avax-red transition-colors hover:bg-destructive/20"
                >
                  <LogOut className="h-3 w-3" /> Salir
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
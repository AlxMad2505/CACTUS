"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  Coins,
  Building2,
  ArrowRight,
  Info,
  Wallet,
} from "lucide-react";
import { mockFibras, mockProperties } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useWallet } from "@/lib/wallet-context";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

export default function FibrasPage() {
  const { wallet, connectWallet } = useWallet();

  return (
    <div className="px-6 py-10 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Banner */}
        <div className="mb-10 overflow-hidden rounded-2xl border border-avax-red/20 bg-gradient-to-r from-avax-red/5 to-transparent p-8">
          <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 flex items-center gap-2">
                <Coins className="h-5 w-5 text-avax-red" />
                <h1 className="text-2xl font-bold text-foreground">FIBRAs Tokenizadas</h1>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Invierte en portafolios diversificados de propiedades mediante fracciones
                tokenizadas (&quot;Ladrillos&quot; ERC-20). Compra fracciones desde montos
                minimos, diversifica automaticamente y reclama dividendos on-chain directamente
                en tu Core Wallet.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center rounded-xl border border-border bg-card px-6 py-4">
                <p className="text-2xl font-bold text-success">14.0%</p>
                <p className="mt-1 text-[10px] text-muted-foreground">APY Promedio</p>
              </div>
              <div className="flex flex-col items-center rounded-xl border border-border bg-card px-6 py-4">
                <p className="text-2xl font-bold text-foreground">4</p>
                <p className="mt-1 text-[10px] text-muted-foreground">Fondos Activos</p>
              </div>
            </div>
          </div>
        </div>

        {/* FIBRA cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          className="grid gap-6 md:grid-cols-2"
        >
          {mockFibras.map((fibra, i) => {
            const fundedPct = Math.round((fibra.funded / fibra.target) * 100);
            const remaining = fibra.target - fibra.funded;
            const linkedProps = fibra.properties
              .map((pid) => mockProperties.find((p) => p.id === pid))
              .filter(Boolean);

            return (
              <motion.div
                key={fibra.id}
                variants={fadeUp}
                custom={i}
                className="group overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-avax-red/30 hover:shadow-lg hover:shadow-avax-red/5"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-card-foreground">
                          {fibra.name}
                        </h3>
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                            fibra.status === "active"
                              ? "bg-success/20 text-success"
                              : fibra.status === "funding"
                              ? "bg-chart-4/20 text-chart-4"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {fibra.status === "active"
                            ? "Activo"
                            : fibra.status === "funding"
                            ? "Fondeando"
                            : "Cerrado"}
                        </span>
                      </div>
                      <p className="mt-1 font-mono text-xs text-muted-foreground">
                        {fibra.symbol}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-success">{fibra.apy}%</p>
                      <p className="text-[10px] text-muted-foreground">APY Estimado</p>
                    </div>
                  </div>

                  <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                    {fibra.description}
                  </p>

                  {/* Progress bar */}
                  <div className="mt-5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Fondeo</span>
                      <span className="font-medium text-card-foreground">{fundedPct}%</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-avax-red to-success transition-all duration-1000"
                        style={{ width: `${fundedPct}%` }}
                      />
                    </div>
                    <div className="mt-1.5 flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>
                        {fibra.funded.toLocaleString()} / {fibra.target.toLocaleString()} AVAX
                      </span>
                      <span>{remaining.toLocaleString()} AVAX restantes</span>
                    </div>
                  </div>

                  {/* Properties */}
                  <div className="mt-5">
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <Building2 className="h-3 w-3" />
                      {fibra.propertyCount} propiedades en este fondo:
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {linkedProps.map((prop) => (
                        <span
                          key={prop!.id}
                          className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-medium text-secondary-foreground"
                        >
                          {prop!.title}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price + CTA */}
                  <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
                    <div>
                      <p className="text-[10px] text-muted-foreground">Precio por Ladrillo</p>
                      <p className="text-lg font-bold text-foreground">
                        {fibra.pricePerToken}{" "}
                        <span className="text-sm text-avax-red">AVAX</span>
                      </p>
                    </div>
                    {wallet.connected ? (
                      <button className="flex items-center gap-1.5 rounded-lg bg-avax-red px-5 py-2.5 text-xs font-semibold text-primary-foreground transition-all hover:opacity-90">
                        <TrendingUp className="h-3.5 w-3.5" />
                        Invertir en Fracciones
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    ) : (
                      <button
                        onClick={connectWallet}
                        className="flex items-center gap-1.5 rounded-lg border border-avax-red/50 bg-transparent px-5 py-2.5 text-xs font-semibold text-avax-red transition-all hover:bg-avax-red/10"
                      >
                        <Wallet className="h-3.5 w-3.5" />
                        Conectar Wallet
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Info box */}
        <div className="mt-10 flex items-start gap-3 rounded-xl border border-border bg-card p-5">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-avax-red" />
          <div>
            <p className="text-xs font-semibold text-card-foreground">
              Como funcionan las FIBRAs tokenizadas
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Cada FIBRA es gestionada por el contrato FibraManager.sol. Al invertir, recibes
              tokens ERC-20 (&quot;Ladrillos&quot;) proporcionales a tu aportacion. Los
              dividendos de renta se distribuyen automaticamente on-chain a todas las wallets
              participantes, y puedes reclamarlos en cualquier momento directamente desde tu
              Core Wallet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

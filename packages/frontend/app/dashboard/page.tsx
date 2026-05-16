"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  Building2,
  PieChart,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  FileText,
  Zap,
  Rocket,
  Hash,
} from "lucide-react";
import { mockProperties, mockFibras } from "@/lib/mock-data";
import { useWallet } from "@/lib/wallet-context";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { wallet, connectWallet } = useWallet();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"property" | "fibra">("property");

  const userProperties = mockProperties.slice(0, 3);
  const userFibras = mockFibras.slice(0, 2);

  if (!wallet.connected) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-6 px-6 py-20">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-avax-red/10">
          <Building2 className="h-8 w-8 text-avax-red" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Dashboard de Control</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Conecta tu Core Wallet para acceder al panel de control, gestionar propiedades y
            monitorear tus inversiones en FIBRAs.
          </p>
        </div>
        <button
          onClick={connectWallet}
          className="flex items-center gap-2 rounded-lg bg-avax-red px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 animate-pulse-glow"
        >
          Conectar Core Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="relative px-6 py-10 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard de Control</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Gestiona tus activos, escrows activos y dividendos acumulados.
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-avax-red px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Registrar Nueva Propiedad o FIBRA
          </button>
        </div>

        {/* Stats cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Propiedades Publicadas",
              value: userProperties.length.toString(),
              icon: Building2,
              change: "+1 este mes",
            },
            {
              label: "Escrows Activos",
              value: "1",
              icon: Clock,
              change: "245 AVAX en custodia",
            },
            {
              label: "Dividendos por Cobrar",
              value: "3.75 AVAX",
              icon: TrendingUp,
              change: "+0.5 esta semana",
            },
            {
              label: "Inversiones FIBRA",
              value: userFibras.length.toString(),
              icon: PieChart,
              change: "1,250 LDR totales",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-center justify-between">
                <stat.icon className="h-5 w-5 text-avax-red" />
                <span className="text-[10px] text-success">{stat.change}</span>
              </div>
              <p className="mt-3 text-2xl font-bold text-card-foreground">{stat.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Two columns */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Properties */}
          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-card-foreground">
                <Building2 className="h-4 w-4 text-avax-red" />
                Mis Propiedades
              </h2>
              <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-medium text-secondary-foreground">
                {userProperties.length} activas
              </span>
            </div>
            <div className="divide-y divide-border">
              {userProperties.map((prop) => (
                <div key={prop.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg">
                    <img
                      src={prop.image}
                      alt={prop.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-card-foreground">{prop.title}</p>
                    <p className="text-[10px] text-muted-foreground">{prop.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">
                      {prop.price} <span className="text-xs text-avax-red">AVAX</span>
                    </p>
                    <p
                      className={cn(
                        "text-[10px] font-medium",
                        prop.status === "escrow-active"
                          ? "text-chart-4"
                          : "text-success"
                      )}
                    >
                      {prop.status === "escrow-active" ? "Escrow Activo" : "Publicada"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-card-foreground">
                <FileText className="h-4 w-4 text-avax-red" />
                Actividad Reciente
              </h2>
            </div>
            <div className="divide-y divide-border">
              {wallet.recentTx.map((tx) => (
                <div key={tx.id} className="flex items-center gap-3 px-5 py-4">
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                      tx.type === "ICM Message"
                        ? "bg-chart-4/10 text-chart-4"
                        : tx.type === "Escrow"
                        ? "bg-avax-red/10 text-avax-red"
                        : "bg-success/10 text-success"
                    )}
                  >
                    {tx.type === "ICM Message" ? (
                      <Zap className="h-4 w-4" />
                    ) : tx.type === "Escrow" ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownLeft className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-card-foreground">{tx.description}</p>
                    <p className="text-[10px] text-muted-foreground">{tx.timestamp}</p>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{tx.amount}</span>
                </div>
              ))}

              {/* Extra mock entries */}
              {[
                {
                  icon: <Hash className="h-4 w-4" />,
                  desc: "Propiedad #4721 registrada on-chain",
                  time: "hace 2 dias",
                  color: "bg-avax-red/10 text-avax-red",
                },
                {
                  icon: <TrendingUp className="h-4 w-4" />,
                  desc: "Inversion FIBRA Norte CDMX",
                  time: "hace 3 dias",
                  color: "bg-success/10 text-success",
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 px-5 py-4">
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                      item.color
                    )}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-card-foreground">{item.desc}</p>
                    <p className="text-[10px] text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <h2 className="text-lg font-semibold text-card-foreground">
                  Registrar Nuevo Activo
                </h2>
                <button
                  onClick={() => setModalOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Toggle */}
              <div className="border-b border-border px-6 py-4">
                <div className="flex rounded-lg bg-secondary p-1">
                  <button
                    onClick={() => setModalTab("property")}
                    className={cn(
                      "flex-1 rounded-md px-4 py-2 text-xs font-semibold transition-all",
                      modalTab === "property"
                        ? "bg-avax-red text-primary-foreground shadow"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Registrar Inmueble Unico
                  </button>
                  <button
                    onClick={() => setModalTab("fibra")}
                    className={cn(
                      "flex-1 rounded-md px-4 py-2 text-xs font-semibold transition-all",
                      modalTab === "fibra"
                        ? "bg-avax-red text-primary-foreground shadow"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Crear Portafolio FIBRA
                  </button>
                </div>
              </div>

              {/* Form */}
              <div className="px-6 py-6">
                {modalTab === "property" ? (
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-card-foreground">
                        Direccion Fisica
                      </label>
                      <input
                        type="text"
                        placeholder="Av. Presidente Masaryk 123, Polanco, CDMX"
                        className="h-10 w-full rounded-lg border border-border bg-secondary px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-avax-red focus:outline-none focus:ring-1 focus:ring-avax-red/30"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-card-foreground">
                          Area Total (m&sup2;)
                        </label>
                        <input
                          type="number"
                          placeholder="185"
                          className="h-10 w-full rounded-lg border border-border bg-secondary px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-avax-red focus:outline-none focus:ring-1 focus:ring-avax-red/30"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-card-foreground">
                          Clave Catastral
                        </label>
                        <input
                          type="text"
                          placeholder="CAT-09-016-001"
                          className="h-10 w-full rounded-lg border border-border bg-secondary px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-avax-red focus:outline-none focus:ring-1 focus:ring-avax-red/30"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-card-foreground">
                        Precio de Venta (AVAX)
                      </label>
                      <input
                        type="number"
                        placeholder="245"
                        className="h-10 w-full rounded-lg border border-border bg-secondary px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-avax-red focus:outline-none focus:ring-1 focus:ring-avax-red/30"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-card-foreground">
                        Certificacion de Adeudos (Hashes de Documentos)
                      </label>
                      <textarea
                        placeholder="Ingresa los hashes de certificados de predial, agua, luz..."
                        rows={3}
                        className="w-full rounded-lg border border-border bg-secondary px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-avax-red focus:outline-none focus:ring-1 focus:ring-avax-red/30"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-card-foreground">
                        Nombre del Fondo
                      </label>
                      <input
                        type="text"
                        placeholder="FIBRA Desarrollo Norte CDMX"
                        className="h-10 w-full rounded-lg border border-border bg-secondary px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-avax-red focus:outline-none focus:ring-1 focus:ring-avax-red/30"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-card-foreground">
                          Simbolo del Token (ERC-20)
                        </label>
                        <input
                          type="text"
                          placeholder="LDR-NORTE"
                          className="h-10 w-full rounded-lg border border-border bg-secondary px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-avax-red focus:outline-none focus:ring-1 focus:ring-avax-red/30"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-card-foreground">
                          Precio por Token (AVAX)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.25"
                          className="h-10 w-full rounded-lg border border-border bg-secondary px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-avax-red focus:outline-none focus:ring-1 focus:ring-avax-red/30"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-card-foreground">
                        IDs de Propiedades NFT a Incluir
                      </label>
                      <input
                        type="text"
                        placeholder="prop-001, prop-003 (separados por coma)"
                        className="h-10 w-full rounded-lg border border-border bg-secondary px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-avax-red focus:outline-none focus:ring-1 focus:ring-avax-red/30"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-card-foreground">
                        Porcentaje de Retribucion de Rentas (%)
                      </label>
                      <input
                        type="number"
                        placeholder="80"
                        className="h-10 w-full rounded-lg border border-border bg-secondary px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-avax-red focus:outline-none focus:ring-1 focus:ring-avax-red/30"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
                <button
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-border bg-secondary px-5 py-2.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-accent"
                >
                  Cancelar
                </button>
                <button className="flex items-center gap-2 rounded-lg bg-avax-red px-5 py-2.5 text-xs font-semibold text-primary-foreground transition-all hover:opacity-90">
                  <Rocket className="h-3.5 w-3.5" />
                  Desplegar Contrato e Iniciar Transmision ICM
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

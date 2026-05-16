"use client";

import { useState, use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Maximize2,
  FileText,
  Calendar,
  Hash,
  ExternalLink,
  Shield,
  CheckCircle2,
  Circle,
  Loader2,
  Lock,
  Wallet,
  AlertTriangle,
} from "lucide-react";
import { mockProperties } from "@/lib/mock-data";
import { useWallet } from "@/lib/wallet-context";
import { cn } from "@/lib/utils";
import type { EscrowStatus } from "@/lib/types";

const escrowSteps: { status: EscrowStatus; label: string }[] = [
  { status: "PENDING", label: "Pendiente" },
  { status: "FUNDED", label: "Fondeado" },
  { status: "CONDITIONS_MET", label: "Condiciones OK" },
  { status: "RELEASED", label: "Liberado" },
];

export default function CompraPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { wallet, connectWallet } = useWallet();
  const [escrowStatus, setEscrowStatus] = useState<EscrowStatus>("PENDING");
  const [oracleLoading, setOracleLoading] = useState(false);
  const [oracleVerified, setOracleVerified] = useState(false);
  const [funding, setFunding] = useState(false);

  const property = mockProperties.find((p) => p.id === id);

  if (!property) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 px-6 py-20">
        <AlertTriangle className="h-10 w-10 text-avax-red" />
        <h2 className="text-xl font-bold text-foreground">Propiedad no encontrada</h2>
        <Link
          href="/propiedades"
          className="flex items-center gap-2 text-sm text-avax-red hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Volver al marketplace
        </Link>
      </div>
    );
  }

  const currentStepIndex = escrowSteps.findIndex((s) => s.status === escrowStatus);

  const handleOracleCheck = () => {
    setOracleLoading(true);
    setTimeout(() => {
      setOracleLoading(false);
      setOracleVerified(true);
      if (escrowStatus === "FUNDED") {
        setEscrowStatus("CONDITIONS_MET");
      }
    }, 2500);
  };

  const handleFundEscrow = () => {
    setFunding(true);
    setTimeout(() => {
      setFunding(false);
      setEscrowStatus("FUNDED");
    }, 2000);
  };

  const handleRelease = () => {
    setEscrowStatus("RELEASED");
  };

  return (
    <div className="px-6 py-10 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Back link */}
        <Link
          href="/propiedades"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a Propiedades
        </Link>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: Property detail */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={property.image}
                  alt={property.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-6">
                <h1 className="text-2xl font-bold text-card-foreground">{property.title}</h1>
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {property.location}
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-secondary px-3 py-2.5">
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <Maximize2 className="h-3 w-3" /> Area
                    </div>
                    <p className="mt-1 text-sm font-semibold text-card-foreground">
                      {property.area} m&sup2;
                    </p>
                  </div>
                  <div className="rounded-lg bg-secondary px-3 py-2.5">
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <FileText className="h-3 w-3" /> Catastral
                    </div>
                    <p className="mt-1 font-mono text-xs font-semibold text-card-foreground">
                      {property.cadastralKey}
                    </p>
                  </div>
                  <div className="rounded-lg bg-secondary px-3 py-2.5">
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <Calendar className="h-3 w-3" /> Registro
                    </div>
                    <p className="mt-1 text-xs font-semibold text-card-foreground">
                      {property.registrationDate}
                    </p>
                  </div>
                </div>

                {/* On-chain data */}
                <div className="mt-5 rounded-lg border border-border bg-secondary/50 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-card-foreground">
                    <Hash className="h-3.5 w-3.5 text-avax-red" />
                    Datos On-Chain (Fuji Testnet)
                  </div>
                  <div className="mt-3 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Contrato ERC-721</span>
                      <span className="font-mono text-avax-red">{property.contractHash}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Token ID</span>
                      <span className="font-mono text-card-foreground">{property.tokenId}</span>
                    </div>
                    <button className="mt-1 flex items-center gap-1.5 self-end text-[10px] text-avax-red hover:underline">
                      <ExternalLink className="h-3 w-3" /> Auditar en Snowtrace
                    </button>
                  </div>
                </div>

                {/* Log entries */}
                <div className="mt-5">
                  <h3 className="flex items-center gap-2 text-xs font-semibold text-card-foreground">
                    <Shield className="h-3.5 w-3.5 text-avax-red" />
                    Bitacora Inmutable
                  </h3>
                  <div className="mt-3 flex flex-col gap-2">
                    {property.logEntries.map((entry, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 rounded-lg bg-secondary px-3 py-2"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" />
                        <div className="flex-1">
                          <p className="text-xs text-card-foreground">{entry.action}</p>
                          <p className="text-[10px] text-muted-foreground">{entry.date}</p>
                        </div>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {entry.txHash}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Escrow module */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="border-b border-border px-6 py-4">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-card-foreground">
                  <Lock className="h-5 w-5 text-avax-red" />
                  Escrow Inteligente
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  PropertyEscrow.sol - Custodia automatizada en Fuji Testnet
                </p>
              </div>

              {/* State machine diagram */}
              <div className="px-6 py-6">
                <p className="mb-4 text-[10px] uppercase tracking-wider text-muted-foreground">
                  Estado del Contrato
                </p>
                <div className="flex items-center gap-2">
                  {escrowSteps.map((step, idx) => {
                    const isComplete = idx < currentStepIndex;
                    const isCurrent = idx === currentStepIndex;
                    return (
                      <div key={step.status} className="flex flex-1 flex-col items-center">
                        <div className="flex w-full items-center">
                          <div
                            className={cn(
                              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-500",
                              isComplete
                                ? "border-success bg-success/20 text-success"
                                : isCurrent
                                ? "border-avax-red bg-avax-red/20 text-avax-red animate-pulse-glow"
                                : "border-border bg-secondary text-muted-foreground"
                            )}
                          >
                            {isComplete ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : isCurrent ? (
                              <Circle className="h-5 w-5 fill-current" />
                            ) : (
                              <Circle className="h-5 w-5" />
                            )}
                          </div>
                          {idx < escrowSteps.length - 1 && (
                            <div
                              className={cn(
                                "h-0.5 flex-1 transition-all duration-500",
                                idx < currentStepIndex ? "bg-success" : "bg-border"
                              )}
                            />
                          )}
                        </div>
                        <span
                          className={cn(
                            "mt-2 text-[10px] font-medium",
                            isCurrent ? "text-avax-red" : isComplete ? "text-success" : "text-muted-foreground"
                          )}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Oracle section */}
              <div className="mx-6 mb-6 rounded-xl border border-border bg-secondary/50 p-5">
                <h3 className="flex items-center gap-2 text-xs font-semibold text-card-foreground">
                  <Shield className="h-3.5 w-3.5 text-avax-red" />
                  Oraculo - Chainlink Functions
                </h3>
                <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">
                  Verificacion externa de adeudos y datos gubernamentales mediante HTTP
                  Callback. Este paso valida que la propiedad esta libre de deudas de
                  predial, agua y luz.
                </p>

                <div className="mt-4 flex flex-col gap-2">
                  {["Predial", "Servicio de Agua", "Suministro Electrico"].map(
                    (service) => (
                      <div
                        key={service}
                        className="flex items-center justify-between rounded-lg bg-card px-3 py-2"
                      >
                        <span className="text-xs text-card-foreground">{service}</span>
                        {oracleVerified ? (
                          <span className="flex items-center gap-1 text-[10px] font-medium text-success">
                            <CheckCircle2 className="h-3 w-3" /> Sin adeudos
                          </span>
                        ) : (
                          <span className="text-[10px] text-muted-foreground">
                            Pendiente de verificacion
                          </span>
                        )}
                      </div>
                    )
                  )}
                </div>

                <button
                  onClick={handleOracleCheck}
                  disabled={oracleLoading || oracleVerified}
                  className={cn(
                    "mt-4 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold transition-all",
                    oracleVerified
                      ? "bg-success/10 text-success cursor-default"
                      : "bg-avax-red text-primary-foreground hover:opacity-90"
                  )}
                >
                  {oracleLoading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Verificando datos legales...
                    </>
                  ) : oracleVerified ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Verificacion Legal Completada
                    </>
                  ) : (
                    <>
                      <Shield className="h-3.5 w-3.5" />
                      Ejecutar Verificacion Legal
                    </>
                  )}
                </button>
              </div>

              {/* Purchase section */}
              <div className="border-t border-border px-6 py-6">
                <div className="mb-5 flex items-baseline justify-between">
                  <div>
                    <p className="text-[10px] text-muted-foreground">Precio del Inmueble</p>
                    <p className="text-3xl font-bold text-foreground">
                      {property.price}{" "}
                      <span className="text-base text-avax-red">AVAX</span>
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {"~$"}
                      {property.priceUSD.toLocaleString()} USD
                    </p>
                  </div>
                </div>

                <p className="mb-4 rounded-lg bg-secondary/50 px-4 py-3 text-[10px] leading-relaxed text-muted-foreground">
                  Los fondos permaneceran congelados de forma segura en el contrato
                  PropertyEscrow.sol hasta la transferencia atomica del NFT ERC-721 y la
                  validacion completa por el oraculo de Chainlink.
                </p>

                {!wallet.connected ? (
                  <button
                    onClick={connectWallet}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-avax-red py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 animate-pulse-glow"
                  >
                    <Wallet className="h-4 w-4" />
                    Conectar Core Wallet para Comprar
                  </button>
                ) : escrowStatus === "PENDING" ? (
                  <button
                    onClick={handleFundEscrow}
                    disabled={funding}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-avax-red py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
                  >
                    {funding ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Depositando fondos en escrow...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" />
                        Depositar {property.price} AVAX en Escrow
                      </>
                    )}
                  </button>
                ) : escrowStatus === "FUNDED" ? (
                  <div className="rounded-lg bg-chart-4/10 px-4 py-3 text-center text-xs font-medium text-chart-4">
                    Fondos depositados. Ejecuta la verificacion del oraculo para continuar.
                  </div>
                ) : escrowStatus === "CONDITIONS_MET" ? (
                  <button
                    onClick={handleRelease}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-success py-3 text-sm font-semibold text-success-foreground transition-all hover:opacity-90"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Liberar Fondos y Transferir NFT
                  </button>
                ) : (
                  <div className="rounded-lg bg-success/10 px-4 py-3 text-center text-xs font-medium text-success">
                    Transaccion completada. NFT transferido exitosamente.
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

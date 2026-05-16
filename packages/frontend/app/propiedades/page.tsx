"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Maximize2,
  FileText,
  Calendar,
  Hash,
  ArrowRight,
} from "lucide-react";
import { mockProperties } from "@/lib/mock-data";
import type { PropertyRecord } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusLabels: Record<PropertyRecord["status"], string> = {
  certified: "Fuji Certified",
  presale: "En Preventa",
  "escrow-active": "Escrow Activo",
  "debts-validated": "Adeudos Validados",
};

const statusColors: Record<PropertyRecord["status"], string> = {
  certified: "bg-success/20 text-success",
  presale: "bg-chart-4/20 text-chart-4",
  "escrow-active": "bg-avax-red/20 text-avax-red",
  "debts-validated": "bg-chart-3/20 text-chart-3",
};

const typeLabels: Record<PropertyRecord["type"], string> = {
  apartment: "Departamento",
  house: "Casa",
  penthouse: "Penthouse",
  commercial: "Comercial",
  villa: "Villa",
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4 },
  }),
};

export default function PropiedadesPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");

  const filtered = useMemo(() => {
    return mockProperties.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === "all" || p.status === filterStatus;
      const matchType = filterType === "all" || p.type === filterType;
      return matchSearch && matchStatus && matchType;
    });
  }, [search, filterStatus, filterType]);

  return (
    <div className="px-6 py-10 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Marketplace de Propiedades</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Cada propiedad es un NFT ERC-721 unico verificado en la Fuji Testnet de Avalanche.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nombre o ubicacion..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-avax-red focus:outline-none focus:ring-1 focus:ring-avax-red/30"
            />
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-10 rounded-lg border border-border bg-card px-3 text-xs text-foreground focus:border-avax-red focus:outline-none"
            >
              <option value="all">Estado: Todos</option>
              <option value="certified">Fuji Certified</option>
              <option value="presale">En Preventa</option>
              <option value="escrow-active">Escrow Activo</option>
              <option value="debts-validated">Adeudos Validados</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="h-10 rounded-lg border border-border bg-card px-3 text-xs text-foreground focus:border-avax-red focus:outline-none"
            >
              <option value="all">Tipo: Todos</option>
              <option value="apartment">Departamento</option>
              <option value="house">Casa</option>
              <option value="penthouse">Penthouse</option>
              <option value="commercial">Comercial</option>
              <option value="villa">Villa</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((prop, i) => (
            <motion.div
              key={prop.id}
              variants={fadeUp}
              custom={i}
              className="group overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-avax-red/30 hover:shadow-lg hover:shadow-avax-red/5"
            >
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={prop.image}
                  alt={prop.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span
                  className={cn(
                    "absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
                    statusColors[prop.status]
                  )}
                >
                  {statusLabels[prop.status]}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-base font-semibold text-card-foreground">{prop.title}</h3>
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {prop.location}
                </div>

                {/* Metrics */}
                <div className="mt-3 flex items-center gap-4 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Maximize2 className="h-3 w-3" />
                    {prop.area} m&sup2;
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {prop.cadastralKey}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {prop.registrationDate}
                  </span>
                </div>

                {/* Blockchain data */}
                <div className="mt-4 rounded-lg bg-secondary p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <Hash className="h-3 w-3" />
                      Contrato
                    </div>
                    <span className="font-mono text-[10px] text-avax-red">
                      {prop.contractHash}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">Token ID</span>
                    <span className="font-mono text-[10px] text-card-foreground">
                      {prop.tokenId}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">Bitacora</span>
                    <span className="text-[10px] text-success">
                      {prop.logEntries.length} registros verificados
                    </span>
                  </div>
                </div>

                {/* Price + CTA */}
                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <div>
                    <p className="text-xl font-bold text-foreground">
                      {prop.price}{" "}
                      <span className="text-sm font-medium text-avax-red">AVAX</span>
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {"~$"}
                      {prop.priceUSD.toLocaleString()} USD
                    </p>
                  </div>
                  <Link
                    href={`/compra/${prop.id}`}
                    className="flex items-center gap-1.5 rounded-lg bg-avax-red px-4 py-2 text-xs font-semibold text-primary-foreground transition-all hover:opacity-90"
                  >
                    Ver Detalles
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-sm text-muted-foreground">
              No se encontraron propiedades con los filtros seleccionados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

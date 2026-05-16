"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Coins,
  Zap,
  ArrowRight,
  FileText,
  TrendingUp,
  Fuel,
  Building2,
} from "lucide-react";

function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = Date.now();
          const tick = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return { count, ref };
}

const pillars = [
  {
    icon: Shield,
    title: "Bitacora Inmutable",
    description:
      "Historial verificable de construccion, remodelaciones, inspecciones y adeudos registrado permanentemente en blockchain. Cero manipulacion.",
  },
  {
    icon: Lock,
    title: "Escrow Inteligente",
    description:
      "Compraventa directa gobernada por codigo. Sin comisiones abusivas de intermediarios. Fondos custodiados hasta la transferencia atomica del NFT.",
  },
  {
    icon: Coins,
    title: "Democratizacion (Ladrillos)",
    description:
      "Tokenizacion fraccional ERC-20 que permite invertir desde montos minimos. Cada Ladrillo es una fraccion de propiedad real con derechos de renta.",
  },
  {
    icon: Zap,
    title: "Mensajeria Interchain (ICM)",
    description:
      "Comunicacion nativa entre la L1 personalizada y la C-Chain de Avalanche. Los datos de propiedad viajan de forma segura y verificable entre cadenas.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" },
  }),
};

export default function HomePage() {
  const vol = useCountUp(12480);
  const props = useCountUp(347);
  const divs = useCountUp(89500);
  const gas = useCountUp(94);

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-20 lg:px-12 lg:py-28">
        {/* Background glow */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-avax-red/5 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-[300px] w-[300px] rounded-full bg-avax-red/3 blur-3xl" />

        <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 lg:flex-row lg:items-start lg:gap-16">
          {/* Left copy */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-center lg:text-left"
          >
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-avax-red/30 bg-avax-red/10 px-4 py-1.5 text-xs font-semibold text-avax-red">
              <Zap className="h-3 w-3" /> Avalanche L1 Subnet
            </span>
            <h1 className="mt-4 text-balance text-4xl font-bold leading-tight tracking-tight text-foreground lg:text-5xl xl:text-6xl">
              El futuro inmobiliario es{" "}
              <span className="text-avax-red">inmutable</span>, fraccional y sin
              intermediarios.
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground lg:text-lg">
              Transforma inmuebles en activos inteligentes sobre Avalanche L1.
              Invierte de forma democratica desde montos minimos con tokens de
              copropiedad y FIBRAs tokenizadas.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4 max-lg:justify-center">
              <Link
                href="/propiedades"
                className="inline-flex items-center gap-2 rounded-lg bg-avax-red px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
              >
                Explorar Propiedades
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg border border-avax-red/50 bg-transparent px-6 py-3 text-sm font-semibold text-avax-red transition-all hover:bg-avax-red/10"
              >
                Registrar Activo
              </Link>
            </div>
          </motion.div>

          {/* Right: NFT Mock Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-md shrink-0"
          >
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-2xl">
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-avax-red/10 blur-2xl" />
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full bg-avax-red/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-avax-red">
                  NFT Inmobiliario ERC-721
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">#4721</span>
              </div>

              <div className="mb-5 aspect-[4/3] overflow-hidden rounded-xl bg-secondary">
                <img
                  src="/images/property-1.jpg"
                  alt="Residencial Torre Polanco"
                  className="h-full w-full object-cover"
                />
              </div>

              <h3 className="text-lg font-semibold text-card-foreground">
                Residencial Torre Polanco
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">Polanco, CDMX</p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-secondary px-3 py-2">
                  <p className="text-[10px] text-muted-foreground">Clave Catastral</p>
                  <p className="font-mono text-xs font-medium text-card-foreground">
                    CAT-09-016-001
                  </p>
                </div>
                <div className="rounded-lg bg-secondary px-3 py-2">
                  <p className="text-[10px] text-muted-foreground">Huella Carbono</p>
                  <p className="font-mono text-xs font-medium text-success">12.4 tCO2e</p>
                </div>
                <div className="col-span-2 rounded-lg bg-secondary px-3 py-2">
                  <p className="text-[10px] text-muted-foreground">Contrato ERC-721</p>
                  <p className="truncate font-mono text-xs font-medium text-avax-red">
                    0x7a3b9E4c...8F2eD5a1
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
                <div>
                  <p className="text-[10px] text-muted-foreground">Precio</p>
                  <p className="text-xl font-bold text-card-foreground">
                    245 <span className="text-sm text-avax-red">AVAX</span>
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">{"~$8,575 USD"}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pillars */}
      <section className="border-t border-border px-6 py-20 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="mb-12 text-center"
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-balance text-3xl font-bold text-foreground"
            >
              Pilares del Ecosistema
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="mx-auto mt-3 max-w-2xl text-pretty text-base text-muted-foreground"
            >
              Cuatro tecnologias convergentes que redefinen la propiedad inmobiliaria en
              Latinoamerica.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                variants={fadeUp}
                custom={i + 2}
                className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-avax-red/30 hover:shadow-lg hover:shadow-avax-red/5"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-avax-red/10 text-avax-red transition-colors group-hover:bg-avax-red group-hover:text-primary-foreground">
                  <p.icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-card-foreground">{p.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {p.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-border bg-card/50 px-6 py-20 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
            Estadisticas de la Red
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                ref: vol.ref,
                value: vol.count.toLocaleString(),
                suffix: " AVAX",
                label: "Volumen Total Transaccionado",
                icon: TrendingUp,
              },
              {
                ref: props.ref,
                value: props.count.toLocaleString(),
                suffix: "",
                label: "Propiedades Verificadas",
                icon: Building2,
              },
              {
                ref: divs.ref,
                value: divs.count.toLocaleString(),
                suffix: " AVAX",
                label: "Dividendos Distribuidos",
                icon: FileText,
              },
              {
                ref: gas.ref,
                value: gas.count.toString(),
                suffix: "%",
                label: "Gas Ahorrado vs Ethereum",
                icon: Fuel,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                ref={stat.ref}
                className="flex flex-col items-center rounded-xl border border-border bg-card p-6 text-center"
              >
                <stat.icon className="mb-3 h-6 w-6 text-avax-red" />
                <p className="text-3xl font-bold text-foreground animate-counter-up">
                  {stat.value}
                  <span className="text-lg text-avax-red">{stat.suffix}</span>
                </p>
                <p className="mt-2 text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

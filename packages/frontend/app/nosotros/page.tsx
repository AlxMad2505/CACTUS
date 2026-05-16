"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Twitter } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" },
  }),
};

const founders = [
  {
    name: "Nombre del Co-Fundador 1",
    role: "Core Blockchain Architect",
    bio: "Especialista en desarrollo de subnets Avalanche, contratos inteligentes y arquitectura de protocolos DeFi inmobiliarios.",
    initials: "CF1",
  },
  {
    name: "Nombre del Co-Fundador 2",
    role: "Lead Full-Stack UI Engineer",
    bio: "Experto en interfaces Web3 de alta fidelidad, integracion de wallets y experiencias de usuario para plataformas financieras descentralizadas.",
    initials: "CF2",
  },
];

export default function NosotrosPage() {
  return (
    <div className="px-6 py-16 lg:px-12">
      <div className="mx-auto max-w-5xl">
        {/* Mission */}
        <motion.section
          initial="hidden"
          animate="visible"
          className="mb-20 text-center"
        >
          <motion.span
            variants={fadeUp}
            custom={0}
            className="mb-4 inline-flex items-center rounded-full border border-avax-red/30 bg-avax-red/10 px-4 py-1.5 text-xs font-semibold text-avax-red"
          >
            Nuestra Historia
          </motion.span>
          <motion.h1
            variants={fadeUp}
            custom={1}
            className="mt-4 text-balance text-4xl font-bold leading-tight text-foreground lg:text-5xl"
          >
            Redefiniendo el mercado inmobiliario desde la confianza digital
          </motion.h1>
          <motion.div
            variants={fadeUp}
            custom={2}
            className="mx-auto mt-8 max-w-3xl"
          >
            <div className="rounded-xl border border-border bg-card p-8">
              <h2 className="mb-4 text-lg font-semibold text-avax-red">Mision</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Democratizar el acceso a la inversion inmobiliaria en Mexico y Latinoamerica
                eliminando la desconfianza, la burocracia y los sobrecostos del mercado
                tradicional. Utilizamos la blockchain de Avalanche para crear un sistema
                transparente, eficiente y accesible para todos.
              </p>
              <h2 className="mb-4 mt-8 text-lg font-semibold text-avax-red">Vision</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Convertirnos en el ecosistema de referencia para la tokenizacion y
                fraccionamiento inmobiliario en Latinoamerica, donde cada persona pueda ser
                copropietaria de activos de alta calidad sin importar su capital inicial,
                respaldado por la seguridad e inmutabilidad de una L1 dedicada.
              </p>
            </div>
          </motion.div>
        </motion.section>

        {/* Founders */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2
            variants={fadeUp}
            custom={0}
            className="mb-12 text-center text-3xl font-bold text-foreground"
          >
            Equipo Fundador
          </motion.h2>

          <div className="flex justify-center gap-8 max-md:flex-col max-md:items-center">
            {founders.map((f, i) => (
              <motion.div
                key={f.name}
                variants={fadeUp}
                custom={i + 1}
                className="group w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-card p-8 text-center transition-all duration-300 hover:border-avax-red/30 hover:shadow-lg hover:shadow-avax-red/5"
              >
                {/* Avatar placeholder */}
                <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-avax-red/20 via-avax-red/5 to-primary/10 ring-4 ring-avax-red/20 transition-all group-hover:ring-avax-red/40">
                  <span className="text-2xl font-bold text-avax-red">{f.initials}</span>
                </div>

                <h3 className="text-lg font-semibold text-card-foreground">{f.name}</h3>
                <p className="mt-1 text-xs font-medium text-avax-red">{f.role}</p>
                <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                  {f.bio}
                </p>

                {/* Social icons */}
                <div className="mt-6 flex items-center justify-center gap-3">
                  {[Github, Linkedin, Twitter].map((Icon, idx) => (
                    <button
                      key={idx}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors hover:bg-avax-red/10 hover:text-avax-red"
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}

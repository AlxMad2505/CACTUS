"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Instagram } from "lucide-react";

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
    name: "Miguel Angel Correa Martínez",
    role: "Full-Stack Engineer & Blockchain Developer (Backend & Data Models)",
    bio: "Ingeniero en Computación de la UNAM con experiencia en arquitectura de software y desarrollo web. Apasionado por IA, Web3 y la tokenización de activos. Visualiza un futuro donde las propiedades estén ligadas de manera digital a sus dueños quitando la burocracia innecesaria actual.",
    initials: "MAC",
    image: "/images/mikeDevPFP.png",
    socials: {
      github: "https://github.com/MikeDev000",
      linkedin: "https://www.linkedin.com/in/miguel-angel-correa-martinez",
      instagram: "https://www.instagram.com/mikeoff000/",
    },
  },
  {
    name: "Alejandro Madrigal Urencio",
    role: "Full-Stack Engineer & Blockchain Developer (Backend & Frontend UI/UX)",
    bio: "Ingeniero en Computación de la UNAM apasionado por el desarrollo de interfaces digitales con enfoque en la experiencia de usuario y el desarrollo de software. Especialista en transformar conceptos en experiencias interactivas e intuitivas.",
    initials: "AMU",
    image: "/images/alexDevPFP.png",
    socials: {
      github: "https://github.com/AlxMad2505",
      linkedin: "https://www.linkedin.com/in/alejandro-madrigal-07b523408/",
      instagram: "https://www.instagram.com/alex_el_loco25/",
    },
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
                fraccionamiento inmobiliario en Latinoamerica; así como poder crear un histórico de cada inmueble existente en el mundo, avalando oficialmente la pertenencia de las propiedades con sus dueños sin necesidad de depender de un "papel". Un mundo donde cualquier persona con conexión a internet pueda ser
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
                {/* Avatar Coin Flip */}
                <div className="mx-auto mb-6 h-28 w-28" style={{ perspective: '1000px' }}>
                  <div className="relative h-full w-full transition-transform duration-700 group-hover:[transform:rotateY(180deg)]" style={{ transformStyle: 'preserve-3d' }}>
                    {/* Front face (Initials) */}
                    <div className="absolute inset-0 rounded-full flex items-center justify-center bg-gradient-to-br from-avax-red/20 via-avax-red/5 to-primary/10 ring-4 ring-avax-red/20" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
                      <span className="text-2xl font-bold text-avax-red">{f.initials}</span>
                    </div>
                    {/* Back face (Image) */}
                    <div className="absolute inset-0 rounded-full ring-4 ring-avax-red/40 overflow-hidden [transform:rotateY(180deg)]" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
                      <img
                        src={f.image}
                        alt={f.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-card-foreground">{f.name}</h3>
                <p className="mt-1 text-xs font-medium text-avax-red">{f.role}</p>
                <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                  {f.bio}
                </p>

                {/* Social icons */}
                <div className="mt-6 flex items-center justify-center gap-3">
                  <a
                    href={f.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors hover:bg-avax-red/10 hover:text-avax-red"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                  <a
                    href={f.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors hover:bg-avax-red/10 hover:text-avax-red"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a
                    href={f.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors hover:bg-avax-red/10 hover:text-avax-red"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { WalletProvider } from "@/lib/wallet-context";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CACTUS - Inversiones Digitales Inmobiliarias",
  description:
    "Plataforma de tokenizacion inmobiliaria sobre Avalanche. Bitacoras inmutables, escrows inteligentes y crowdfunding fraccional.",
  icons: {
    icon: "/cactus-ico.jpg",
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#051424",
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="bg-background">
      <body className="font-sans antialiased">
        <WalletProvider>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
              <Header />
              <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
          </div>
        </WalletProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
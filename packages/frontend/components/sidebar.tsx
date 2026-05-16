"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Home,
  Building2,
  PieChart,
  LayoutDashboard,
  Users,
  Settings,
  Globe,
  ChevronLeft,
  ChevronRight,
  Wifi,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWallet } from "@/lib/wallet-context";

const navItems = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/propiedades", label: "Propiedades", icon: Building2 },
  { href: "/fibras", label: "FIBRAs", icon: PieChart },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/nosotros", label: "Sobre Nosotros", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();
  const { wallet } = useWallet();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar/90 backdrop-blur-xl transition-all duration-300",
          collapsed ? "w-[72px]" : "w-[260px]"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-sidebar-border px-4 py-5">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary">
            <Building2 className="h-5 w-5 text-primary-foreground" />
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-sidebar bg-avax-red" />
          </div>
          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold text-sidebar-foreground">
                Propiedad Digital
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-avax-red">
                <Wifi className="h-2.5 w-2.5" />
                Avalanche L1 / Fuji Testnet
              </span>
            </div>
          )}
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-sidebar-accent text-avax-red"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-[18px] w-[18px] shrink-0 transition-colors",
                        isActive ? "text-avax-red" : "text-muted-foreground group-hover:text-sidebar-foreground"
                      )}
                    />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom section */}
        <div className="border-t border-sidebar-border px-3 py-4">
          {!collapsed && (
            <div className="mb-3 flex flex-col gap-2 px-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5" />
                  <span>Idioma: ES</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Red: Fuji Testnet</span>
                <span className="flex h-2 w-2 rounded-full bg-success" />
              </div>
            </div>
          )}

          {/* User profile */}
          {wallet.connected && !collapsed && (
            <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent px-3 py-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-avax-red to-primary/50">
                <span className="text-xs font-bold text-primary-foreground">PD</span>
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="truncate text-xs font-medium text-sidebar-foreground">
                  {wallet.address}
                </span>
                <span className="text-[10px] text-success">Online en Fuji C-Chain</span>
              </div>
            </div>
          )}

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="mt-3 flex w-full items-center justify-center rounded-lg py-2 text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
      </aside>

      {/* Spacer */}
      <div
        className={cn(
          "shrink-0 transition-all duration-300",
          collapsed ? "w-[72px]" : "w-[260px]"
        )}
      />
    </>
  );
}

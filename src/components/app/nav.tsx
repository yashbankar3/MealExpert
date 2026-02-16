"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, CalendarDays, ShoppingCart, Package, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/recipes", label: "Recipes", icon: BookOpen },
  { href: "/planner", label: "Planner", icon: CalendarDays },
  { href: "/grocery", label: "Grocery", icon: ShoppingCart },
  { href: "/pantry", label: "Pantry", icon: Package },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function AppNav() {
  const pathname = usePathname();
  return (
    <>
      <nav className="sticky top-0 z-30 hidden gap-2 border-b border-white/10 bg-black/10 p-3 backdrop-blur lg:flex">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className={cn("rounded-xl px-3 py-2 text-sm", pathname === item.href ? "bg-white/20" : "hover:bg-white/10")}>
              <span className="inline-flex items-center gap-2"><Icon className="h-4 w-4" />{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-7 border-t border-white/10 bg-black/30 p-1 backdrop-blur lg:hidden">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} aria-label={item.label} className={cn("flex flex-col items-center rounded-lg p-2 text-[10px]", pathname === item.href ? "bg-white/20" : "") }>
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, GitCompareArrows, Info, Users, Bike } from "lucide-react";
import { cn } from "@/lib/utils";

const NavItem = ({ href, icon: Icon, label, isActive }: { href: string; icon: React.ElementType; label: string; isActive: boolean }) => (
  <Link
    href={href}
    className={cn(
      "flex flex-col items-center justify-center rounded-xl px-2 py-1 text-muted-foreground transition-all hover:text-primary active:scale-90 w-16",
      isActive && "bg-primary/10 text-primary"
    )}
  >
    <Icon className="mb-1 h-6 w-6" {...(isActive && { fill: "currentColor" })} />
    <span className="font-semibold text-[10px] uppercase tracking-wider">{label}</span>
  </Link>
);

export const BottomNavBar = () => {
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: Home, label: "Início" },
    { href: "/#models", icon: Bike, label: "Motos" },
    { href: "/how-it-works", icon: Info, label: "Dúvidas" },
    { href: "/about", icon: Users, label: "Sobre" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 z-40 w-full flex h-20 items-center justify-around rounded-t-2xl border-t bg-background/80 px-2 backdrop-blur-lg">
       {navItems.map(item => (
        <NavItem 
          key={item.href}
          href={item.href} 
          icon={item.icon} 
          label={item.label} 
          isActive={pathname === item.href} 
        />
      ))}
    </nav>
  );
};

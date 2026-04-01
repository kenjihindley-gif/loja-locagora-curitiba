'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

export function DesktopHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "hidden md:flex font-headline font-bold tracking-tight fixed top-0 w-full z-50 justify-between items-center px-8 h-20 transition-colors duration-300",
      scrolled ? "bg-black/80 backdrop-blur-lg border-b border-gray-700" : "bg-black border-b border-transparent"
    )}>
      <div className="flex items-center gap-10">
        <a href="https://www.instagram.com/locagoracuritibaoficial/" target="_blank" rel="noopener noreferrer">
          <Image src="https://i.imgur.com/X4STrg9.png" alt="Logo" width={120} height={40} />
        </a>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="text-white/80 hover:text-white transition-colors">
            Início
          </Link>
          <Link href="/#models" className="text-white/80 hover:text-white transition-colors">
            Modelos
          </Link>
          <Link href="/how-it-works" className="text-white/80 hover:text-white transition-colors">
            Como Funciona
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" className="font-semibold text-secondary hover:bg-secondary/10 hover:text-secondary">
          <Link href="/about">Sobre Nós</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/success">Fale Conosco</Link>
        </Button>
      </div>
    </header>
  );
}

import Link from "next/link";
import Image from "next/image";
import { Instagram } from "lucide-react";

export function AppFooter() {
    return (
        <footer className="hidden md:block w-full bg-primary text-primary-foreground mt-auto">
            <div className="w-full px-12 py-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-3 items-center gap-6">
                    <div className="flex justify-start">
                        <a href="https://www.instagram.com/locagoracuritibaoficial/" target="_blank" rel="noopener noreferrer">
                            <Image src="https://i.imgur.com/G2MGvVR.png" alt="Logo LocaGOra" width={120} height={40} />
                        </a>
                    </div>
                    
                    <div className="text-sm text-center">
                         <p className="font-body font-light text-primary-foreground/80">© 2026 LocaGOra. Todos os direitos reservados.</p>
                    </div>

                    <div className="flex gap-6 justify-end">
                        <Link className="text-primary-foreground/80 hover:text-white font-body text-sm font-light hover:underline transition-all" href="/about">Sobre Nós</Link>
                        <a className="text-primary-foreground/80 hover:text-white font-body text-sm font-light hover:underline transition-all" href="https://locagora-projeto.vercel.app/" target="_blank" rel="noopener noreferrer">Suporte</a>
                        <Link className="text-primary-foreground/80 hover:text-white font-body text-sm font-light hover:underline transition-all" href="#">Política de Privacidade</Link>
                    </div>
                </div>
                <div className="border-t border-primary-foreground/20 mt-8 pt-6 flex items-center justify-between relative">
                    <a href="https://www.instagram.com/locagoracuritibaoficial/" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 hover:text-white transition-colors">
                        <Instagram className="w-5 h-5" />
                    </a>
                    <p className="text-xs text-primary-foreground/60 text-center absolute left-1/2 -translate-x-1/2">Av. Anne Frank, 3687 - Boqueirão, Curitiba - PR, 81650-000</p>
                </div>
            </div>
        </footer>
    );
}

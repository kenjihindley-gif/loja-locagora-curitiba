import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, MessageCircle, Award, Home, Bike as Motorcycle } from "lucide-react";

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <main className="max-w-lg w-full text-center space-y-12">
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute w-32 h-32 bg-secondary/10 rounded-full animate-pulse"></div>
          <div className="relative w-24 h-24 bg-secondary text-secondary-foreground flex items-center justify-center rounded-full shadow-lg shadow-secondary/20">
            <Check className="h-12 w-12" strokeWidth={3} />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="font-headline font-bold text-3xl md:text-4xl text-primary tracking-tight leading-tight">
            Excelente escolha! Sua <span className="text-secondary">Apex Predator 1200</span> está quase pronta.
          </h1>
          <p className="text-muted-foreground font-medium text-lg px-4">
            Estamos preparando os motores. Enquanto isso, siga o checklist abaixo.
          </p>
        </div>

        <section className="bg-card rounded-[2rem] p-8 text-left space-y-6 relative overflow-hidden shadow-sm border">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
            <p className="font-headline font-bold text-sm uppercase tracking-[0.2em] text-primary mb-6">Checklist de Direcionamento</p>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 w-6 h-6 flex-shrink-0 bg-secondary rounded-full flex items-center justify-center">
                  <Check className="text-white h-4 w-4" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-lg leading-snug">Prepare sua CNH (A)</p>
                  <p className="text-muted-foreground text-sm font-medium">Documento obrigatório para a liberação.</p>
                </div>
              </div>
               <div className="flex items-start gap-4">
                <div className="mt-1 w-6 h-6 flex-shrink-0 border-2 border-dashed border-muted-foreground rounded-full flex items-center justify-center">
                </div>
                <div>
                  <p className="font-bold text-foreground text-lg leading-snug">Pagamento da entrada</p>
                  <p className="text-muted-foreground text-sm font-medium">Será solicitado no WhatsApp.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="w-full space-y-4 px-2">
          <label className="block text-sm font-bold text-muted-foreground uppercase tracking-wider text-center" htmlFor="seller-code">
            Foi atendido por alguém? Digite o código:
          </label>
          <div className="relative group max-w-sm mx-auto">
            <Input 
              className="w-full bg-muted border-none rounded-full px-8 h-16 text-center font-headline font-bold text-xl text-primary focus:ring-4 focus:ring-primary/20 placeholder:text-muted-foreground/40 transition-all uppercase" 
              id="seller-code" 
              placeholder="CÓDIGO (OPCIONAL)" 
              type="text" 
            />
            <Award className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary" />
          </div>
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 w-full p-6 bg-background/80 backdrop-blur-lg border-t z-50 md:hidden">
        <div className="max-w-lg mx-auto">
          <Button asChild size="lg" variant="secondary" className="w-full h-16 rounded-full font-headline font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-secondary/20 active:scale-95 transition-transform">
            <a href="https://wa.me/" target="_blank" rel="noopener noreferrer">
              <MessageCircle fill="currentColor" />
              Ir para o WhatsApp e Finalizar
            </a>
          </Button>
          <p className="text-center text-[10px] font-body font-bold text-muted-foreground uppercase tracking-widest mt-4">Conexão Segura LocaGOra © 2026</p>
        </div>
      </footer>
      
      <div className="hidden md:flex flex-col items-center mt-12 gap-6">
        <Button asChild size="lg" variant="secondary" className="w-full max-w-md h-16 rounded-full font-headline font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-secondary/20 active:scale-95 transition-transform">
            <a href="https://wa.me/" target="_blank" rel="noopener noreferrer">
              <MessageCircle fill="currentColor" />
              Ir para o WhatsApp e Finalizar
            </a>
        </Button>
        <div className="flex gap-4">
            <Button asChild variant="outline">
                <Link href="/"><Home className="mr-2 h-4 w-4"/> Voltar ao Início</Link>
            </Button>
            <Button asChild variant="ghost">
                <Link href="/#models">Ver outros modelos <Motorcycle className="ml-2 h-4 w-4"/></Link>
            </Button>
        </div>
         <p className="text-center text-[10px] font-body font-bold text-muted-foreground uppercase tracking-widest mt-4">Conexão Segura LocaGOra © 2026</p>
      </div>

    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Users, Rocket, Target, BarChart, Globe } from "lucide-react";

const StatCard = ({ icon: Icon, value, label }: { icon: React.ElementType, value: string, label: string }) => (
    <div className="flex items-center gap-4 bg-primary/10 p-4 rounded-lg">
        <Icon className="w-8 h-8 text-secondary" />
        <div>
            <p className="text-2xl font-bold text-primary">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
        </div>
    </div>
)

export default function AboutPage() {
  return (
    <div className="bg-background">
      <main className="pb-24">
        {/* Hero Section */}
        <section className="bg-black text-white">
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="text-center md:text-left">
                        <Badge variant="secondary" className="mb-4 text-base py-1 px-4 animate-pulse">NOVO PARCEIRO</Badge>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold font-headline tracking-tighter drop-shadow-lg">
                            Rodrigo Faro acelera com a LocaGOra!
                        </h1>
                        <p className="mt-6 text-lg md:text-xl text-white/90 max-w-2xl mx-auto md:mx-0">
                            A parceria que vai revolucionar a mobilidade urbana no Brasil está formada. Juntos, vamos mais longe!
                        </p>
                    </div>
                    <div className="flex justify-center">
                        <Image 
                            src="https://i.imgur.com/ffKNKAF.jpeg" 
                            alt="Rodrigo Faro com uma moto" 
                            width={500} 
                            height={500} 
                            className="rounded-2xl shadow-2xl object-cover aspect-[4/5]"
                        />
                    </div>
                </div>
            </div>
        </section>

        {/* Intro Section */}
        <section className="py-16 md:py-24 px-4">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-extrabold font-headline text-primary tracking-tight">
                    Mais que aluguel, um ecossistema de oportunidades.
                </h2>
                <div className="mt-6 text-muted-foreground space-y-4 text-lg">
                    <p>
                        A LocaGOra nasceu para revolucionar o mercado de mobilidade e transformar a vida de quem trabalha no corre todos os dias. Somos uma das maiores redes de locação de motos do Brasil, presentes em diversas regiões do país, oferecendo muito mais do que veículos: entregamos acesso, oportunidade e liberdade para crescer.
                    </p>
                    <p>
                        Com processos otimizados, tecnologia própria e uma operação totalmente preparada para atender em escala, nos tornamos referência para entregadores, empresas e empreendedores que precisam de mobilidade confiável e rentável.
                    </p>
                </div>
            </div>
        </section>
        
        {/* Founder Section */}
        <section className="bg-muted py-16 md:py-24 px-4">
            <div className="max-w-6xl mx-auto grid md:grid-cols-5 gap-8 md:gap-12 items-center">
                <div className="md:col-span-2">
                     <Image 
                        src="https://classic.exame.com/wp-content/uploads/2025/01/FOTO-PERSONAGEM.jpg?resize=820,1093"
                        alt="Fillipe Félix, fundador da LocaGOra" 
                        width={820} 
                        height={1093} 
                        className="rounded-2xl shadow-2xl object-cover aspect-[4/5]"
                    />
                </div>
                <div className="md:col-span-3">
                    <h3 className="text-3xl font-bold font-headline text-foreground mb-4">A Mente por Trás da Revolução</h3>
                    <div className="space-y-4 text-muted-foreground">
                        <p>
                            A trajetória de <span className="font-bold text-foreground">Fillipe Félix</span> é marcada por improviso e reinvenção. Empreendedor desde os 6 anos, ele viu na crise da pandemia uma oportunidade. Precisando entregar castanhas de sua antiga empresa e sem conseguir motoboys, ele investigou o mercado e descobriu uma demanda gigantesca por motos.
                        </p>
                        <p>
                           O início foi modesto: com R$ 15.000, comprou a primeira moto para aluguel. O resultado foi imediato. Vendeu tudo o que tinha, investiu em uma frota maior e, em pouco tempo, já faturava R$ 50.000 por mês. A virada de chave foi a criação do modelo de franquias, que permitiu à LocaGOra ganhar escala nacional.
                        </p>
                         <blockquote className="border-l-4 border-secondary pl-4 italic text-foreground">
                            &quot;Hoje, o mercado de delivery no Brasil ainda está engatinhando. O potencial de crescimento é enorme.&quot;
                            <cite className="block not-italic mt-2 font-semibold text-muted-foreground">— Fillipe Félix</cite>
                        </blockquote>
                    </div>
                </div>
            </div>
        </section>

        {/* Video Section */}
        <section className="py-16 md:py-24 px-4">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">Entenda o modelo LocaGOra</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">O fundador Fillipe Félix explica como a LocaGOra está mudando o jogo da mobilidade urbana.</p>
                <div className="mt-8 aspect-video rounded-2xl shadow-2xl overflow-hidden border-4 border-secondary">
                    <iframe 
                        className="w-full h-full"
                        src="https://www.youtube.com/embed/Pyyz43dU5Yg" 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen>
                    </iframe>
                </div>
            </div>
        </section>
        
        {/* Partnership section */}
        <section className="bg-primary text-primary-foreground py-16 md:py-24 px-4">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                <div className="text-center md:text-left">
                    <h3 className="text-3xl md:text-4xl font-bold font-headline">Uma Parceria de Sucesso</h3>
                    <p className="mt-4 text-lg text-primary-foreground/80">A união de Fillipe Félix e Rodrigo Faro representa a fusão da visão empreendedora com o poder da comunicação, levando a LocaGOra a um novo patamar de reconhecimento e confiança em todo o Brasil.</p>
                </div>
                 <Image 
                    src="https://i.ytimg.com/vi/rHcrqLXIZcU/oardefault.jpg"
                    alt="Fillipe Félix e Rodrigo Faro"
                    width={1280}
                    height={720}
                    className="rounded-2xl shadow-2xl"
                />
            </div>
        </section>

        {/* Details Section */}
        <section className="py-16 md:py-24 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground">A Estrutura de um Gigante</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">Entenda os pilares que sustentam nosso crescimento acelerado.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12 text-center">
                    <Card className="p-6">
                        <Rocket className="mx-auto w-10 h-10 text-secondary mb-2" />
                        <CardTitle className="font-headline text-3xl text-primary">460</CardTitle>
                        <p className="text-muted-foreground">Franquias</p>
                    </Card>
                     <Card className="p-6">
                        <Users className="mx-auto w-10 h-10 text-secondary mb-2" />
                        <CardTitle className="font-headline text-3xl text-primary">12.000</CardTitle>
                        <p className="text-muted-foreground">Motos na Frota</p>
                    </Card>
                     <Card className="p-6">
                        <BarChart className="mx-auto w-10 h-10 text-secondary mb-2" />
                        <CardTitle className="font-headline text-3xl text-primary">R$ 200Mi</CardTitle>
                        <p className="text-muted-foreground">Faturamento 2024</p>
                    </Card>
                </div>

                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="structure">
                        <AccordionTrigger className="text-xl font-headline"><Users className="mr-2 text-secondary"/>Estrutura Atual</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-base space-y-2 pt-2">
                           <p>Cada franqueado paga R$ 60.000 pela licença e 8% do faturamento bruto. A LocaGOra cuida de toda a manutenção, IPVA e seguros, enquanto os franqueados gerenciam a operação local. Para o motoboy, o aluguel médio é de R$ 50 a R$ 60 por dia.</p>
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="challenges">
                        <AccordionTrigger className="text-xl font-headline"><Target className="mr-2 text-secondary"/>Desafios e Soluções</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-base space-y-2 pt-2">
                           <p>A inadimplência e os custos com acidentes são desafios constantes. Para mitigar isso, estamos lançando uma cooperativa própria para cobrir danos, roubos e multas, protegendo nossos franqueados e garantindo a sustentabilidade do negócio com um custo mensal de R$ 100 por moto.</p>
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="future">
                        <AccordionTrigger className="text-xl font-headline"><Globe className="mr-2 text-secondary"/>O Futuro da LocaGOra</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-base space-y-4 pt-2">
                           <p><strong>Internacionalização:</strong> Planejamos abrir nossa primeira operação no México em 2025.</p>
                           <p><strong>Centralização:</strong> Estamos investindo em 45 prédios próprios para centralizar operações de franquias até 2025, aumentando a eficiência.</p>
                           <p><strong>Marca Própria:</strong> Lançaremos uma linha de motos com marca própria, aumentando a margem de lucro e fortalecendo nossa presença no mercado.</p>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </section>

        {/* Exame Credit */}
        <div className="text-center py-10 px-4 border-t bg-muted">
            <p className="text-sm text-muted-foreground">
                Baseado em matéria original publicada em Exame.com.
            </p>
             <Link href="https://exame.com/negocios/ele-faz-r-200-milhoes-alugando-motos-para-entregadores-e-agora-vai-expandir-o-negocio-pelo-mundo/?utm_source=copiaecola&utm_medium=compartilhamento" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                Leia a matéria completa
             </Link>
        </div>
      </main>
    </div>
  );
}

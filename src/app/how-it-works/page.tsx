'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, MapPin, Wrench, Shield, FileText, Wallet, Calendar, Bike, Info, Gauge, Rocket, Clock, Zap } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function HowItWorksPage() {
  const [activeAccordion, setActiveAccordion] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash === '#manutencao') {
        setActiveAccordion('item-3');
        // Optional: scroll to the element after a short delay to ensure it's rendered and expanded
        setTimeout(() => {
          const element = document.getElementById('manutencao');
          if (element) {
            const y = element.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }, 100);
      }
    }
  }, []);

  return (
    <div className="bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 pb-40 md:pb-24">
        <div className="text-center mb-20">
          <Badge variant="secondary" className="mb-4">Seu Caminho para a Liberdade</Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold font-headline text-primary tracking-tighter">
            Como Funciona
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
            Entenda como nosso processo de locação de motos 0km é simples, rápido e sem burocracia. Prepare-se para acelerar!
          </p>
        </div>

        <Section title="Nossos Planos de Locação">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <InfoCard 
                  icon={Bike}
                  title="Plano Fidelidade (28 Meses)"
                  description="O famoso plano onde a moto É SUA no final! A conquista definitiva sobre duas rodas."
              />
              <InfoCard 
                  icon={Calendar}
                  title="Plano Anual (12 Meses)"
                  description="Ideal para quem busca liberdade e flexibilidade. Ao final do contrato, você devolve a moto."
              />
          </div>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto"><Info className="inline h-4 w-4 mr-2"/>Por trabalharmos apenas com motos 0km, não oferecemos planos com duração inferior a 12 meses.</p>
        </Section>


        <Section title="Processo Rápido e Sem Burocracia">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Feature title="Sem Análise de Crédito" />
                <Feature title="Sem Análise de Score" />
                <Feature title="Não Precisa Ter Nome Limpo" />
                <Feature title="Sem Burocracia de Financiamento" />
                <Feature title="Saia com a Moto na Hora" />
                <Feature title="Parcelas Fixas" />
            </div>
        </Section>

        <Section title="O Que Você Precisa Para Sair Acelerando?">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <RequirementCard
                    icon={Wallet}
                    title="Pagamento Inicial"
                    items={[
                        "R$ 700,00 (Caução)",
                        "R$ 50,00 (Documentação)",
                        "Valor da primeira semana"
                    ]}
                    footer="Aceitamos PIX, débito e crédito."
                />
                 <RequirementCard
                    icon={FileText}
                    title="Documentos Essenciais"
                    items={[
                        "CNH válida (Categoria A)",
                        "Comprovante de residência em seu nome",
                        "Acesso à CNH Digital ou app GOV.BR"
                    ]}
                    footer="Verifique abaixo os comprovantes aceitos."
                />
                 <RequirementCard
                    icon={Bike}
                    title="Para a Retirada"
                    items={[
                        "Capacete (item obrigatório)",
                        "Chegar na loja antes das 17h",
                        "Muita vontade de pilotar!"
                    ]}
                    footer="Nossa equipe te espera."
                />
            </div>
        </Section>
        
        <Section title="Detalhes do Contrato e Coberturas">
            <Accordion type="single" collapsible className="w-full max-w-4xl mx-auto" value={activeAccordion} onValueChange={setActiveAccordion}>
                <AccordionItem value="item-1">
                    <AccordionTrigger className="font-headline text-lg"><Shield className="mr-2 text-secondary"/>Raio de Circulação e Viagens</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground space-y-4 pl-8">
                       <p>Sua segurança contratual (Seguro) cobre um raio de 100 km em linha reta a partir da base da Locadora.</p>
                       <div>
                         <p className="font-bold text-foreground">Posso ir mais longe? Sim!</p>
                         <p>O contrato permite deslocamento fora da área, mas você precisa de autorização prévia. Se for sair do raio de 100km, você deve vir presencialmente à loja 1 dia antes. A equipe fará o pedido da liberação para aumentar a &quot;parede digital&quot; do rastreador e evitar bloqueio na estrada.</p>
                       </div>
                       <p className="flex items-start gap-2"><AlertTriangle className="inline h-5 w-5 mr-1 text-destructive/80 mt-1 flex-shrink-0"/> <span className="font-semibold">Importante:</span> Fora da área de cobertura de 100km, o seguro não se aplica e qualquer ocorrência é de responsabilidade do cliente.</p>
                    </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-2">
                    <AccordionTrigger className="font-headline text-lg"><Rocket className="mr-2 text-secondary"/>Limite de Quilometragem</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground space-y-4 pl-8">
                        <p>A franquia padrão do contrato é de <span className="font-bold text-foreground">6.000 km por mês</span>. Isso é suficiente para uso intenso (média de 200km/dia).</p>
                        <div>
                            <p className="font-bold text-foreground">Vai rodar mais que isso?</p>
                            <p>Se perceber que vai estourar o limite, entre em contato com o suporte <span className="font-bold">ANTES</span> de atingir os 6.000km. Em muitos casos, conseguimos liberar um pacote adicional sem custo.</p>
                        </div>
                        <p><AlertTriangle className="inline h-4 w-4 mr-1 text-destructive/80"/> Se exceder sem avisar, o km excedente será cobrado (R$ 0,39/km).</p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" id="manutencao">
                    <AccordionTrigger className="font-headline text-lg"><Wrench className="mr-2 text-secondary"/>Manutenção e Revisões</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground space-y-4 pl-8">
                       <p>Todas as manutenções preventivas (relação, óleo, filtro, pastilhas, etc.), revisões e IPVAs durante o contrato são por nossa conta.</p>
                       <div>
                            <h4 className="font-bold text-foreground">Frequência de Revisão:</h4>
                            <ul className="list-disc list-inside mt-2">
                                <li><span className="font-semibold">Shineray/Avelloz:</span> Revisão a cada 1.000 km.</li>
                                <li><span className="font-semibold">Suzuki/Yamaha:</span> 1ª revisão com 1.000 km, demais a cada 1.500 km.</li>
                            </ul>
                       </div>
                       <div>
                            <h4 className="font-bold text-foreground">Regra de Ouro: Agendamento</h4>
                            <p>Não atendemos por ordem de chegada. Você deve agendar com no mínimo 36 horas de antecedência pelo WhatsApp do suporte.</p>
                            <p className="flex items-center gap-2 mt-2"><AlertTriangle className="inline h-4 w-4 mr-1 text-destructive/80"/> <span className="font-semibold">Multa por falta:</span> R$ 200,00.</p>
                       </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                    <AccordionTrigger className="font-headline text-lg"><Wallet className="mr-2 text-secondary"/>Pagamentos</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground space-y-4 pl-8">
                        <p>Nosso sistema financeiro é automatizado. Os boletos são enviados automaticamente via WhatsApp e E-mail com antecedência.</p>
                        <p>O modelo de locação é <span className="font-bold text-foreground">Semanal Pré-pago</span>. Você paga para usar na semana seguinte.</p>
                        <ul className="list-disc list-inside mt-2">
                            <li>São gerados 4 boletos mensais (ciclo de 4 semanas).</li>
                            <li>Você pode pagar um por semana ou adiantar todos e pagar o mês cheio de uma vez.</li>
                        </ul>
                        <p className="flex items-start gap-2"><Clock className="inline h-5 w-5 mr-1 text-destructive/80 mt-1 flex-shrink-0"/> <span className="font-semibold">Bloqueio Automático:</span> O sistema bloqueia a moto automaticamente após 72 horas de atraso. Para desbloquear, é necessário quitar o débito + taxa de R$ 30,00.</p>
                    </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-5">
                    <AccordionTrigger className="font-headline text-lg"><Zap className="mr-2 text-secondary"/>Sistema Elétrico e Instalações</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground space-y-4 pl-8">
                        <p className="font-bold text-destructive">É PROIBIDO realizar alterações elétricas por conta própria.</p>
                        <p>O sistema elétrico da moto é monitorado. Qualquer intervenção não autorizada (cortar fios, instalar alarmes, LEDs) pode causar o bloqueio imediato do veículo.</p>
                         <p><AlertTriangle className="inline h-4 w-4 mr-1 text-destructive/80"/> Se a moto bloquear por intervenção elétrica, será cobrada taxa de desbloqueio e visita técnica.</p>
                        <div>
                          <p className="font-bold text-secondary">A Solução Gratuita:</p>
                          <p>Quer instalar um carregador, suporte ou baú? Nós fazemos para você! A mão de obra é <span className="font-bold">100% gratuita</span>. Basta agendar um horário com o suporte e trazer a peça.</p>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                    <AccordionTrigger className="font-headline text-lg"><FileText className="mr-2 text-secondary"/>Análise e Aprovação</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground space-y-4 pl-8">
                        <p>A análise é realizada apenas com a intenção real de locação, quando você já tem os documentos e o valor inicial em mãos.</p>
                        <p>O único impeditivo para aprovação são problemas judiciais em aberto (consulta via JusBrasil).</p>
                        <p className="flex items-start gap-2"><AlertTriangle className="inline h-5 w-5 mr-1 text-destructive/80 mt-1 flex-shrink-0"/> <span className="font-semibold">Importante:</span> Após a aprovação, você tem 24h para seguir com o contrato. Caso contrário, seu cadastro pode ser bloqueado temporariamente.</p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-7">
                    <AccordionTrigger className="font-headline text-lg"><FileText className="mr-2 text-secondary"/>Comprovante de Residência</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground space-y-4 pl-8">
                        <p>Precisa estar no seu nome. Aceitamos contas de água, luz, internet, celular, fatura de cartão ou correspondências do Detran/banco.</p>
                        <p><span className="font-bold text-foreground">Casado(a):</span> Se estiver no nome do cônjuge, apresente a certidão de casamento ou união estável.</p>
                        <p><span className="font-bold text-foreground">Casa Alugada:</span> Apresente o contrato de locação registrado em cartório ou homologado via GOV.BR.</p>
                        <p><span className="font-bold text-foreground">Mora com os pais?</span> Consulte-nos sobre as condições específicas.</p>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </Section>
        
        <Section title="Dica de Pilotagem LocaGOra">
            <Card className="bg-primary/5 border-primary/20 max-w-4xl mx-auto">
                <CardHeader className="flex-row items-center gap-4">
                    <Gauge className="w-10 h-10 text-secondary"/>
                    <div>
                        <CardTitle className="font-headline text-primary">Calibragem Correta (PSI)</CardTitle>
                        <CardDescription>Mantenha os pneus na pressão ideal para sua segurança e performance.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
                    <div>
                        <p className="font-bold text-lg mb-2">Pilotando Sozinho</p>
                        <p><span className="font-semibold text-muted-foreground">Pneu Frontal:</span> 28 PSI</p>
                        <p><span className="font-semibold text-muted-foreground">Pneu Traseiro:</span> 32/34 PSI</p>
                    </div>
                    <div>
                        <p className="font-bold text-lg mb-2">Pilotando com Garupa</p>
                        <p><span className="font-semibold text-muted-foreground">Pneu Frontal:</span> 30/32 PSI</p>
                        <p><span className="font-semibold text-muted-foreground">Pneu Traseiro:</span> 38/40 PSI</p>
                    </div>
                </CardContent>
            </Card>
        </Section>

         <section className="text-center mt-24">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground mb-4">Pronto para Começar?</h2>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                Navegue pelos nossos modelos ou venha nos visitar para um café.
            </p>
             <div className="mt-8 flex justify-center gap-4">
                <Button asChild>
                    <Link href="/#models">Ver Modelos</Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href="/about">Nossa História</Link>
                </Button>
             </div>
        </section>

      </main>
    </div>
  );
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="mb-24">
        <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground mb-12 text-center">
            {title}
        </h2>
        {children}
    </section>
);


const InfoCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
    <Card className="text-center p-8 h-full shadow-lg hover:shadow-2xl transition-shadow duration-300 border-t-4 border-secondary">
        <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary text-secondary-foreground">
            <Icon className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold font-headline text-primary mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
    </Card>
);

const Feature = ({ title }: { title: string }) => (
    <div className="flex items-center gap-3 bg-muted/50 p-4 rounded-lg">
        <CheckCircle className="h-5 w-5 text-secondary" />
        <span className="font-semibold text-foreground">{title}</span>
    </div>
)

const RequirementCard = ({ icon: Icon, title, items, footer }: { icon: React.ElementType, title: string, items: string[], footer: string }) => (
    <Card className="flex flex-col">
        <CardHeader className="flex-row items-center gap-4">
            <Icon className="w-8 h-8 text-secondary flex-shrink-0" />
            <CardTitle className="font-headline text-primary">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
            <ul className="space-y-3">
                {items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-secondary/70 mt-0.5 flex-shrink-0"/>
                        <span className="text-muted-foreground">{item}</span>
                    </li>
                ))}
            </ul>
        </CardContent>
        <div className="p-6 pt-0 mt-auto">
             <p className="text-xs text-center text-muted-foreground/80 bg-muted/50 p-2 rounded-md">{footer}</p>
        </div>
    </Card>
)

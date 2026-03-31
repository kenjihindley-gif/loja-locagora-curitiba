'use client'

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Menu } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';
import { LocationSection } from '@/components/app/location-section';
import { cn } from '@/lib/utils';
import type { Motorcycle } from '@/lib/motorcycles';
import { useCollection } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase/provider';

const heroCarouselImages = [
    "https://i.imgur.com/hGZd9xk.png",
    "https://i.imgur.com/e8jZxow.png",
    "https://i.imgur.com/BrEFwuy.png",
    "https://i.imgur.com/siXoIW0.png",
    "https://i.imgur.com/pzLtOou.png",
    "https://i.imgur.com/e1L7gry.png",
    "https://i.imgur.com/q1zSDUc.png",
    "https://i.imgur.com/1kx2J1e.png",
    "https://i.imgur.com/aWmGljV.png",
    "https://i.imgur.com/dqlkRpL.png",
    "https://i.imgur.com/1mOtgaU.png"
];

const MarqueeSection = () => {
  const items = [
    { type: 'image', src: 'https://i.imgur.com/mESsDfK.png' },
    { type: 'text', content: 'A LOCADORA Nº1 DO BRASIL' },
    { type: 'image', src: 'https://i.imgur.com/kUGtZgk.png' },
    { type: 'image', src: 'https://i.imgur.com/PvINiq3.png' },
    { type: 'image', src: 'https://i.imgur.com/ZglL69U.png' },
    { type: 'image', src: 'https://i.imgur.com/OXjUlXl.png' },
    { type: 'text', content: 'LOCADORA Nº1 DE' },
    { type: 'image', src: 'https://i.imgur.com/HJ0q9Ji.png' },
    { type: 'text', content: 'TUDO EM ATÉ 10X SEM JUROS NO CARTAO' },
  ];

  const content = (
    <div className="flex items-center gap-8 shrink-0 px-4">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item.type === 'image' ? (
            <Image src={item.src!} alt="Marquee logo" width={80} height={24} className="object-contain h-6 w-auto" />
          ) : (
            <span className="font-headline font-bold text-sm whitespace-nowrap text-primary">{item.content}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="w-full bg-[#E5E5E5] py-2 overflow-hidden flex relative border-y border-border">
      <div className="flex animate-marquee w-max">
        {content}
        {content}
        {content}
        {content}
        {content}
        {content}
        {content}
        {content}
      </div>
    </div>
  );
};

const HeroSection = () => {
    const [api, setApi] = React.useState<CarouselApi>()
    const [current, setCurrent] = React.useState(0)

    React.useEffect(() => {
        if (!api) {
            return
        }

        setCurrent(api.selectedScrollSnap())

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap())
        })
    }, [api])

    return (
        <section className="relative w-full h-[60vh] md:h-[85vh] bg-black">
            <Image
                src="https://i.imgur.com/EhTLE9h.jpeg"
                alt="Oficina de motos com luzes de neon ao fundo"
                fill
                className="object-cover object-center opacity-50"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-end p-4 pb-12 md:pb-20">
                <Carousel
                    setApi={setApi}
                    opts={{ loop: true }}
                    className="w-full max-w-xs sm:max-w-sm md:max-w-xl lg:max-w-2xl xl:max-w-4xl"
                    plugins={[
                        Autoplay({
                            delay: 3000,
                            stopOnInteraction: false,
                            stopOnMouseEnter: true,
                            playDirection: 'backward',
                        }),
                    ]}
                >
                    <CarouselContent>
                        {heroCarouselImages.map((src, index) => (
                            <CarouselItem key={index}>
                                <div className="flex items-center justify-center">
                                    <Image
                                        src={src}
                                        alt={`Slide de moto ${index + 1}`}
                                        width={1000}
                                        height={600}
                                        className="object-contain max-h-[45vh] md:max-h-[60vh] pointer-events-none drop-shadow-2xl"
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden md:inline-flex left-[-50px]" />
                    <CarouselNext className="hidden md:inline-flex right-[-50px]" />
                </Carousel>
                <div className="flex gap-2.5 mt-8">
                    {heroCarouselImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => api?.scrollTo(index)}
                            className={cn(
                                'h-2 rounded-full transition-all duration-300',
                                current === index ? 'w-6 bg-secondary' : 'w-2 bg-white/50 hover:bg-white'
                            )}
                            aria-label={`Ir para o slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}


export default function Home() {
  const [filter, setFilter] = useState('Todos');
  const [scrolled, setScrolled] = useState(false);

  const firestore = useFirestore();
  const motorcyclesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'motorcycles'), orderBy('name'));
  }, [firestore]);

  const { data: availableModels, isLoading } = useCollection<Motorcycle>(motorcyclesQuery);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const filteredModels = React.useMemo(() => {
    if (!availableModels) return [];
    if (filter === 'Todos') {
      return availableModels;
    }
    if (filter === '0 KM') {
      return availableModels.filter(model => model.category === '0 KM');
    }
    if (filter === 'Seminova') {
      return availableModels.filter(model => model.category === 'Seminova');
    }
    return availableModels;
  }, [availableModels, filter]);


  const ModelCardSkeleton = () => (
    <div className="rounded-2xl overflow-hidden shadow-sm border-none bg-card/50">
      <CardContent className="p-0">
        <Skeleton className="aspect-[4/3] w-full" />
        <div className="p-6 space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="pt-2">
            <Skeleton className="h-12 w-full rounded-full" />
          </div>
        </div>
      </CardContent>
    </div>
  );

  const ModelCard = ({ model }: { model: Motorcycle }) => {
    const imageUrl = model.imageUrls?.[model.mainImageIndex];
    
    return (
      <Card className={cn(
          "rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 group border-none bg-card/50",
           model.isPromotion && "ring-2 ring-destructive shadow-destructive/20 relative"
      )}>
        <CardContent className="p-0">
          <Link href={`/details?id=${model.id}`} className="block relative aspect-[4/3] bg-muted overflow-hidden">
            {imageUrl ? <Image
              src={imageUrl}
              alt={model.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={model.imageHint}
            /> : <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">Sem Imagem</div>}
            
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              <Badge 
                variant={model.category === 'Seminova' ? 'outline' : 'default'}
                className={cn(
                  "font-body font-bold text-[10px] uppercase tracking-widest shadow-md",
                  model.category === 'Seminova' ? "bg-background/70 backdrop-blur-sm" : ""
                )}
              >
                {model.category}
              </Badge>
            </div>
            
            {model.isPromotion && (
               <div className="absolute top-3.5 -right-10 w-40 h-8 bg-destructive text-destructive-foreground flex items-center justify-center transform rotate-45 z-20 shadow-lg overflow-hidden">
                 <span className="text-xs font-bold uppercase tracking-wider">Promoção</span>
               </div>
            )}
          </Link>
          <div className="p-6">
            <div className="flex justify-between items-start mb-1">
                <h4 className="font-headline text-xl font-bold text-foreground">{model.name}</h4>
                {model.colors && model.colors.length > 0 && (
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">Cores disponíveis</span>
                        <div className="flex gap-1">
                            {model.colors.map((color, index) => (
                                <div 
                                    key={index} 
                                    className="w-4 h-4 rounded-full border border-border shadow-sm"
                                    style={{ backgroundColor: color.hex }}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="font-body text-muted-foreground text-sm mb-4" style={{minHeight: '40px'}}>
                <div>
                    {model.priceFidelidade && (
                        <p>Fid: <span className="text-secondary font-bold">R$ {model.priceFidelidade}</span>/sem</p>
                    )}
                    {model.priceAnual && (
                        <p>Anual: <span className="font-bold text-foreground">R$ {model.priceAnual}</span>/sem</p>
                    )}
                </div>
            </div>
            <Button asChild className="w-full h-12 rounded-full font-headline font-bold text-base flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-secondary/20" size="lg" variant="secondary">
              <Link href={`/details?id=${model.id}`}>
                Ver Detalhes <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
       <header className={cn(
        "md:hidden flex justify-between items-center px-6 h-16 fixed top-0 w-full z-40 transition-colors duration-300",
        scrolled ? "bg-black/80 backdrop-blur-lg" : "bg-black"
      )}>
        <Button variant="ghost" size="icon" className="hover:bg-white/10 active:scale-95 text-white">
          <Menu />
        </Button>
        <Link href="/">
            <Image src="https://i.imgur.com/X4STrg9.png" alt="Logo" width={100} height={30} />
        </Link>
        <div className="w-10"></div>
      </header>

      <main className="pb-24">
        <HeroSection />
        <MarqueeSection />

        <section className="px-6 py-6 md:hidden">
          <div className="grid grid-cols-3 gap-2 p-1 bg-muted rounded-full">
              <Button size="sm" variant={filter === 'Todos' ? 'secondary' : 'ghost'} onClick={() => setFilter('Todos')} className="rounded-full">Todos</Button>
              <Button size="sm" variant={filter === '0 KM' ? 'secondary' : 'ghost'} onClick={() => setFilter('0 KM')} className="rounded-full">Zero km</Button>
              <Button size="sm" variant={filter === 'Seminova' ? 'secondary' : 'ghost'} onClick={() => setFilter('Seminova')} className="rounded-full">Seminova</Button>
          </div>
        </section>

        <section id="models" className="px-6 flex flex-col gap-10 md:max-w-7xl md:mx-auto py-16">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <h3 className="font-headline text-xl md:text-3xl font-bold tracking-tight text-foreground">Modelos Disponíveis</h3>
            <div className="hidden md:flex gap-2 p-1 bg-muted rounded-full">
                <Button size="sm" variant={filter === 'Todos' ? 'secondary' : 'ghost'} onClick={() => setFilter('Todos')} className="rounded-full px-6">Todos</Button>
                <Button size="sm" variant={filter === '0 KM' ? 'secondary' : 'ghost'} onClick={() => setFilter('0 KM')} className="rounded-full px-6">Zero km</Button>
                <Button size="sm" variant={filter === 'Seminova' ? 'secondary' : 'ghost'} onClick={() => setFilter('Seminova')} className="rounded-full px-6">Seminova</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoading ? (
              <>
                <ModelCardSkeleton />
                <ModelCardSkeleton />
                <ModelCardSkeleton />
              </>
            ) : (
              filteredModels.map(model => <ModelCard key={model.id} model={model} />)
            )}
          </div>
        </section>
        <LocationSection />
      </main>
    </div>
  );
}

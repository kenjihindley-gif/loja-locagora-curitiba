'use client'

import React, { useState, useEffect, Suspense } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Share2, Cog, MessageCircle, GitCompareArrows, CalendarDays, ArrowLeft, ChevronLeft, ChevronRight, X } from "lucide-react";
import { BackButton } from "@/components/client/navigation";
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { Motorcycle, ColorOption } from '@/lib/motorcycles';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "motion/react";
import { useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase/provider';

function MotorcycleDetailsContent() {
  const searchParams = useSearchParams();
  const motorcycleId = searchParams.get('id');

  const firestore = useFirestore();
  const motorcycleRef = useMemoFirebase(() => {
    if (!firestore || !motorcycleId) return null;
    return doc(firestore, 'motorcycles', motorcycleId);
  }, [firestore, motorcycleId]);
  
  const { data: motorcycle, isLoading } = useDoc<Motorcycle>(motorcycleRef);

  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryMainIndex, setGalleryMainIndex] = useState(0);

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [reservationStep, setReservationStep] = useState<1 | 2>(1);
  const [resColor, setResColor] = useState<string>('');
  const [resPlan, setResPlan] = useState<string>('');
  const [sellerCode, setSellerCode] = useState<string>('');
  const [countdown, setCountdown] = useState(10);
  const [savedSellerCode, setSavedSellerCode] = useState<string | null>(null);

  useEffect(() => {
    const code = localStorage.getItem('sellerCode');
    if (code) {
      setSavedSellerCode(code);
    }
  }, []);

  const handleOpenReservation = () => {
    if (!motorcycle) return;
    
    let defaultColor = '';
    if (motorcycle.hasMultipleColors && motorcycle.colors && motorcycle.colors.length > 0) {
        defaultColor = motorcycle.colors[0].name;
    } else {
        defaultColor = 'Padrão';
    }
    
    let defaultPlan = '';
    if (motorcycle.priceFidelidade && !motorcycle.priceAnual) {
        defaultPlan = 'Fidelidade';
    } else if (!motorcycle.priceFidelidade && motorcycle.priceAnual) {
        defaultPlan = 'Anual';
    } else if (motorcycle.priceFidelidade && motorcycle.priceAnual) {
        defaultPlan = 'Fidelidade';
    }

    setResColor(defaultColor);
    setResPlan(defaultPlan);
    
    const needsSelection = (motorcycle.hasMultipleColors && motorcycle.colors && motorcycle.colors.length > 1) || 
                           (motorcycle.priceFidelidade && motorcycle.priceAnual);

    if (needsSelection) {
        setReservationStep(1);
    } else {
        setReservationStep(2);
    }
    
    setIsReservationOpen(true);
    setCountdown(10);
    setSellerCode(savedSellerCode || '');
  };

  const handleNextStep = () => {
    if (reservationStep === 1) {
        setReservationStep(2);
    }
  };

  const getSellerInfo = (code: string) => {
    if (code === "12-11") return { phone: "5541991999738", name: "Jean", hasCode: true };
    if (code === "12-06") return { phone: "554192844818", name: "Emilio", hasCode: true };
    if (code === "17-12") return { phone: "5541984244714", name: "Japa", hasCode: true };
    if (code === "06-01") return { phone: "5541984887611", name: "Camille", hasCode: true };
    return { phone: "5541984655167", name: "Monica", hasCode: false };
  };

  const generateWhatsAppLink = () => {
    if (!motorcycle) return '#';
    
    const seller = getSellerInfo(sellerCode);
    const motoInfo = `${motorcycle.name} (${motorcycle.category}, Cor: ${resColor}, Plano: ${resPlan})`;
    
    let message = "";
    if (seller.hasCode) {
        message = `Ola ${seller.name}, vi a ${motoInfo}, e gostaria de prosseguir com a locação.`;
    } else {
        message = `Ola ${seller.name}, vi a ${motoInfo}, e gostaria de prosseguir com a locação, mas nao fui atendido por nenhum atendente.`;
    }

    return `https://wa.me/${seller.phone}?text=${encodeURIComponent(message)}`;
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isReservationOpen && reservationStep === 2) {
      if (countdown > 0) {
        timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      } else {
        window.location.href = generateWhatsAppLink();
        setIsReservationOpen(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isReservationOpen, reservationStep, countdown]);

  // Effect to initialize and update gallery based on motorcycle data and selected color
  useEffect(() => {
    if (!motorcycle) return;

    // If multiple colors are available and one is selected
    if (motorcycle.hasMultipleColors && motorcycle.colors && selectedColor) {
        const colorOption = motorcycle.colors.find(c => c.name === selectedColor.name);
        if (colorOption) {
            setGalleryImages(colorOption.imageUrls);
            setGalleryMainIndex(colorOption.mainImageIndex);
            setActiveImage(colorOption.imageUrls[colorOption.mainImageIndex] || colorOption.imageUrls[0] || null);
        }
    } 
    // Fallback to main images
    else {
        setGalleryImages(motorcycle.imageUrls || []);
        setGalleryMainIndex(motorcycle.mainImageIndex);
        setActiveImage(motorcycle.imageUrls?.[motorcycle.mainImageIndex] || motorcycle.imageUrls?.[0] || null);
    }
  }, [motorcycle, selectedColor]);

  // Effect to set the initial color when motorcycle data loads
  useEffect(() => {
      if (motorcycle && motorcycle.hasMultipleColors && motorcycle.colors && motorcycle.colors.length > 0) {
          setSelectedColor(motorcycle.colors[0]);
      } else {
          setSelectedColor(null);
      }
  }, [motorcycle]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
      }
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, galleryImages.length]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };


  if (isLoading) {
    return <DetailsSkeleton />;
  }

  if (!motorcycle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-2xl font-bold mb-4">Motocicleta não encontrada</h1>
        <p className="text-muted-foreground mb-8">O modelo que você está procurando não existe ou foi removido.</p>
        <Button asChild>
          <Link href="/"><ArrowLeft className="mr-2 h-4 w-4"/>Voltar para a Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="pb-32 md:pb-0 pt-16 md:pt-10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="hidden md:block mb-6">
            <Button variant="ghost" asChild>
              <Link href="/"><ArrowLeft className="mr-2 h-4 w-4"/> Voltar para a Home</Link>
            </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-12 lg:gap-16">
          
          {/* Left Column: Gallery */}
          <section className="flex flex-col gap-4">
              <div 
                className="relative flex-grow rounded-xl overflow-hidden bg-muted group aspect-[4/3] md:aspect-auto cursor-pointer"
                onClick={() => {
                    const index = galleryImages.findIndex(img => img === activeImage);
                    openLightbox(index >= 0 ? index : 0);
                }}
              >
                  {activeImage ? <Image
                      src={activeImage}
                      alt={motorcycle.name}
                      fill
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  /> : <div className="w-full h-full flex items-center justify-center text-muted-foreground">Sem imagem</div>}
              </div>
              {galleryImages && galleryImages.length > 1 && (
                 <div className="grid grid-cols-4 gap-4 h-24 md:h-32">
                    {galleryImages.map((imgUrl, i) => (
                        <div 
                          key={i} 
                          className={cn(
                            'w-full h-full rounded-lg overflow-hidden transition-opacity cursor-pointer relative bg-muted', 
                            imgUrl === activeImage ? 'ring-2 ring-secondary' : 'opacity-60 hover:opacity-100'
                          )}
                          onClick={() => setActiveImage(imgUrl)}
                        >
                            <Image 
                                src={imgUrl} 
                                alt={`${motorcycle.name} - imagem ${i + 1}`}
                                fill
                                className="w-full h-full object-cover" 
                            />
                        </div>
                    ))}
                </div>
              )}
          </section>

          {/* Right Column: Details & CTA */}
          <aside className="mt-8 md:mt-0 px-4 md:px-0 flex flex-col gap-6">
            <section>
              <div className="flex flex-col gap-1">
                  <span className="font-body text-xs uppercase tracking-widest text-muted-foreground font-semibold">{motorcycle.category} • {motorcycle.specs.year}</span>
                  <h1 className="font-headline text-4xl lg:text-5xl font-extrabold text-primary tracking-tighter">{motorcycle.name}</h1>
                  
                  <div className="mt-2">
                    <p className="font-headline text-3xl text-secondary font-light">
                        <span className="font-extrabold">R$ {motorcycle.priceFidelidade}</span>
                        <span className="text-lg">/semana</span>
                    </p>
                    <p className="text-sm font-semibold text-secondary -mt-1">no Plano Fidelidade</p>
                    
                    {motorcycle.priceAnual && (
                        <p className="font-headline text-base text-muted-foreground mt-3">
                           ou <span className="font-bold text-foreground">R$ {motorcycle.priceAnual}/semana</span> no Plano Anual
                        </p>
                    )}
                  </div>
              </div>
            </section>
            
            {motorcycle.hasMultipleColors && motorcycle.colors && motorcycle.colors.length > 0 && (
                <section>
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Cores disponíveis</Label>
                    <div className="flex gap-2 mt-2">
                        {motorcycle.colors.map((color) => (
                            <button
                                key={color.name}
                                onClick={() => setSelectedColor(color)}
                                className={cn(
                                    "w-8 h-8 rounded-full border-2 transition",
                                    selectedColor?.name === color.name ? 'border-secondary scale-110' : 'border-transparent'
                                )}
                                title={color.name}
                            >
                                <div style={{ backgroundColor: color.hex }} className="w-full h-full rounded-full border border-black/10" />
                            </button>
                        ))}
                    </div>
                </section>
            )}

            {motorcycle.description && (
                <p className="text-muted-foreground">{motorcycle.description}</p>
            )}

            <section className="bg-primary/5 p-6 rounded-xl text-foreground flex flex-col gap-4">
              <h3 className="font-headline font-bold text-sm uppercase tracking-wider text-primary">Ficha Técnica</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
                  <div className="flex items-center gap-3">
                      <Cog className="text-secondary h-6 w-6" strokeWidth={2} />
                      <div>
                          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Motor</p>
                          <p className="font-headline text-base font-bold">{motorcycle.specs.motor}</p>
                      </div>
                  </div>
                   <div className="flex items-center gap-3">
                      <GitCompareArrows className="text-secondary h-6 w-6" strokeWidth={2} />
                      <div>
                          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Transmissão</p>
                          <p className="font-headline text-base font-bold">{motorcycle.specs.transmission}</p>
                      </div>
                  </div>
                   <div className="flex items-center gap-3">
                      <CalendarDays className="text-secondary h-6 w-6" strokeWidth={2} />
                      <div>
                          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Ano</p>
                          <p className="font-headline text-base font-bold">{motorcycle.specs.year}</p>
                      </div>
                  </div>
              </div>
              <Link href="/how-it-works#manutencao" className="mt-4 flex items-center justify-between p-3 bg-primary/10 hover:bg-primary/20 transition-colors rounded-lg group">
                <div className="flex items-center gap-2">
                  <Cog className="w-5 h-5 text-primary group-hover:rotate-90 transition-transform duration-300" />
                  <span className="font-semibold text-primary text-sm">Cobrimos Todas Revisões Preventivas</span>
                </div>
                <ChevronRight className="w-4 h-4 text-primary opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Link>
            </section>

            <div className="flex flex-col gap-3 mt-auto">
                  <Button onClick={handleOpenReservation} size="lg" variant="secondary" className="w-full font-headline text-lg font-bold py-5 rounded-full shadow-lg shadow-secondary/30 flex items-center justify-center gap-3 active:scale-95 transition-transform h-16">
                      <MessageCircle /> Reservar Pelo WhatsApp
                  </Button>
                  <div className="flex justify-end">
                      <Button variant="outline" size="icon"><Share2 /></Button>
                  </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Lightbox */}
      {isLightboxOpen && galleryImages.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-50 p-2 bg-black/50 rounded-full"
            aria-label="Fechar"
          >
            <X className="w-8 h-8" />
          </button>
          
          {galleryImages.length > 1 && (
            <button 
              onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-50 p-2 bg-black/50 rounded-full"
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          <div 
            className="relative w-full h-full max-w-7xl max-h-screen p-4 md:p-12 flex items-center justify-center cursor-pointer"
            onClick={() => setIsLightboxOpen(false)}
          >
            <div className="relative w-full h-full" onClick={(e) => e.stopPropagation()}>
                <Image
                  src={galleryImages[lightboxIndex]}
                  alt={`${motorcycle.name} - imagem ampliada ${lightboxIndex + 1}`}
                  fill
                  className="object-contain"
                  priority
                />
            </div>
          </div>

          {galleryImages.length > 1 && (
            <button 
              onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-50 p-2 bg-black/50 rounded-full"
              aria-label="Próxima imagem"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}
          
          {galleryImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full text-sm">
                  {lightboxIndex + 1} / {galleryImages.length}
              </div>
          )}
        </div>
      )}

      {/* Mobile CTA */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-background/80 backdrop-blur-lg px-6 py-6 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-2xl border-t">
        <Button onClick={handleOpenReservation} size="lg" variant="secondary" className="w-full font-headline text-lg font-bold py-5 rounded-full shadow-lg shadow-secondary/30 flex items-center justify-center gap-3 active:scale-95 transition-transform h-16">
          <MessageCircle /> Reservar pelo WhatsApp
        </Button>
      </div>

      <Dialog open={isReservationOpen && reservationStep === 1} onOpenChange={setIsReservationOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reservar {motorcycle.name}</DialogTitle>
            <DialogDescription>
              Escolha a cor e o plano desejado.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {motorcycle.hasMultipleColors && motorcycle.colors && motorcycle.colors.length > 1 && (
              <div className="space-y-3">
                <Label className="text-base font-semibold">Cor</Label>
                <RadioGroup value={resColor} onValueChange={setResColor} className="flex flex-col gap-2">
                  {motorcycle.colors.map((c) => (
                    <div key={c.name} className="flex items-center space-x-2">
                      <RadioGroupItem value={c.name} id={`color-${c.name}`} />
                      <Label htmlFor={`color-${c.name}`}>{c.name}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}
            
            {motorcycle.priceFidelidade && motorcycle.priceAnual && (
              <div className="space-y-3">
                <Label className="text-base font-semibold">Plano</Label>
                <RadioGroup value={resPlan} onValueChange={setResPlan} className="flex flex-col gap-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Fidelidade" id="plan-fidelidade" />
                    <Label htmlFor="plan-fidelidade">Fidelidade (28 Meses)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Anual" id="plan-anual" />
                    <Label htmlFor="plan-anual">Anual (12 Meses)</Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button onClick={handleNextStep} className="w-full sm:w-auto">Continuar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AnimatePresence>
        {isReservationOpen && reservationStep === 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-6"
          >
            <div className="max-w-md w-full space-y-10 text-center">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto"
              >
                <MessageCircle className="w-12 h-12 text-primary" />
              </motion.div>
              
              <div className="space-y-3">
                <motion.h2 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-headline font-bold tracking-tight"
                >
                  Preparando sua reserva
                </motion.h2>
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-muted-foreground"
                >
                  Estamos te redirecionando para o WhatsApp do nosso especialista.
                </motion.p>
              </div>

              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-muted/50 p-6 rounded-2xl border border-border/50 shadow-sm flex items-center gap-6"
              >
                <div className="w-20 h-20 relative rounded-xl overflow-hidden bg-white shadow-sm shrink-0">
                  <Image src={motorcycle.imageUrls?.[motorcycle.mainImageIndex || 0] || ''} alt={motorcycle.name} fill className="object-contain p-2" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="font-bold text-lg truncate">{motorcycle.name}</p>
                  <div className="flex flex-col gap-1 mt-1">
                    {resColor && <span className="text-sm text-muted-foreground truncate">Cor: <span className="font-medium text-foreground">{resColor}</span></span>}
                    {resPlan && <span className="text-sm text-muted-foreground truncate">Plano: <span className="font-medium text-foreground">{resPlan}</span></span>}
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="space-y-4"
              >
                <Progress value={(10 - countdown) * 10} className="h-2 bg-primary/20" />
                <p className="text-sm font-medium text-primary animate-pulse">
                  Redirecionando em {countdown} segundos...
                </p>
              </motion.div>

              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="space-y-6"
              >
                <p className="text-xs text-destructive font-medium max-w-xs mx-auto bg-destructive/10 p-3 rounded-lg">
                  Importante: Não apague a mensagem automática gerada no WhatsApp, ela contém os dados da sua reserva.
                </p>

                <Button 
                  size="lg" 
                  className="w-full rounded-full h-14 text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
                  onClick={() => { window.location.href = generateWhatsAppLink(); setIsReservationOpen(false); }}
                >
                  {getSellerInfo(sellerCode).hasCode 
                    ? `Ir para conversa com ${getSellerInfo(sellerCode).name} e Finalizar` 
                    : "OK, ir para o WhatsApp agora"}
                </Button>
                
                <button 
                  onClick={() => setIsReservationOpen(false)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
                >
                  Cancelar
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const DetailsSkeleton = () => (
   <div className="pb-32 md:pb-0 pt-16 md:pt-10 animate-pulse">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="hidden md:block mb-6">
                <Skeleton className="h-10 w-36" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-12 lg:gap-16">
                <section className="flex flex-col gap-4">
                    <Skeleton className="aspect-[4/3] md:h-[500px] w-full rounded-xl" />
                    <div className="grid grid-cols-4 gap-4 h-24 md:h-32">
                        <Skeleton className="w-full h-full rounded-lg" />
                        <Skeleton className="w-full h-full rounded-lg" />
                        <Skeleton className="w-full h-full rounded-lg" />
                        <Skeleton className="w-full h-full rounded-lg" />
                    </div>
                </section>
                <aside className="mt-8 md:mt-0 px-4 md:px-0 flex flex-col gap-6">
                    <section className="space-y-3">
                       <Skeleton className="h-4 w-48" />
                       <Skeleton className="h-12 w-full" />
                       <Skeleton className="h-8 w-1/2" />
                    </section>
                     <Skeleton className="h-32 w-full rounded-xl" />
                    <div className="flex flex-col gap-3 mt-auto">
                        <Skeleton className="h-16 w-full rounded-full" />
                         <div className="flex justify-end">
                           <Skeleton className="h-12 w-12 rounded-md" />
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    </div>
);

export function ClientMotorcycleDetailsPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Mobile Header */}
      <header className="md:hidden bg-primary text-primary-foreground font-headline font-bold tracking-tight fixed top-0 w-full z-40 flex justify-between items-center px-6 h-16 shadow-md">
        <div className="flex items-center gap-4">
          <BackButton className="text-white hover:bg-white/10" />
          <Link href="/">
            <Image src="https://i.imgur.com/X4STrg9.png" alt="Logo" width={100} height={30} />
          </Link>
        </div>
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 p-2 rounded-full transition-all active:scale-95 duration-150">
          <Share2 />
        </Button>
      </header>

      <Suspense fallback={<DetailsSkeleton />}>
        <MotorcycleDetailsContent />
      </Suspense>

    </div>
  );
}

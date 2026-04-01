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
import { doc, updateDoc, increment } from 'firebase/firestore';
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

  // Track view
  useEffect(() => {
    if (motorcycleId && firestore) {
      const trackView = async () => {
        try {
          const docRef = doc(firestore, 'motorcycles', motorcycleId);
          await updateDoc(docRef, {
            views: increment(1)
          });
        } catch (error) {
          console.error("Error tracking view:", error);
        }
      };
      trackView();
    }
  }, [motorcycleId, firestore]);

  const handleOpenReservation = async () => {
    if (!motorcycle) return;
    
    // Track click
    if (motorcycleId && firestore) {
      try {
        const docRef = doc(firestore, 'motorcycles', motorcycleId);
        await updateDoc(docRef, {
          clicks: increment(1)
        });
      } catch (error) {
        console.error("Error tracking click:", error);
      }
    }

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
        if (colorOption && colorOption.imageUrls && colorOption.imageUrls.length > 0) {
            setGalleryImages(colorOption.imageUrls);
            setGalleryMainIndex(colorOption.mainImageIndex || 0);
            setActiveImage(colorOption.imageUrls[colorOption.mainImageIndex || 0]);
            return;
        }
    }

    // Fallback to default images if no color selected or color has no images
    if (motorcycle.imageUrls && motorcycle.imageUrls.length > 0) {
        setGalleryImages(motorcycle.imageUrls);
        setGalleryMainIndex(motorcycle.mainImageIndex || 0);
        setActiveImage(motorcycle.imageUrls[motorcycle.mainImageIndex || 0]);
    }
  }, [motorcycle, selectedColor]);

  if (isLoading) {
    return <DetailsSkeleton />;
  }

  if (!motorcycle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-2xl font-headline font-bold">Moto não encontrada</h2>
        <Button asChild>
          <Link href="/">Voltar ao início</Link>
        </Button>
      </div>
    );
  }

  const handleColorSelect = (color: ColorOption) => {
    setSelectedColor(color);
  };

  const handleThumbnailClick = (img: string, index: number) => {
      setActiveImage(img);
  };

  const openLightbox = (index: number) => {
      setLightboxIndex(index);
      setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
      setIsLightboxOpen(false);
  };

  const nextLightboxImage = (e: React.MouseEvent) => {
      e.stopPropagation();
      setLightboxIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevLightboxImage = (e: React.MouseEvent) => {
      e.stopPropagation();
      setLightboxIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <div className="pb-32 md:pb-0 pt-16 md:pt-10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="hidden md:block mb-6">
          <BackButton />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-12 lg:gap-16">
          
          {/* Left Column: Images */}
          <section className="flex flex-col gap-4">
            <div 
                className="relative aspect-[4/3] md:h-[500px] w-full bg-muted rounded-xl overflow-hidden cursor-pointer group"
                onClick={() => openLightbox(galleryImages.indexOf(activeImage || galleryImages[0]))}
            >
              {activeImage ? (
                <Image
                  src={activeImage}
                  alt={motorcycle.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">Sem Imagem</div>
              )}
              {motorcycle.isPromotion && (
                 <div className="absolute top-4 -right-12 w-48 h-10 bg-destructive text-destructive-foreground flex items-center justify-center transform rotate-45 z-20 shadow-lg">
                   <span className="text-sm font-bold uppercase tracking-wider">Promoção</span>
                 </div>
              )}
            </div>

            {/* Thumbnails */}
            {galleryImages.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                    {galleryImages.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => handleThumbnailClick(img, index)}
                            className={cn(
                                "relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all",
                                activeImage === img ? "border-primary shadow-md" : "border-transparent hover:border-primary/50 opacity-70 hover:opacity-100"
                            )}
                        >
                            <Image src={img} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
                        </button>
                    ))}
                </div>
            )}
          </section>

          {/* Right Column: Details */}
          <aside className="mt-8 md:mt-0 px-4 md:px-0 flex flex-col gap-6">
            <section className="space-y-3">
              <div className="flex items-center gap-3">
                <span className={cn(
                  "px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full",
                  motorcycle.category === '0 KM' ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
                )}>
                  {motorcycle.category}
                </span>
                {motorcycle.isNew && (
                  <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-blue-500/10 text-blue-600">
                    Lançamento
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-headline font-bold text-foreground tracking-tight">
                {motorcycle.name}
              </h1>
              {motorcycle.description && (
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                  {motorcycle.description}
                </p>
              )}
            </section>

            {motorcycle.hasMultipleColors && motorcycle.colors && motorcycle.colors.length > 0 && (
              <section className="space-y-4 py-4 border-y border-border/50">
                <div className="flex justify-between items-center">
                    <h3 className="font-headline font-bold text-lg">Cores Disponíveis</h3>
                    <span className="text-sm text-muted-foreground">{selectedColor?.name || 'Selecione uma cor'}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {motorcycle.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => handleColorSelect(color)}
                      className={cn(
                        "w-12 h-12 rounded-full border-2 transition-all shadow-sm flex items-center justify-center",
                        selectedColor?.name === color.name 
                          ? "border-primary scale-110 ring-4 ring-primary/20" 
                          : "border-border hover:scale-105 hover:border-primary/50"
                      )}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                      aria-label={`Selecionar cor ${color.name}`}
                    >
                        {selectedColor?.name === color.name && (
                            <div className="w-2 h-2 rounded-full bg-background mix-blend-difference" />
                        )}
                    </button>
                  ))}
                </div>
              </section>
            )}

            <section className="grid grid-cols-2 gap-4 py-4">
              <div className="bg-muted/50 p-4 rounded-xl flex items-start gap-3">
                <Cog className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Motor</p>
                  <p className="font-medium text-sm">{motorcycle.specs.motor}</p>
                </div>
              </div>
              <div className="bg-muted/50 p-4 rounded-xl flex items-start gap-3">
                <GitCompareArrows className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Transmissão</p>
                  <p className="font-medium text-sm">{motorcycle.specs.transmission}</p>
                </div>
              </div>
              <div className="bg-muted/50 p-4 rounded-xl flex items-start gap-3">
                <CalendarDays className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Ano</p>
                  <p className="font-medium text-sm">{motorcycle.specs.year}</p>
                </div>
              </div>
              {motorcycle.specs.km && (
                <div className="bg-muted/50 p-4 rounded-xl flex items-start gap-3">
                  <div className="w-5 h-5 text-primary mt-0.5 font-bold text-center leading-5">KM</div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Quilometragem</p>
                    <p className="font-medium text-sm">{motorcycle.specs.km}</p>
                  </div>
                </div>
              )}
            </section>

            {motorcycle.isPromotion && motorcycle.promotionConditions && (
                <section className="bg-destructive/10 border border-destructive/20 p-4 rounded-xl">
                    <h4 className="text-destructive font-bold text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                        Condições da Promoção
                    </h4>
                    <p className="text-sm text-destructive/90">{motorcycle.promotionConditions}</p>
                </section>
            )}

            <section className="mt-auto pt-6 border-t border-border/50">
              <div className="flex flex-col gap-2 mb-6">
                {motorcycle.priceFidelidade && (
                  <div className="flex justify-between items-center p-4 rounded-xl bg-secondary/5 border border-secondary/20">
                    <span className="font-medium text-foreground">Plano Fidelidade <span className="text-xs text-muted-foreground block">28 Meses</span></span>
                    <span className="text-2xl font-bold text-secondary">R$ {motorcycle.priceFidelidade}<span className="text-sm text-muted-foreground font-normal">/sem</span></span>
                  </div>
                )}
                {motorcycle.priceAnual && (
                  <div className="flex justify-between items-center p-4 rounded-xl bg-muted/50 border border-border/50">
                    <span className="font-medium text-foreground">Plano Anual <span className="text-xs text-muted-foreground block">12 Meses</span></span>
                    <span className="text-2xl font-bold text-foreground">R$ {motorcycle.priceAnual}<span className="text-sm text-muted-foreground font-normal">/sem</span></span>
                  </div>
                )}
              </div>
            </section>
          </aside>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && galleryImages.length > 0 && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-sm"
                onClick={closeLightbox}
            >
                <button className="absolute top-6 right-6 text-white/70 hover:text-white z-50 p-2" onClick={closeLightbox}>
                    <X className="w-8 h-8" />
                </button>
                
                <div className="relative w-full max-w-5xl aspect-[4/3] md:aspect-video flex items-center justify-center p-4 md:p-12">
                    <Image 
                        src={galleryImages[lightboxIndex]} 
                        alt={`${motorcycle.name} - Imagem ${lightboxIndex + 1}`} 
                        fill 
                        className="object-contain"
                        quality={100}
                    />
                </div>

                {galleryImages.length > 1 && (
                    <>
                        <button 
                            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-4 bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-md transition-all"
                            onClick={prevLightboxImage}
                        >
                            <ChevronLeft className="w-8 h-8" />
                        </button>
                        <button 
                            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-4 bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-md transition-all"
                            onClick={nextLightboxImage}
                        >
                            <ChevronRight className="w-8 h-8" />
                        </button>
                        
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full">
                            {galleryImages.map((_, idx) => (
                                <div 
                                    key={idx} 
                                    className={cn(
                                        "w-2 h-2 rounded-full transition-all",
                                        idx === lightboxIndex ? "bg-white w-4" : "bg-white/30"
                                    )}
                                />
                            ))}
                        </div>
                    </>
                )}
            </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed Bottom Bar for Mobile */}
      <div className="md:hidden fixed bottom-0 w-full bg-background/80 backdrop-blur-xl border-t border-border p-4 z-40 pb-safe">
        <Button 
          size="lg" 
          className="w-full h-14 rounded-full font-headline font-bold text-lg shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          onClick={handleOpenReservation}
        >
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-6"
          >
            <div className="max-w-md w-full space-y-8 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.4, delay: 0.1 }}
                className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto"
              >
                <MessageCircle className="w-10 h-10 text-primary" />
              </motion.div>
              
              <div className="space-y-2">
                <motion.h2 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-headline font-bold tracking-tight"
                >
                  Preparando sua reserva
                </motion.h2>
                <motion.p 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-muted-foreground text-sm"
                >
                  Estamos te redirecionando para o WhatsApp do nosso especialista.
                </motion.p>
              </div>

              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-muted/30 p-4 rounded-xl border border-border/50 flex items-center gap-4 text-left"
              >
                <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-white shrink-0">
                  <Image src={motorcycle.imageUrls[motorcycle.mainImageIndex] || motorcycle.imageUrls[0]} alt={motorcycle.name} fill className="object-contain p-1" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-base truncate">{motorcycle.name}</p>
                  <div className="flex flex-col gap-0.5 mt-0.5">
                    {resColor && <span className="text-xs text-muted-foreground truncate">Cor: <span className="font-medium text-foreground">{resColor}</span></span>}
                    {resPlan && <span className="text-xs text-muted-foreground truncate">Plano: <span className="font-medium text-foreground">{resPlan}</span></span>}
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="space-y-3"
              >
                <Progress value={(10 - countdown) * 10} className="h-1.5 bg-primary/20" />
                <p className="text-xs font-medium text-primary animate-pulse">
                  Redirecionando em {countdown} segundos...
                </p>
              </motion.div>

              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="space-y-4 pt-4"
              >
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  Importante: Não apague a mensagem automática gerada no WhatsApp, ela contém os dados da sua reserva.
                </p>

                <Button 
                  size="lg" 
                  className="w-full rounded-lg h-12 text-sm font-semibold"
                  onClick={() => { window.location.href = generateWhatsAppLink(); setIsReservationOpen(false); }}
                >
                  {getSellerInfo(sellerCode).hasCode 
                    ? `Ir para conversa com ${getSellerInfo(sellerCode).name} e Finalizar` 
                    : "OK, ir para o WhatsApp agora"}
                </Button>
                
                <button 
                  onClick={() => setIsReservationOpen(false)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
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

export default function MotorcycleDetailsPage() {
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

const DetailsSkeleton = () => (
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

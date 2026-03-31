'use client'

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator";
import { X, Loader2, UploadCloud, Star, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { addMotorcycle, updateMotorcycle, uploadImage, type Motorcycle, type MotorcycleData, AVAILABLE_COLORS, ColorOption } from "@/lib/motorcycles";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

const MAX_IMAGES = 10;

interface ColorImageData {
    previews: string[];
    mainIndex: number;
}

// Sub-component for handling image uploads for a single color or the main gallery
const ColorImageUploader = ({
    imagePreviews,
    onImagePreviewsChange,
    mainImageIndex,
    onMainImageIndexChange
}: {
    imagePreviews: string[];
    onImagePreviewsChange: (previews: string[]) => void;
    mainImageIndex: number;
    onMainImageIndexChange: (index: number) => void;
}) => {
    const { toast } = useToast();
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFiles = (files: FileList | null) => {
        if (!files) return;

        const newFiles = Array.from(files);
        const totalImages = imagePreviews.length + newFiles.length;

        if (totalImages > MAX_IMAGES) {
            toast({
                variant: "destructive",
                title: "Limite de Imagens Excedido",
                description: `Você pode enviar no máximo ${MAX_IMAGES} imagens.`,
            });
            return;
        }

        const newImagePreviews = newFiles.map(file => URL.createObjectURL(file));
        onImagePreviewsChange([...imagePreviews, ...newImagePreviews]);
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(event.target.files);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
        handleFiles(event.dataTransfer.files);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
    };

    const openFileDialog = () => fileInputRef.current?.click();

    const removeImage = (indexToRemove: number) => {
        const newPreviews = imagePreviews.filter((_, i) => i !== indexToRemove);
        onImagePreviewsChange(newPreviews);

        if (indexToRemove === mainImageIndex) {
            onMainImageIndexChange(0);
        } else if (indexToRemove < mainImageIndex) {
            onMainImageIndexChange(mainImageIndex - 1);
        }
    };
    
    return (
        <div 
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={cn(
                "w-full p-4 transition-colors border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center",
                isDragging ? "border-primary bg-primary/10" : "border-muted-foreground/30 bg-muted/20 hover:border-primary/50 hover:bg-primary/5",
                imagePreviews.length === 0 && "aspect-video cursor-pointer",
            )}>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                onChange={handleFileSelect}
                multiple
            />
            {imagePreviews.length === 0 ? (
                <div className="flex flex-col items-center gap-2 text-muted-foreground" onClick={openFileDialog}>
                    <UploadCloud className="w-10 h-10" />
                    <p className="font-semibold">Arraste e solte ou clique para enviar</p>
                    <p className="text-xs">PNG, JPG, WEBP (até {MAX_IMAGES} imagens)</p>
                </div>
            ) : (
               <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                    {imagePreviews.map((preview, index) => (
                        <div key={preview} className="relative aspect-square group">
                            <Image
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                fill
                                className="object-cover rounded-md"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                                 <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7 rounded-full bg-white/80 hover:bg-white text-primary"
                                    onClick={(e) => { e.stopPropagation(); onMainImageIndexChange(index); }}
                                >
                                    <Star className={cn("h-4 w-4", mainImageIndex === index && "fill-current text-yellow-400 stroke-yellow-500")} />
                                </Button>
                                 <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="h-7 w-7 rounded-full"
                                    onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                             {mainImageIndex === index && (
                                <div className="absolute top-1 right-1">
                                    <Star className="h-5 w-5 fill-yellow-400 stroke-yellow-500" />
                                </div>
                            )}
                        </div>
                    ))}
                    {imagePreviews.length < MAX_IMAGES && (
                        <div onClick={(e) => {e.stopPropagation(); openFileDialog()}} className="flex items-center justify-center aspect-square border-2 border-dashed rounded-md text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer">
                            <UploadCloud className="w-8 h-8" />
                        </div>
                    )}
               </div>
            )}
        </div>
    );
};


export function MotorcycleForm({ initialData, onSave }: { initialData?: Motorcycle; onSave: () => void }) {
    const { toast } = useToast();
    
    // Basic Fields
    const [name, setName] = useState('');
    const [priceFidelidade, setPriceFidelidade] = useState('');
    const [priceAnual, setPriceAnual] = useState('');
    const [description, setDescription] = useState('');
    const [motor, setMotor] = useState('');
    const [transmission, setTransmission] = useState('');
    const [year, setYear] = useState('');
    const [category, setCategory] = useState<'0 KM' | 'Seminova'>('0 KM');
    const [km, setKm] = useState('');
    const [isPromotion, setIsPromotion] = useState(false);
    const [promotionConditions, setPromotionConditions] = useState('');

    // Image & Color Fields
    const [hasMultipleColors, setHasMultipleColors] = useState(false);
    // Main images (when no multiple colors)
    const [mainImagePreviews, setMainImagePreviews] = useState<string[]>([]);
    const [mainImageIndex, setMainImageIndex] = useState(0);
    // Color-specific images
    const [colorData, setColorData] = useState<Record<string, ColorImageData>>({});
    
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setPriceFidelidade(initialData.priceFidelidade || '');
            setPriceAnual(initialData.priceAnual || '');
            setDescription(initialData.description || '');
            setMotor(initialData.specs.motor);
            setTransmission(initialData.specs.transmission);
            setYear(initialData.specs.year);
            setCategory(initialData.category);
            setKm(initialData.km || '');
            setIsPromotion(initialData.isPromotion);
            setPromotionConditions(initialData.promotionConditions || '');

            setHasMultipleColors(initialData.hasMultipleColors || false);
            setMainImagePreviews(initialData.imageUrls || []);
            setMainImageIndex(initialData.mainImageIndex || 0);

            if (initialData.hasMultipleColors && initialData.colors) {
                const initialColorData = initialData.colors.reduce((acc, colorOpt) => {
                    acc[colorOpt.name] = {
                        previews: colorOpt.imageUrls,
                        mainIndex: colorOpt.mainImageIndex
                    };
                    return acc;
                }, {} as Record<string, ColorImageData>);
                setColorData(initialColorData);
            }
        }
    }, [initialData]);

    const handleColorToggle = useCallback((color: {name: string, hex: string}) => {
        setColorData(prev => {
            const newState = {...prev};
            if (newState[color.name]) {
                delete newState[color.name];
            } else {
                newState[color.name] = { previews: [], mainIndex: 0 };
            }
            return newState;
        });
    }, []);

    const updateColorImages = (colorName: string, previews: string[]) => {
        setColorData(prev => ({
            ...prev,
            [colorName]: { ...prev[colorName], previews }
        }));
    };

    const updateColorMainIndex = (colorName: string, mainIndex: number) => {
        setColorData(prev => ({
            ...prev,
            [colorName]: { ...prev[colorName], mainIndex }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !priceFidelidade) {
            toast({
                variant: "destructive",
                title: "Erro de Validação",
                description: "Nome e Preço (Fidelidade) são obrigatórios.",
            });
            return;
        }
        setIsSubmitting(true);

        try {
             if (!hasMultipleColors && mainImagePreviews.length === 0) {
                 toast({
                    variant: "destructive",
                    title: "Nenhuma Imagem",
                    description: "É necessário adicionar pelo menos uma imagem para a motocicleta.",
                });
                setIsSubmitting(false);
                return;
            }

            const uploadedMainImages = await Promise.all(
                mainImagePreviews.map(async (url, index) => {
                    if (url.startsWith('blob:')) {
                        return await uploadImage(url, `motorcycles/${Date.now()}_main_${index}`);
                    }
                    return url;
                })
            );

            const motorcycleData: Partial<MotorcycleData> = {
                name,
                priceFidelidade,
                priceAnual: category !== 'Seminova' ? priceAnual : undefined,
                description,
                specs: { motor, transmission, year },
                isNew: category === '0 KM',
                category,
                km: category === 'Seminova' ? km : '0',
                isPromotion,
                promotionConditions: isPromotion ? promotionConditions : undefined,
                imageHint: 'custom motorcycle',
                hasMultipleColors,
                imageUrls: hasMultipleColors ? [] : uploadedMainImages,
                mainImageIndex: hasMultipleColors ? 0 : mainImageIndex
            };

            if (hasMultipleColors) {
                const colorsWithUploadedImages = await Promise.all(
                    Object.entries(colorData).map(async ([colorName, data]) => {
                        const colorInfo = AVAILABLE_COLORS.find(c => c.name === colorName);
                        const uploadedColorImages = await Promise.all(
                            data.previews.map(async (url, index) => {
                                if (url.startsWith('blob:')) {
                                    return await uploadImage(url, `motorcycles/${Date.now()}_${colorName}_${index}`);
                                }
                                return url;
                            })
                        );
                        return {
                            name: colorName,
                            hex: colorInfo?.hex || '#000000',
                            imageUrls: uploadedColorImages,
                            mainImageIndex: data.mainIndex
                        };
                    })
                );
                motorcycleData.colors = colorsWithUploadedImages;
                
                // Use first color's main image as the motorcycle's main image
                if (motorcycleData.colors.length > 0) {
                    const firstColor = motorcycleData.colors[0];
                    motorcycleData.imageUrls = firstColor.imageUrls;
                    motorcycleData.mainImageIndex = firstColor.mainImageIndex;
                } else {
                     motorcycleData.imageUrls = [];
                     motorcycleData.mainImageIndex = 0;
                }
            }
            
            if (initialData) {
                await updateMotorcycle(initialData.id, motorcycleData);
                toast({ title: "Sucesso!", description: `"${name}" foi atualizada.` });
            } else {
                await addMotorcycle(motorcycleData as MotorcycleData);
                toast({ title: "Sucesso!", description: `A moto "${name}" foi adicionada.` });
            }
            onSave();

        } catch (error) {
            console.error("Failed to save motorcycle:", error);
            const errorMessage = error instanceof Error ? error.message : "Não foi possível salvar a moto. Tente novamente.";
            toast({
                variant: "destructive",
                title: "Uh oh! Algo deu errado.",
                description: errorMessage,
            });
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <Card>
            <CardHeader>
                <CardTitle>{initialData ? 'Editar Motocicleta' : 'Adicionar Nova Motocicleta'}</CardTitle>
                <CardDescription>
                    Preencha os detalhes abaixo para {initialData ? 'atualizar o modelo' : 'adicionar um novo modelo ao catálogo'}.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome do Modelo</Label>
                            <Input id="name" placeholder="Ex: Apex Predator 1200" value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        
                         <div className="space-y-2">
                            <Label htmlFor="description">Descrição</Label>
                            <Textarea id="description" placeholder="Breve descrição sobre a motocicleta..." value={description} onChange={e => setDescription(e.target.value)} />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <div className="space-y-2">
                                <Label htmlFor="price-fidelidade">Preço Semanal (Fidelidade)</Label>
                                <Input id="price-fidelidade" type="number" step="0.01" placeholder="Ex: 249.90" value={priceFidelidade} onChange={e => setPriceFidelidade(e.target.value)} required/>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="price-anual" className={isPromotion || category === 'Seminova' ? 'text-muted-foreground/50' : ''}>Preço Semanal (Anual)</Label>
                                <Input id="price-anual" type="number" step="0.01" placeholder="Ex: 299.90" value={priceAnual} onChange={e => setPriceAnual(e.target.value)} disabled={isPromotion || category === 'Seminova'} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="motor">Motor</Label>
                                <Input id="motor" placeholder="Ex: 1200cc" value={motor} onChange={e => setMotor(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="transmission">Transmissão</Label>
                                <Input id="transmission" placeholder="Ex: 6 Marchas" value={transmission} onChange={e => setTransmission(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="year">Ano</Label>
                                <Input id="year" type="number" placeholder="Ex: 2024" value={year} onChange={e => setYear(e.target.value)} />
                            </div>
                        </div>

                        <div className="flex items-end space-x-4">
                            <div className="space-y-2">
                                <Label>Condição</Label>
                                <RadioGroup value={category} onValueChange={(v) => setCategory(v as any)} className="flex gap-4 pt-2">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="0 KM" id="c1" />
                                        <Label htmlFor="c1">0 KM</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Seminova" id="c2" />
                                        <Label htmlFor="c2">Seminova</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            <div className="space-y-2 flex-1">
                                <Label htmlFor="km" className={category === '0 KM' ? 'text-muted-foreground/50' : ''}>Quilometragem</Label>
                                <Input id="km" type="number" placeholder="Ex: 15000" value={km} onChange={e => setKm(e.target.value)} disabled={category === '0 KM'} />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        {category === '0 KM' && (
                            <div className="flex items-center justify-between p-3 bg-card rounded-lg border">
                                <div>
                                    <Label htmlFor="has-multiple-colors" className="font-semibold">Cores Múltiplas</Label>
                                    <p className="text-sm text-muted-foreground">Ative para adicionar imagens por cor.</p>
                                </div>
                                <Switch id="has-multiple-colors" checked={hasMultipleColors} onCheckedChange={setHasMultipleColors} />
                            </div>
                        )}

                        {hasMultipleColors && category === '0 KM' ? (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label>Selecione as Cores Disponíveis</Label>
                                    <div className="grid grid-cols-6 gap-2 p-2 border rounded-lg">
                                        {AVAILABLE_COLORS.map(color => (
                                            <div key={color.name} onClick={() => handleColorToggle(color)} className="cursor-pointer flex flex-col items-center gap-1">
                                                <div style={{ backgroundColor: color.hex }} className="w-8 h-8 rounded-full border-2 flex items-center justify-center">
                                                    {colorData[color.name] && <Check className={cn("h-5 w-5", color.name === 'Branco' || color.name === 'Amarelo' || color.name === 'Bege' ? 'text-black' : 'text-white')} />}
                                                </div>
                                                <p className="text-xs text-center">{color.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {Object.keys(colorData).length > 0 && <Separator />}

                                <div className="space-y-8">
                                    {Object.entries(colorData).map(([colorName, data]) => (
                                        <div key={colorName} className="space-y-2">
                                            <Label className="text-lg font-bold flex items-center gap-2">
                                                <div style={{ backgroundColor: AVAILABLE_COLORS.find(c => c.name === colorName)?.hex }} className="w-5 h-5 rounded-full border" />
                                                Imagens para a cor: {colorName}
                                            </Label>
                                            <ColorImageUploader
                                                imagePreviews={data.previews}
                                                onImagePreviewsChange={(previews) => updateColorImages(colorName, previews)}
                                                mainImageIndex={data.mainIndex}
                                                onMainImageIndexChange={(index) => updateColorMainIndex(colorName, index)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Label>Imagens da Motocicleta (até {MAX_IMAGES})</Label>
                                <ColorImageUploader 
                                    imagePreviews={mainImagePreviews}
                                    onImagePreviewsChange={setMainImagePreviews}
                                    mainImageIndex={mainImageIndex}
                                    onMainImageIndexChange={setMainImageIndex}
                                />
                            </div>
                        )}
                        
                        <Separator className="my-4" />

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-card rounded-lg border">
                                <div>
                                    <Label htmlFor="is-promotion" className="font-semibold text-primary">Modo Promoção</Label>
                                    <p className="text-sm text-muted-foreground">Ative para criar uma oferta especial.</p>
                                </div>
                                <Switch id="is-promotion" checked={isPromotion} onCheckedChange={setIsPromotion} />
                            </div>

                            {isPromotion && (
                                <div className="space-y-4 p-4 border bg-primary/5 rounded-lg animate-in fade-in-50">
                                    <p className="text-sm text-primary font-semibold">A promoção será aplicada apenas ao <span className="font-bold">Plano Fidelidade</span>.</p>
                                    <div className="space-y-2">
                                        <Label htmlFor="promotion-conditions">Condições Especiais da Promoção</Label>
                                        <Textarea id="promotion-conditions" placeholder="Ex: Na compra deste plano, leve um capacete grátis e 10% de desconto na primeira semana!" value={promotionConditions} onChange={e => setPromotionConditions(e.target.value)} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="md:col-span-2 flex justify-end mt-4">
                        <Button size="lg" type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isSubmitting ? 'Salvando...' : (initialData ? 'Salvar Alterações' : 'Adicionar Moto')}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { deleteMotorcycle, type Motorcycle } from '@/lib/motorcycles';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from '../ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { MoreHorizontal, Trash, Pencil } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function MotorcycleManagement({ onEdit, motorcycles }: { onEdit: (moto: Motorcycle) => void; motorcycles: Motorcycle[]; }) {
    const { toast } = useToast();
    const [motoToDelete, setMotoToDelete] = useState<Motorcycle | null>(null);

    const handleDeleteConfirm = async () => {
        if (motoToDelete) {
            try {
                await deleteMotorcycle(motoToDelete.id);
                toast({
                    title: "Motocicleta Excluída",
                    description: `O modelo "${motoToDelete.name}" foi removido do catálogo.`,
                });
            } catch (error) {
                 toast({
                    variant: "destructive",
                    title: "Erro ao excluir",
                    description: `Não foi possível remover a motocicleta.`,
                });
            } finally {
                setMotoToDelete(null); 
            }
        }
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Gerenciar Motocicletas</CardTitle>
                    <CardDescription>
                        Visualize, edite ou exclua os modelos de motocicletas cadastrados no site.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {motorcycles.length === 0 ? (
                        <p className="text-muted-foreground col-span-full text-center">Nenhuma motocicleta cadastrada.</p>
                    ) : (
                       motorcycles.map(moto => {
                            const imageUrl = moto.imageUrls?.[moto.mainImageIndex];

                            return (
                                <Card key={moto.id} className="flex flex-col">
                                    <CardHeader className="p-0">
                                        <div className="relative aspect-[4/3] bg-muted overflow-hidden rounded-t-lg">
                                            {imageUrl ? (
                                                <Image
                                                    src={imageUrl}
                                                    alt={moto.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
                                                    Sem Imagem
                                                </div>
                                            )}
                                            <Badge className="absolute top-2 left-2">{moto.type}</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4 flex-grow">
                                        <h3 className="font-bold text-lg">{moto.name}</h3>
                                        <p className="text-sm text-muted-foreground">{moto.category}</p>
                                    </CardContent>
                                    <CardFooter className="p-4 pt-0 flex justify-between items-center">
                                        <div className="font-bold text-sm">
                                            {moto.type === 'Locação' ? (
                                                <div className="space-y-1 text-left">
                                                    {moto.priceFidelidade && <p className="text-xs text-muted-foreground">Fid: <span className="font-bold text-primary">R$ {moto.priceFidelidade}/sem</span></p>}
                                                    {moto.priceAnual && <p className="text-xs text-muted-foreground">Anual: <span className="font-bold text-primary">R$ {moto.priceAnual}/sem</span></p>}
                                                </div>
                                            ) : (
                                                <p className="text-primary">R$ {moto.price}</p>
                                            )}
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onClick={() => onEdit(moto)}>
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setMotoToDelete(moto)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                                     <Trash className="mr-2 h-4 w-4" />
                                                    Excluir
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </CardFooter>
                                </Card>
                            )
                        })
                    )}
                </CardContent>
            </Card>

            <AlertDialog open={!!motoToDelete} onOpenChange={(open) => !open && setMotoToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Isso excluirá permanentemente a motocicleta <span className="font-bold">{motoToDelete?.name}</span> do catálogo.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            Confirmar Exclusão
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

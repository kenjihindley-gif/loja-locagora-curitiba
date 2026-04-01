import { Metadata } from 'next';
import { ClientMotorcycleDetailsPage } from './client-page';
import { getMotorcycleById } from '@/lib/motorcycles';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ id?: string }> }): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const id = resolvedSearchParams.id;
  
  if (!id) {
    return {
      title: 'Detalhes da Motocicleta | LocaGOra',
    };
  }

  const motorcycle = await getMotorcycleById(id);

  if (!motorcycle) {
    return {
      title: 'Motocicleta não encontrada | LocaGOra',
    };
  }

  const mainImage = motorcycle.imageUrls?.[motorcycle.mainImageIndex || 0] || '';

  return {
    title: `${motorcycle.name} | LocaGOra`,
    description: motorcycle.description || `Alugue a ${motorcycle.name} na LocaGOra.`,
    openGraph: {
      title: `${motorcycle.name} | LocaGOra`,
      description: motorcycle.description || `Alugue a ${motorcycle.name} na LocaGOra.`,
      images: mainImage ? [{ url: mainImage }] : [],
    },
  };
}

export default function MotorcycleDetailsPage() {
  return <ClientMotorcycleDetailsPage />;
}

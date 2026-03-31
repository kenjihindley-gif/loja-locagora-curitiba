import Image from "next/image";

export function LocationSection() {
    return (
        <section className="hidden md:block w-full bg-background pt-16 pb-12">
            <div className="max-w-2xl mx-auto text-center px-8">
                <h3 className="text-3xl font-bold font-headline text-foreground mb-4">
                    Visite Nosso Showroom
                </h3>
                <p className="text-muted-foreground mb-8">
                    Venha tomar um café e conhecer de perto as máquinas que esperam por você.
                </p>
                <div className="rounded-2xl shadow-xl overflow-hidden border inline-block">
                    <a 
                        href="https://www.google.com/maps/search/?api=1&query=Av.+Anne+Frank+3687+-+Boqueir%C3%A3o,+Curitiba+-+PR" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block"
                    >
                        <Image src="https://i.imgur.com/CXkIul2.png" alt="Mapa da localização da LocaGOra" width={500} height={200} className="hover:opacity-90 transition-opacity"/>
                    </a>
                </div>
                <div className="mt-6">
                    <a 
                        href="https://www.google.com/maps/search/?api=1&query=Av.+Anne+Frank+3687+-+Boqueir%C3%A3o,+Curitiba+-+PR" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-primary transition-colors group"
                    >
                        <span className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">Av. Anne Frank, 3687 - Boqueirão, Curitiba - PR</span>
                    </a>
                </div>
            </div>
        </section>
    )
}

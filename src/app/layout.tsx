import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { DesktopHeader } from '@/components/app/desktop-header';
import { AppFooter } from '@/components/app/footer';
import { BottomNavBar } from '@/components/app/bottom-nav';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export const metadata: Metadata = {
  title: 'LocaGOra',
  description: 'O futuro da aquisição de motocicletas.',
  icons: {
    icon: 'https://i.imgur.com/4Q4IP6N.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="light">
      <head>
        <link rel="icon" href="https://i.imgur.com/4Q4IP6N.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-[max(884px,100dvh)] relative bg-background flex flex-col">
        <FirebaseClientProvider>
          <DesktopHeader />
          <main className='flex-grow pt-16 md:pt-20'>
            {children}
          </main>
          <AppFooter />
          <Toaster />
          <BottomNavBar />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { MotorcycleForm } from '@/components/admin/motorcycle-form';
import { MotorcycleManagement } from '@/components/admin/motorcycle-management';
import { ArrowLeft, PlusCircle, Wrench } from 'lucide-react';
import type { Motorcycle } from '@/lib/motorcycles';
import { useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase/provider';


const ADMIN_PASSWORD = '090825';
const SESSION_STORAGE_KEY = 'locagora-admin-auth';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [view, setView] = useState<'dashboard' | 'add' | 'edit' | 'manage'>('dashboard');
  const [editingMotorcycle, setEditingMotorcycle] = useState<Motorcycle | undefined>(undefined);
  
  const firestore = useFirestore();

  const motorcyclesCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'motorcycles');
  }, [firestore]);

  const { data: motorcycles = [], isLoading } = useCollection<Motorcycle>(motorcyclesCollection);

  useEffect(() => {
    const sessionAuth = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Senha incorreta. Tente novamente.');
      setPassword('');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    setIsAuthenticated(false);
    setView('dashboard');
  };

  const handleEditClick = (moto: Motorcycle) => {
    setEditingMotorcycle(moto);
    setView('edit');
  };
  
  const handleSave = () => {
    setView('dashboard');
    setEditingMotorcycle(undefined);
  }

  if (isAuthenticated) {
    return (
      <div className="container mx-auto py-10 px-4 min-h-screen">
        {view !== 'dashboard' && (
           <div className="mb-8">
             <Button variant="ghost" onClick={() => setView('dashboard')}>
               <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Painel
             </Button>
           </div>
        )}

        {view === 'dashboard' && (
           <>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold font-headline">Painel Administrativo</h1>
                <Button onClick={handleLogout} variant="outline">Sair</Button>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setView('add')}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><PlusCircle />Criar Anúncio</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>Adicione um novo modelo de motocicleta ao catálogo do site.</CardDescription>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => { setView('manage'); }}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Wrench />Gerenciar Anúncios</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>Edite ou exclua motocicletas existentes no catálogo.</CardDescription>
                    </CardContent>
                </Card>
            </div>
          </>
        )}
        
        {view === 'add' && <MotorcycleForm onSave={handleSave} />}
        {view === 'edit' && <MotorcycleForm initialData={editingMotorcycle} onSave={handleSave} />}
        {view === 'manage' && <MotorcycleManagement onEdit={handleEditClick} motorcycles={motorcycles ?? []} />}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Acesso Restrito</CardTitle>
          <CardDescription>
            Por favor, insira a senha para acessar a área administrativa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

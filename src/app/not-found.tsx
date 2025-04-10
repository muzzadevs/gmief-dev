
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center max-w-md p-6">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold mt-4 text-gray-800">Página no encontrada</h2>
        <p className="text-gray-600 mt-2">
          Lo sentimos, la página que está buscando no existe o ha sido movida.
        </p>
        <Button 
          onClick={() => router.push('/')} 
          className="mt-6 flex items-center"
        >
          <Home className="mr-2 h-4 w-4" />
          Volver al Inicio
        </Button>
      </div>
    </div>
  );
}

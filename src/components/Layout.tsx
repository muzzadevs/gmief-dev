
import React from 'react';
import { Breadcrumb } from './Breadcrumb';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  breadcrumbs?: Array<{ label: string; path: string }>;
}

const Layout: React.FC<LayoutProps> = ({ children, title, breadcrumbs = [] }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-white shadow-md">
        <div className="container mx-auto py-4 px-4 md:px-6">
          <h1 className="text-2xl font-semibold">GMIEF</h1>
          <p className="text-sm opacity-80">Gestión de Ministerios e Iglesias de España y sus Federaciones</p>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4 md:px-6">
        {breadcrumbs.length > 0 && <Breadcrumb items={breadcrumbs} />}
        
        <div className="mt-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">{title}</h2>
          {children}
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-4 mt-12">
        <div className="container mx-auto px-4 md:px-6 text-center text-sm">
          &copy; {new Date().getFullYear()} GMIEF - Todos los derechos reservados
        </div>
      </footer>
    </div>
  );
};

export default Layout;

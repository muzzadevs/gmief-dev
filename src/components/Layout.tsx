
import React from 'react';
import { Breadcrumb } from './Breadcrumb';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  breadcrumbs?: Array<{ label: string; path: string }>;
}

const Layout: React.FC<LayoutProps> = ({ children, title, breadcrumbs = [] }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <header className="bg-primary/80 backdrop-blur-lg text-white shadow-lg">
        <div className="container mx-auto py-4 px-4 md:px-6">
          <Link to="/" className="cursor-pointer">
            <h1 className="text-2xl font-semibold">GMIEF</h1>
          </Link>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4 md:px-6">
        {breadcrumbs.length > 0 && <Breadcrumb items={breadcrumbs} />}
        
        <div className="mt-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">{title}</h2>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;

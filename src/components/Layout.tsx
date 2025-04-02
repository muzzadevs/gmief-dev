
import React from 'react';
import { Link } from 'react-router-dom';
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
        <div className="container mx-auto py-4 px-4 md:px-6 flex items-center">
          <Link 
            to="/" 
            className="text-2xl font-semibold hover:cursor-pointer"
          >
            GMIEF
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
      
      {/* Footer removed as per user request */}
    </div>
  );
};

export default Layout;

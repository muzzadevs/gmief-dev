
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Breadcrumb } from './Breadcrumb';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  breadcrumbs?: Array<{ label: string; path: string }>;
}

const Layout: React.FC<LayoutProps> = ({ children, title, breadcrumbs = [] }) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Inicio', path: '/' },
    { name: 'Zonas', path: '/zonas' },
    { name: 'Subzonas', path: '/subzonas' },
    { name: 'Iglesias', path: '/iglesias' },
    { name: 'Ministerios', path: '/ministerios' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-white shadow-md">
        <div className="container mx-auto py-4 px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="hover:cursor-pointer">
              <img
                src="/logoGMIEF.png"
                alt="Logo GMIEF"
                className="h-10 w-auto"
              />
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-white/90 ${
                  isActive(item.path) ? 'text-white/100 underline underline-offset-4' : 'text-white/70'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 md:hidden">
          <div className="container mx-auto px-4 py-4 flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMenuOpen(false)}
              className="text-white"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <nav className="container mx-auto px-4 py-8 flex flex-col items-center space-y-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`text-lg font-medium transition-colors hover:text-white/90 ${
                  isActive(item.path) ? 'text-white/100 underline underline-offset-4' : 'text-white/70'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}

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

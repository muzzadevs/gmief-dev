
import React from 'react';
import Layout from '../components/Layout';
import ZoneSelector from '../components/ZoneSelector';
import { useIsMobile } from '../hooks/use-mobile';

const Index: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <Layout title="Zonas">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-gray-600 mb-8 ">
          Bienvenido al Gestor de Ministerios de la Iglesia Evangélica Filadelfia.
          Seleccione una zona y subzona para comenzar.
        </p>
        
        <div className={`${isMobile ? 'flex flex-col space-y-8' : 'grid grid-cols-2 gap-8'}`}>
          {/* Centered selector */}
          <div className={`${isMobile ? 'w-full' : 'col-span-2 mx-auto max-w-md'}`}>
            <ZoneSelector />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;

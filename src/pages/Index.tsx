
import React from 'react';
import Layout from '../components/Layout';
import SpainMap from '../components/SpainMap';
import ZoneSelector from '../components/ZoneSelector';
import { useIsMobile } from '../hooks/use-mobile';
import { AspectRatio } from '../components/ui/aspect-ratio';
import { useQuery } from '@tanstack/react-query';
import { fetchZonas } from '../lib/api';

const Index: React.FC = () => {
  const isMobile = useIsMobile();
  const { data: zones = [], isLoading } = useQuery({
    queryKey: ['zones'],
    queryFn: fetchZonas
  });
  
  return (
    <Layout title="Zonas">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-gray-600 mb-8 ">
          Bienvenido al Gestor de Ministerios de la Iglesia Evangélica Filadefia.
          Seleccione una zona en el mapa o en el menú desplegable para comenzar.
        </p>
        
        <div className={`${isMobile ? 'flex flex-col space-y-8' : 'grid grid-cols-3 gap-8'}`}>
          {/* On mobile: Selector first, then map */}
          {isMobile && (
            <div className="w-full">
              <ZoneSelector />
            </div>
          )}
          
          {/* Map with preserved aspect ratio */}
          <div className={`${isMobile ? 'w-full' : 'col-span-2'}`}>
            <div className="spain-map-container w-full">
              <AspectRatio ratio={4/3} className="bg-muted/20 rounded-md overflow-hidden">
                <SpainMap />
              </AspectRatio>
            </div>
          </div>
          
          {/* On desktop: Selector on the right */}
          {!isMobile && (
            <div className="col-span-1 flex items-center">
              <ZoneSelector />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;

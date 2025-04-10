
"use client";

import Layout from "@/components/Layout";
import SpainMap from "@/components/SpainMap";
import RegionSelector from "@/components/RegionSelector";
import { useIsMobile } from "@/hooks/use-mobile";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function HomePage() {
  const isMobile = useIsMobile();
  
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
              <RegionSelector />
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
              <RegionSelector />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

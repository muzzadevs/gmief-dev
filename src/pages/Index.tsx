
import React from 'react';
import Layout from '../components/Layout';
import SpainMap from '../components/SpainMap';
import RegionSelector from '../components/RegionSelector';

const Index: React.FC = () => {
  return (
    <Layout title="Zonas de España">
      <div className="space-y-10">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-gray-600 mb-8 glass p-4 rounded-lg">
            Bienvenido al Sistema de Gestión de Ministerios e Iglesias de España y sus Federaciones.
            Seleccione una zona en el mapa o en el menú desplegable para comenzar.
          </p>
          
          <div className="mb-10 glass p-4 rounded-xl">
            <SpainMap />
          </div>
          
          <div className="mt-10 glass p-6 rounded-xl">
            <RegionSelector />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;

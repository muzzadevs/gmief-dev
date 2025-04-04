
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout';
import ZoneSelector from '../components/ZoneSelector';
import { fetchZonas } from '../lib/api';

const ZonePage: React.FC = () => {
  const { zoneId } = useParams<{ zoneId: string }>();
  
  // Fetch zones to validate zoneId
  const { data: zones = [], isLoading } = useQuery({
    queryKey: ['zones'],
    queryFn: fetchZonas
  });
  
  // Validate zoneId
  if (!zoneId) {
    return <Navigate to="/" replace />;
  }
  
  if (isLoading) {
    return (
      <Layout title="Cargando zona...">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }
  
  // Get zone data
  const zone = zones.find(z => z.id.toString() === zoneId);
  if (!zone) {
    return <Navigate to="/" replace />;
  }
  
  // Breadcrumb items
  const breadcrumbs = [
    { label: zone.nombre, path: `/zone/${zoneId}` },
  ];

  return (
    <Layout 
      title={`Zona ${zone.nombre}`} 
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-8">
        <div className="max-w-xs mx-auto sm:max-w-md">
          <ZoneSelector selectedZoneId={zoneId} />
        </div>
        
        <div className="mt-10 text-center">
          <p className="text-gray-600">
            Por favor, seleccione una subzona para ver las iglesias disponibles.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ZonePage;

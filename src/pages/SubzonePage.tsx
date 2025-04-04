
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout';
import ZoneSelector from '../components/ZoneSelector';
import ChurchAccordion from '../components/ChurchAccordion';
import { 
  fetchZonas, 
  fetchSubzonas, 
  fetchIglesiasBySubzona
} from '../lib/api';

const SubzonePage: React.FC = () => {
  const { zoneId, subzoneId } = useParams<{ zoneId: string, subzoneId: string }>();
  
  // Validate params
  if (!zoneId || !subzoneId) {
    return <Navigate to="/" replace />;
  }
  
  // Fetch data
  const { data: zones = [], isLoading: isLoadingZones } = useQuery({
    queryKey: ['zones'],
    queryFn: fetchZonas
  });
  
  const { data: subzones = [], isLoading: isLoadingSubzones } = useQuery({
    queryKey: ['subzones'],
    queryFn: fetchSubzonas
  });
  
  const { data: churches = [], isLoading: isLoadingChurches } = useQuery({
    queryKey: ['churches', subzoneId],
    queryFn: () => fetchIglesiasBySubzona(parseInt(subzoneId))
  });
  
  // Show loading state
  if (isLoadingZones || isLoadingSubzones || isLoadingChurches) {
    return (
      <Layout title="Cargando datos...">
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
  
  // Get subzone data
  const subzone = subzones.find(sz => sz.id.toString() === subzoneId);
  if (!subzone) {
    return <Navigate to="/" replace />;
  }
  
  // Breadcrumb items
  const breadcrumbs = [
    { label: zone.nombre, path: `/zone/${zoneId}` },
    { label: subzone.nombre, path: `/zone/${zoneId}/subzone/${subzoneId}` },
  ];

  return (
    <Layout 
      title={`Iglesias en ${subzone.nombre}`} 
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-8">
        <div className="max-w-xs mx-auto sm:max-w-md">
          <ZoneSelector selectedZoneId={zoneId} selectedSubzoneId={subzoneId} />
        </div>
        
        <div className="mt-10">
          {churches.length > 0 ? (
            <ChurchAccordion churches={churches} />
          ) : (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No hay iglesias registradas en esta subzona.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SubzonePage;

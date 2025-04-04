
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ChurchAccordion from '../components/ChurchAccordion';
import RegionSelector from '../components/RegionSelector';
import { getRegionById, getChurchesByRegionId } from '../lib/mockData';

const RegionPage: React.FC = () => {
  const { regionId } = useParams<{ regionId: string }>();
  
  // Validate regionId
  if (!regionId) {
    return <Navigate to="/" replace />;
  }
  
  // Get region data
  const region = getRegionById(regionId);
  if (!region) {
    return <Navigate to="/" replace />;
  }
  
  // Get churches in this region
  const churches = getChurchesByRegionId(regionId);
  
  // Breadcrumb items
  const breadcrumbs = [
    { label: region.name, path: `/region/${regionId}` },
  ];

  return (
    <Layout 
      title={`Iglesias en la Zona ${region.name}`} 
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-8">
        <div className="max-w-xs mx-auto sm:max-w-md">
          <RegionSelector selectedRegionId={regionId} />
        </div>
        
        <div className="mt-10">
          {churches.length > 0 ? (
            <ChurchAccordion churches={churches} />
          ) : (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No hay iglesias registradas en esta zona.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default RegionPage;

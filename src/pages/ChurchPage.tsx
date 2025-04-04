
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import MinistryCard from '../components/MinistryCard';
import { getChurchById, getRegionById, getMinistriesByChurchId } from '../lib/mockData';

const ChurchPage: React.FC = () => {
  const { churchId } = useParams<{ churchId: string }>();
  
  // Validate churchId
  if (!churchId) {
    return <Navigate to="/" replace />;
  }
  
  // Get church data
  const church = getChurchById(churchId);
  if (!church) {
    return <Navigate to="/" replace />;
  }
  
  // Get region data
  const region = getRegionById(church.regionId);
  if (!region) {
    return <Navigate to="/" replace />;
  }
  
  // Get ministries in this church
  const ministries = getMinistriesByChurchId(churchId);
  
  // Breadcrumb items
  const breadcrumbs = [
    { label: region.name, path: `/region/${region.id}` },
    { label: church.name, path: `/church/${churchId}` },
  ];

  return (
    <Layout 
      title={`Ministerios de ${church.name}`} 
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-6">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <h3 className="font-medium text-lg text-gray-700">Información de la Iglesia</h3>
          <p className="text-gray-600 mt-1">{church.address}</p>
          <p className="text-gray-500 mt-1 text-sm">{church.additionalInfo}</p>
        </div>
        
        <h3 className="font-semibold text-xl mt-8 text-gray-800">Ministros y Líderes</h3>
        
        {ministries.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
            {ministries.map(ministry => (
              <MinistryCard key={ministry.id} ministry={ministry} />
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No hay ministerios registrados en esta iglesia.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ChurchPage;

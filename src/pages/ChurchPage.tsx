
import React from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout';
import MinistryCard from '../components/MinistryCard';
import { fetchIglesias, fetchMinisteriosByIglesia } from '../lib/api';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Building } from 'lucide-react';

const ChurchPage: React.FC = () => {
  const { churchId } = useParams<{ churchId: string }>();
  const navigate = useNavigate();
  
  // Validate churchId
  if (!churchId) {
    return <Navigate to="/" replace />;
  }
  
  // Fetch church data
  const { data: churches = [], isLoading: isLoadingChurch } = useQuery({
    queryKey: ['allChurches'],
    queryFn: fetchIglesias
  });
  
  // Find church by ID
  const church = churches.find(c => c.id.toString() === churchId);
  
  // Fetch ministries for this church
  const { data: ministries = [], isLoading: isLoadingMinistries } = useQuery({
    queryKey: ['ministries', churchId],
    queryFn: () => fetchMinisteriosByIglesia(parseInt(churchId)),
    enabled: !!church
  });
  
  // Show loading state
  if (isLoadingChurch || isLoadingMinistries) {
    return (
      <Layout title="Cargando datos...">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }
  
  // If church not found
  if (!church) {
    return <Navigate to="/" replace />;
  }
  
  // Back button action - we'll need to determine which subzone this church belongs to
  const handleBack = () => {
    navigate(-1);
  };
  
  // Breadcrumb items - simplified to just show the church
  const breadcrumbs = [
    { label: church.nombre, path: `/church/${churchId}` },
  ];

  return (
    <Layout 
      title={`Ministerios de ${church.nombre}`} 
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-500" 
            onClick={handleBack}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Volver
          </Button>
        </div>
      
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-start gap-3">
            <Building className="h-5 w-5 text-primary mt-1" />
            <div>
              <h3 className="font-medium text-lg text-gray-700">{church.nombre}</h3>
              <p className="text-gray-600 mt-1">
                {church.direccion !== 'NULL' ? church.direccion : 'Sin dirección'}, {' '}
                {church.municipio !== 'NULL' ? church.municipio : ''}, {' '}
                {church.provincia !== 'NULL' ? church.provincia : ''}
                {church.cp ? ` - ${church.cp}` : ''}
              </p>
            </div>
          </div>
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

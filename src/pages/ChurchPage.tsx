
import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import MinistryCard from '../components/MinistryCard';
import { getIglesiaById } from '../api/iglesiasApi';
import { getMinisteriosByIglesia } from '../api/ministeriosApi';
import { Church, Ministry } from '../types/dataTypes';
import { Loader2 } from 'lucide-react';

const ChurchPage: React.FC = () => {
  const { churchId } = useParams<{ churchId: string }>();
  const [church, setChurch] = useState<Church | null>(null);
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!churchId) return;
      
      setLoading(true);
      try {
        // Fetch church data
        const churchData = await getIglesiaById(parseInt(churchId));
        setChurch(churchData);
        
        // Fetch ministries for this church
        const ministriesData = await getMinisteriosByIglesia(parseInt(churchId));
        setMinistries(ministriesData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [churchId]);
  
  if (!churchId) {
    return <Navigate to="/" replace />;
  }
  
  if (loading) {
    return (
      <Layout title="Cargando...">
        <div className="flex flex-col items-center justify-center p-12">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <span className="mt-4 text-gray-600">Cargando información...</span>
        </div>
      </Layout>
    );
  }
  
  if (error || !church) {
    return (
      <Layout title="Error">
        <div className="p-8 text-center">
          <p className="text-red-500">{error || 'Iglesia no encontrada'}</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
          >
            Volver a Inicio
          </button>
        </div>
      </Layout>
    );
  }
  
  // Breadcrumb items
  const breadcrumbs = [
    { label: church.subzona_nombre || '', path: `/subzona/${church.subzona_id}` },
    { label: church.nombre, path: `/church/${churchId}` },
  ];

  return (
    <Layout 
      title={`Ministerios de ${church.nombre}`} 
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-6">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <h3 className="font-medium text-lg text-gray-700">Información de la Iglesia</h3>
          <p className="text-gray-600 mt-1">
            {church.direccion !== 'NULL' ? church.direccion : 'Dirección no disponible'}
          </p>
          <p className="text-gray-600 mt-1">
            {church.municipio}, {church.provincia} {church.cp ? `- ${church.cp}` : ''}
          </p>
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

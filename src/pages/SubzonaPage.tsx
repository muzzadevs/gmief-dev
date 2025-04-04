
import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getSubzonas } from '../api/zonasApi';
import { getIglesiasBySubzona } from '../api/iglesiasApi';
import { Subzone, Church } from '../types/dataTypes';
import Layout from '../components/Layout';
import ChurchAccordion from '../components/ChurchAccordion';
import ZoneSelector from '../components/ZoneSelector';
import { Loader2 } from 'lucide-react';

const SubzonaPage: React.FC = () => {
  const { subzonaId } = useParams<{ subzonaId: string }>();
  const [subzona, setSubzona] = useState<Subzone | null>(null);
  const [churches, setChurches] = useState<Church[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!subzonaId) return;
      
      setLoading(true);
      try {
        // Fetch all subzonas to find the current one
        const allSubzonas = await getSubzonas();
        const currentSubzona = allSubzonas.find((sz: Subzone) => sz.id === parseInt(subzonaId));
        
        if (currentSubzona) {
          setSubzona(currentSubzona);
          
          // Fetch churches for this subzona
          const churchesData = await getIglesiasBySubzona(parseInt(subzonaId));
          setChurches(churchesData);
        } else {
          setError('Subzona no encontrada');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [subzonaId]);

  if (!subzonaId) {
    return <Navigate to="/" replace />;
  }

  if (error) {
    return (
      <Layout title="Error">
        <div className="p-8 text-center">
          <p className="text-red-500">{error}</p>
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

  return (
    <Layout 
      title={loading ? 'Cargando...' : `Iglesias en ${subzona?.nombre}`}
      breadcrumbs={subzona ? [{ label: subzona.nombre, path: `/subzona/${subzonaId}` }] : undefined}
    >
      <div className="space-y-8">
        <div className="max-w-xs mx-auto sm:max-w-md">
          <ZoneSelector selectedSubzoneId={subzonaId} />
        </div>
        
        <div className="mt-10">
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <span className="ml-4 text-lg">Cargando iglesias...</span>
            </div>
          ) : churches.length > 0 ? (
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

export default SubzonaPage;

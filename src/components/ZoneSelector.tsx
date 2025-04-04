
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getZonas } from '../api/zonasApi';
import { Zone, Subzone } from '../types/dataTypes';
import { getSubzonas } from '../api/zonasApi';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface ZoneSelectorProps {
  selectedSubzoneId?: string;
}

const ZoneSelector: React.FC<ZoneSelectorProps> = ({ selectedSubzoneId }) => {
  const navigate = useNavigate();
  const [zonas, setZonas] = useState<Zone[]>([]);
  const [subzonas, setSubzonas] = useState<Subzone[]>([]);
  const [selectedZona, setSelectedZona] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchZonas = async () => {
      try {
        console.log('Intentando obtener zonas...');
        setLoading(true);
        const data = await getZonas();
        console.log('Zonas obtenidas:', data);
        setZonas(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching zonas:', error);
        setError('No se pudieron cargar las zonas. Verifique la conexión a la base de datos.');
        toast({
          variant: "destructive",
          title: "Error de conexión",
          description: "No se pudo conectar con la base de datos. Inténtelo de nuevo más tarde.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchZonas();
  }, []);

  useEffect(() => {
    const fetchSubzonas = async () => {
      if (selectedZona) {
        try {
          console.log(`Obteniendo subzonas para zona ID: ${selectedZona}`);
          const data = await getSubzonas(parseInt(selectedZona));
          console.log('Subzonas obtenidas:', data);
          setSubzonas(data);
          setError(null);
        } catch (error) {
          console.error('Error fetching subzonas:', error);
          setError('No se pudieron cargar las subzonas.');
          toast({
            variant: "destructive",
            title: "Error al cargar subzonas",
            description: "No se pudieron obtener las subzonas. Inténtelo de nuevo más tarde.",
          });
        }
      } else {
        setSubzonas([]);
      }
    };

    fetchSubzonas();
  }, [selectedZona]);

  const handleZonaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const zonaId = e.target.value;
    setSelectedZona(zonaId);
    setSubzonas([]);
  };

  const handleSubzonaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subzonaId = e.target.value;
    if (subzonaId) {
      navigate(`/subzona/${subzonaId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center p-4 space-y-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-gray-500">Cargando zonas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 rounded-md bg-red-50 text-center">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-primary text-white rounded-md text-sm"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div>
        <label htmlFor="zona-select" className="block text-sm font-medium text-gray-700 mb-1">
          Seleccionar Zona
        </label>
        <select
          id="zona-select"
          className="block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary/30 focus:outline-none"
          value={selectedZona}
          onChange={handleZonaChange}
        >
          <option value="" disabled>Seleccione una zona</option>
          {zonas.map(zona => (
            <option key={zona.id} value={zona.id}>
              {zona.nombre}
            </option>
          ))}
        </select>
      </div>

      {selectedZona && (
        <div>
          <label htmlFor="subzona-select" className="block text-sm font-medium text-gray-700 mb-1">
            Seleccionar Subzona
          </label>
          <select
            id="subzona-select"
            className="block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary/30 focus:outline-none"
            value={selectedSubzoneId || ''}
            onChange={handleSubzonaChange}
          >
            <option value="" disabled>Seleccione una subzona</option>
            {subzonas.map(subzona => (
              <option key={subzona.id} value={subzona.id}>
                {subzona.nombre}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default ZoneSelector;

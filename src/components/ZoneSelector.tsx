
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getZonas } from '../api/zonasApi';
import { Zone, Subzone } from '../types/dataTypes';
import { getSubzonas } from '../api/zonasApi';
import { Loader2 } from 'lucide-react';

interface ZoneSelectorProps {
  selectedSubzoneId?: string;
}

const ZoneSelector: React.FC<ZoneSelectorProps> = ({ selectedSubzoneId }) => {
  const navigate = useNavigate();
  const [zonas, setZonas] = useState<Zone[]>([]);
  const [subzonas, setSubzonas] = useState<Subzone[]>([]);
  const [selectedZona, setSelectedZona] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchZonas = async () => {
      try {
        const data = await getZonas();
        setZonas(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching zonas:', error);
        setLoading(false);
      }
    };

    fetchZonas();
  }, []);

  useEffect(() => {
    const fetchSubzonas = async () => {
      if (selectedZona) {
        try {
          const data = await getSubzonas(parseInt(selectedZona));
          setSubzonas(data);
        } catch (error) {
          console.error('Error fetching subzonas:', error);
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
      <div className="flex justify-center items-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
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

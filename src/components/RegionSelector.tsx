
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { regions } from '../lib/mockData';

interface RegionSelectorProps {
  selectedRegionId?: string;
}

const RegionSelector: React.FC<RegionSelectorProps> = ({ selectedRegionId }) => {
  const navigate = useNavigate();

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const regionId = e.target.value;
    if (regionId) {
      navigate(`/region/${regionId}`);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <label htmlFor="region-select" className="block text-lg font-leto font-medium text-gray-700 mb-3">
        Seleccionar Zona
      </label>
      <select
        id="region-select"
        className="block w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none transition-all"
        value={selectedRegionId || ''}
        onChange={handleRegionChange}
      >
        <option value="" disabled>Seleccione una zona</option>
        {regions.map(region => (
          <option key={region.id} value={region.id}>
            {region.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RegionSelector;

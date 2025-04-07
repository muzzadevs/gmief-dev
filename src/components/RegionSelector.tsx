
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { regions } from '../lib/mockData';

interface RegionSelectorProps {
  selectedRegionId?: string;
}

const RegionSelector: React.FC<RegionSelectorProps> = ({ selectedRegionId }) => {
  const router = useRouter();

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const regionId = e.target.value;
    if (regionId) {
      router.push(`/region/${regionId}`);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <label htmlFor="region-select" className="block text-sm font-medium text-gray-700 mb-1">
        Seleccionar Zona
      </label>
      <select
        id="region-select"
        className="block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary/30 focus:outline-none"
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

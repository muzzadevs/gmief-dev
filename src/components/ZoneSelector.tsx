
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  fetchZonas, 
  fetchSubzonasByZona,
  Zona,
  Subzona
} from '../lib/api';

interface ZoneSelectorProps {
  selectedZoneId?: string;
  selectedSubzoneId?: string;
}

const ZoneSelector: React.FC<ZoneSelectorProps> = ({ selectedZoneId, selectedSubzoneId }) => {
  const navigate = useNavigate();
  
  // Fetch all zones
  const { data: zones = [], isLoading: isLoadingZones } = useQuery({
    queryKey: ['zones'],
    queryFn: fetchZonas
  });

  // Fetch subzones for the selected zone
  const { data: subzones = [], isLoading: isLoadingSubzones } = useQuery({
    queryKey: ['subzones', selectedZoneId],
    queryFn: () => selectedZoneId ? fetchSubzonasByZona(parseInt(selectedZoneId)) : [],
    enabled: !!selectedZoneId
  });

  const handleZoneChange = (zoneId: string) => {
    if (zoneId) {
      navigate(`/zone/${zoneId}`);
    }
  };

  const handleSubzoneChange = (subzoneId: string) => {
    if (subzoneId && selectedZoneId) {
      navigate(`/zone/${selectedZoneId}/subzone/${subzoneId}`);
    }
  };

  if (isLoadingZones) {
    return <div className="flex justify-center p-4">Cargando zonas...</div>;
  }

  return (
    <div className="w-full space-y-4">
      <div className="w-full">
        <label htmlFor="zone-select" className="block text-sm font-medium text-gray-700 mb-1">
          Seleccionar Zona
        </label>
        <Select 
          value={selectedZoneId} 
          onValueChange={handleZoneChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccione una zona" />
          </SelectTrigger>
          <SelectContent>
            {zones.map((zone) => (
              <SelectItem key={zone.id} value={zone.id.toString()}>
                {zone.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {selectedZoneId && subzones.length > 0 && !isLoadingSubzones && (
        <div className="w-full">
          <label htmlFor="subzone-select" className="block text-sm font-medium text-gray-700 mb-1">
            Seleccionar Subzona
          </label>
          <Select 
            value={selectedSubzoneId} 
            onValueChange={handleSubzoneChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione una subzona" />
            </SelectTrigger>
            <SelectContent>
              {subzones.map((subzone) => (
                <SelectItem key={subzone.id} value={subzone.id.toString()}>
                  {subzone.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default ZoneSelector;

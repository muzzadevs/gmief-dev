
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User, Calendar, BookOpen, Phone, Mail } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Ministerio, fetchObservacionesByMinisterio, fetchCargosByMinisterio } from '../lib/api';

interface MinistryDetailsModalProps {
  ministry: Ministerio;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MinistryDetailsModal: React.FC<MinistryDetailsModalProps> = ({ ministry, open, onOpenChange }) => {
  // Fetch observations for this minister
  const { data: observations = [] } = useQuery({
    queryKey: ['observations', ministry.id],
    queryFn: () => fetchObservacionesByMinisterio(ministry.id),
    enabled: open,
  });
  
  // Fetch cargos for this minister
  const { data: cargos = [] } = useQuery({
    queryKey: ['cargos', ministry.id],
    queryFn: () => fetchCargosByMinisterio(ministry.id),
    enabled: open,
  });
  
  // Default avatar URL
  const avatarUrl = '/placeholder.svg';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[85vw] max-w-[1200px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl text-center">
            Detalles del Ministerio
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-grow pr-4 scrollbar-none">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
            {/* Profile Section */}
            <div className="md:col-span-1">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-primary shadow-md">
                  <img 
                    src={avatarUrl} 
                    alt={`Foto de ${ministry.nombre}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <h2 className="text-2xl font-bold text-center">
                  {ministry.nombre} {ministry.apellidos}
                </h2>
                
                {ministry.alias && (
                  <p className="text-gray-500 italic text-lg">"{ministry.alias}"</p>
                )}
                
                <div className="w-full space-y-3 bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-primary mr-3" />
                    <span>
                      {cargos.map(cargo => cargo.cargo).join(', ')}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-primary mr-3" />
                    <span>Aprobado en {ministry.aprob}</span>
                  </div>
                  
                  {ministry.telefono && (
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-primary mr-3" />
                      <span>{ministry.telefono}</span>
                    </div>
                  )}
                  
                  {ministry.email && (
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-primary mr-3" />
                      <span className="break-all">{ministry.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Observations Section */}
            <div className="md:col-span-2">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold border-b pb-2">Observaciones</h3>
                
                <div className="space-y-4">
                  {observations.length > 0 ? (
                    observations.map((obs, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg shadow-sm border">
                        <p className="mt-2 text-gray-600">{obs.observacion}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-6 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">No hay observaciones registradas.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MinistryDetailsModal;


import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Ministry } from '../types/dataTypes';
import { User, Calendar, BookOpen, Phone, Mail } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";

interface MinistryDetailsModalProps {
  ministry: Ministry;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MinistryDetailsModal: React.FC<MinistryDetailsModalProps> = ({ ministry, open, onOpenChange }) => {
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
                
                {ministry.alias && ministry.alias !== 'NULL' && (
                  <p className="text-gray-500 italic text-lg">"{ministry.alias}"</p>
                )}
                
                <div className="w-full space-y-3 bg-gray-50 p-4 rounded-lg">
                  {ministry.cargos && ministry.cargos.map((cargo, index) => (
                    <div key={index} className="flex items-center">
                      <User className="h-5 w-5 text-primary mr-3" />
                      <span>{cargo.cargo}</span>
                    </div>
                  ))}
                  
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-primary mr-3" />
                    <span>Aprobado en {ministry.aprob}</span>
                  </div>

                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-primary mr-3" />
                    <span>Código: {ministry.codigo}</span>
                  </div>
                  
                  {ministry.telefono && ministry.telefono !== 'NULL' && (
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-primary mr-3 mt-0.5" />
                      <span className="text-gray-700">{ministry.telefono}</span>
                    </div>
                  )}

                  {ministry.email && ministry.email !== 'NULL' && (
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-primary mr-3 mt-0.5" />
                      <span className="text-gray-700 break-all">{ministry.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Additional Information Section */}
            <div className="md:col-span-2">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold border-b pb-2">Información adicional</h3>
                
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium text-gray-700">Iglesia</p>
                    </div>
                    <p className="mt-2 text-gray-600">{ministry.iglesia_nombre}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium text-gray-700">Estado</p>
                    </div>
                    <p className="mt-2 text-gray-600">{ministry.estado_nombre}</p>
                  </div>
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

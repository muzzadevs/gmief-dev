
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Ministry } from '../lib/mockData';
import { User, Calendar, BookOpen } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";

interface ObservationProps {
  text: string;
  date: string;
  author?: string;
}

interface MinistryDetailsModalProps {
  ministry: Ministry;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MinistryDetailsModal: React.FC<MinistryDetailsModalProps> = ({ ministry, open, onOpenChange }) => {
  // Mock observations - in the future, these would come from a database
  const [observations] = useState<ObservationProps[]>([
    {
      text: `${ministry.name} ha mostrado un excepcional liderazgo en su rol como ${ministry.position}. Su dedicación a la comunidad y su capacidad para inspirar a otros es notable.`,
      date: "2024-03-15",
      author: "Coordinador Regional"
    },
    {
      text: "Participó activamente en el último retiro espiritual, liderando varias sesiones de oración y estudio bíblico.",
      date: "2024-02-22",
      author: "Equipo de Formación"
    }
  ]);
  
  // Default avatar URL
  const avatarUrl = ministry.photoUrl || '/placeholder.svg';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[85vw] max-w-[1200px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl text-center">
            Detalles del Ministerio
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-grow pr-4 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
            {/* Profile Section */}
            <div className="md:col-span-1">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-primary shadow-md">
                  <img 
                    src={avatarUrl} 
                    alt={`Foto de ${ministry.name}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <h2 className="text-2xl font-bold text-center">
                  {ministry.name} {ministry.lastName}
                </h2>
                
                {ministry.alias && (
                  <p className="text-gray-500 italic text-lg">"{ministry.alias}"</p>
                )}
                
                <div className="w-full space-y-3 bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-primary mr-3" />
                    <span>{ministry.position}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-primary mr-3" />
                    <span>Aprobado en {ministry.approvalYear}</span>
                  </div>
                  
                  {ministry.extraInfo && (
                    <div className="flex items-start">
                      <BookOpen className="h-5 w-5 text-primary mr-3 mt-0.5" />
                      <span className="text-gray-700">{ministry.extraInfo}</span>
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
                  {observations.map((obs, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow-sm border">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-medium text-gray-700">{obs.author}</p>
                        <span className="text-xs text-gray-500">{obs.date}</span>
                      </div>
                      <p className="mt-2 text-gray-600">{obs.text}</p>
                    </div>
                  ))}
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

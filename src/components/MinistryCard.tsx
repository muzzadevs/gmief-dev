
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Ministerio } from '../lib/api';
import { User, Calendar, BookOpen, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import MinistryDetailsModal from './MinistryDetailsModal';

interface MinistryCardProps {
  ministry: Ministerio;
}

const MinistryCard: React.FC<MinistryCardProps> = ({ ministry }) => {
  const [showDetails, setShowDetails] = React.useState(false);
  
  // Default avatar URL
  const avatarUrl = '/placeholder.svg';

  return (
    <>
      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
        <CardHeader className="p-0">
          <div className="bg-primary p-4 flex justify-center">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-white border-4 border-white shadow-md">
              <img 
                src={avatarUrl} 
                alt={`Foto de ${ministry.nombre}`} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          <div className="text-center">
            <h3 className="font-bold text-lg text-gray-800">
              {ministry.nombre} {ministry.apellidos}
            </h3>
            {ministry.alias && (
              <p className="text-sm text-gray-500 italic">"{ministry.alias}"</p>
            )}
          </div>
          
          <div className="space-y-2 pt-2">
            <div className="flex items-center">
              <User className="h-4 w-4 text-primary mr-2" />
              <span className="text-sm">{ministry.cargos?.split(',').join(', ')}</span>
            </div>
            
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-primary mr-2" />
              <span className="text-sm">Aprobado en {ministry.aprob}</span>
            </div>
            
            <div className="pt-3">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => setShowDetails(true)}
              >
                <Info className="mr-2 h-4 w-4" />
                Más Info
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <MinistryDetailsModal 
        ministry={ministry} 
        open={showDetails} 
        onOpenChange={setShowDetails} 
      />
    </>
  );
};

export default MinistryCard;

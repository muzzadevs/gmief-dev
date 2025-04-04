
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Building, MapPin, Info, Users } from 'lucide-react';
import { Church } from '../lib/mockData';

interface ChurchAccordionProps {
  churches: Church[];
}

const ChurchAccordion: React.FC<ChurchAccordionProps> = ({ churches }) => {
  const navigate = useNavigate();
  const [openItems, setOpenItems] = useState<string[]>([]);

  const handleOpenChange = (value: string[]) => {
    setOpenItems(value);
  };

  const handleManageMinistries = (churchId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/church/${churchId}`);
  };

  return (
    <Accordion type="multiple" value={openItems} onValueChange={handleOpenChange} className="w-full">
      {churches.map(church => (
        <AccordionItem key={church.id} value={church.id} className="border rounded-md mb-4 overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 font-medium text-lg">
            <div className="flex items-center text-left">
              <Building className="mr-2 h-5 w-5 text-primary" />
              <span>{church.name}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 py-3 bg-white">
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Dirección</p>
                  <p className="text-gray-600">{church.address}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Info className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Información Adicional</p>
                  <p className="text-gray-600">{church.additionalInfo}</p>
                </div>
              </div>
              
              <Button 
                onClick={(e) => handleManageMinistries(church.id, e)} 
                className="w-full flex items-center justify-center mt-4"
              >
                <Users className="mr-2 h-4 w-4" />
                Gestionar Ministerios
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default ChurchAccordion;

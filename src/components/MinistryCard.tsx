
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Ministry } from '../lib/mockData';
import { User, Calendar, BookOpen } from 'lucide-react';

interface MinistryCardProps {
  ministry: Ministry;
}

const MinistryCard: React.FC<MinistryCardProps> = ({ ministry }) => {
  // Use the provided avatar image
  const avatarUrl = "public/lovable-uploads/718c7dbe-684b-4512-ac45-eea14329ab06.png";

  return (
    <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow backdrop-blur-sm bg-white/70 border-white/30">
      <CardHeader className="p-0">
        <div className="bg-primary/10 p-4 flex justify-center backdrop-blur-sm">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-white border-4 border-white/80 shadow-lg">
            <img 
              src={avatarUrl} 
              alt={`Avatar de ${ministry.name}`} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div className="text-center">
          <h3 className="font-bold text-lg text-gray-800">
            {ministry.name} {ministry.lastName}
          </h3>
          {ministry.alias && (
            <p className="text-sm text-gray-500 italic">"{ministry.alias}"</p>
          )}
        </div>
        
        <div className="space-y-2 pt-2">
          <div className="flex items-center">
            <User className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm">{ministry.position}</span>
          </div>
          
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm">Aprobado en {ministry.approvalYear}</span>
          </div>
          
          {ministry.extraInfo && (
            <div className="flex items-start pt-1">
              <BookOpen className="h-4 w-4 text-primary mr-2 mt-0.5" />
              <span className="text-sm text-gray-600">{ministry.extraInfo}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MinistryCard;

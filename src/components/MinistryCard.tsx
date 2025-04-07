
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ministry } from '@/lib/mockData';
import MinistryDetailsModal from './MinistryDetailsModal';

interface MinistryCardProps {
  ministry: Ministry;
}

const MinistryCard: React.FC<MinistryCardProps> = ({ ministry }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <Card 
        className="overflow-hidden transition-all hover:shadow-md cursor-pointer" 
        onClick={() => setShowDetails(true)}
      >
        <CardHeader className="p-4 pb-2 bg-primary/5">
          <CardTitle className="text-lg font-medium text-primary">
            {ministry.role}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-3">
          <div className="space-y-2">
            <p className="font-medium text-gray-800">
              {ministry.name}
            </p>
            <p className="text-sm text-gray-600">
              {ministry.contactPhone && `Tel: ${ministry.contactPhone}`}
              {ministry.contactEmail && ministry.contactPhone && ' | '}
              {ministry.contactEmail && `Email: ${ministry.contactEmail}`}
            </p>
          </div>
        </CardContent>
      </Card>

      <MinistryDetailsModal
        ministry={ministry}
        open={showDetails}
        onClose={() => setShowDetails(false)}
      />
    </>
  );
};

export default MinistryCard;

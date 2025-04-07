
"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Church } from '@/lib/mockData';
import { ChevronRight } from 'lucide-react';

interface ChurchAccordionProps {
  churches: Church[];
}

const ChurchAccordion: React.FC<ChurchAccordionProps> = ({ churches }) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      {churches.map((church) => (
        <AccordionItem key={church.id} value={church.id}>
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-start">
              <span className="font-medium text-gray-800">{church.name}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 pb-4 px-1">
              <p className="text-gray-600 mb-4">{church.address}</p>
              {church.additionalInfo && (
                <p className="text-gray-500 text-sm mb-4">{church.additionalInfo}</p>
              )}
              <div className="flex justify-end">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/church/${church.id}`} className="flex items-center">
                    Ver detalles
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default ChurchAccordion;


"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Ministry } from '@/lib/mockData';
import { X } from 'lucide-react';

interface MinistryDetailsModalProps {
  ministry: Ministry;
  open: boolean;
  onClose: () => void;
}

const MinistryDetailsModal: React.FC<MinistryDetailsModalProps> = ({
  ministry,
  open,
  onClose,
}) => {
  if (!ministry) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{ministry.name}</DialogTitle>
          <DialogDescription>
            <span className="text-primary font-medium">
              {ministry.role}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-2">
          {ministry.description && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Descripción:</h4>
              <p className="text-gray-700">{ministry.description}</p>
            </div>
          )}

          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Información de contacto:</h4>
            <div className="space-y-1">
              {ministry.contactPhone && (
                <p className="text-gray-700">
                  <strong>Teléfono:</strong> {ministry.contactPhone}
                </p>
              )}
              {ministry.contactEmail && (
                <p className="text-gray-700">
                  <strong>Email:</strong> {ministry.contactEmail}
                </p>
              )}
            </div>
          </div>

          {ministry.additionalInfo && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Información adicional:</h4>
              <p className="text-gray-700">{ministry.additionalInfo}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MinistryDetailsModal;

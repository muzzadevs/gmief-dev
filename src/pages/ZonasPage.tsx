
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getZonas, createZona, updateZona, deleteZona } from '../api/zonasApi';
import Layout from '../components/Layout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Zone } from '../types/dataTypes';
import { Loader2, Plus, Pencil, Trash2, AlertTriangle } from 'lucide-react';

type FormValues = {
  nombre: string;
  codigo: string;
};

type ZonaFormProps = {
  zona?: Zone;
  onClose: () => void;
};

const ZonasPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [editingZona, setEditingZona] = useState<Zone | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [zonaToDelete, setZonaToDelete] = useState<Zone | null>(null);

  const { data: zonas, isLoading, error } = useQuery({
    queryKey: ['zonas'],
    queryFn: getZonas,
  });

  const createMutation = useMutation({
    mutationFn: createZona,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zonas'] });
      toast({
        title: "Zona creada",
        description: "La zona ha sido creada correctamente.",
      });
      setOpenNewDialog(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Error al crear la zona: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: Partial<Zone> }) => updateZona(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zonas'] });
      toast({
        title: "Zona actualizada",
        description: "La zona ha sido actualizada correctamente.",
      });
      setEditingZona(undefined);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Error al actualizar la zona: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteZona,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zonas'] });
      toast({
        title: "Zona eliminada",
        description: "La zona ha sido eliminada correctamente.",
      });
      setDeleteDialogOpen(false);
      setZonaToDelete(null);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Error al eliminar la zona: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      });
    },
  });

  const handleDelete = (zona: Zone) => {
    setZonaToDelete(zona);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (zonaToDelete) {
      deleteMutation.mutate(zonaToDelete.id);
    }
  };

  const ZonaForm: React.FC<ZonaFormProps> = ({ zona, onClose }) => {
    const form = useForm<FormValues>({
      defaultValues: {
        nombre: zona?.nombre || '',
        codigo: zona?.codigo || '',
      },
    });
  
    const onSubmit = (data: FormValues) => {
      if (zona) {
        updateMutation.mutate({ id: zona.id, data });
      } else {
        createMutation.mutate(data as Omit<Zone, 'id'>);
      }
    };
  
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre de la zona" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
  
          <FormField
            control={form.control}
            name="codigo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código</FormLabel>
                <FormControl>
                  <Input placeholder="Código de la zona" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
  
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            </DialogClose>
            <Button 
              type="submit" 
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {zona ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    );
  };

  if (error) {
    return (
      <Layout title="Zonas">
        <div className="rounded-lg bg-red-50 p-6 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-red-800">Error al cargar las zonas</h3>
          <p className="mt-2 text-red-600">
            {error instanceof Error ? error.message : 'Error desconocido. Intente de nuevo más tarde.'}
          </p>
          <Button 
            className="mt-4" 
            onClick={() => queryClient.invalidateQueries({ queryKey: ['zonas'] })}
          >
            Reintentar
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Gestión de Zonas">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-gray-500">
            Administre las zonas geográficas de las iglesias
          </p>
          <Button onClick={() => setOpenNewDialog(true)}>
            <Plus className="mr-2 h-4 w-4" /> Nueva Zona
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {zonas?.length ? (
                  zonas.map((zona) => (
                    <TableRow key={zona.id}>
                      <TableCell className="font-medium">{zona.nombre}</TableCell>
                      <TableCell>{zona.codigo}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setEditingZona(zona)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete(zona)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6 text-gray-500">
                      No hay zonas registradas
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Diálogo para crear nueva zona */}
      <Dialog open={openNewDialog} onOpenChange={setOpenNewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nueva Zona</DialogTitle>
          </DialogHeader>
          <ZonaForm onClose={() => setOpenNewDialog(false)} />
        </DialogContent>
      </Dialog>

      {/* Diálogo para editar zona */}
      <Dialog open={!!editingZona} onOpenChange={(open) => !open && setEditingZona(undefined)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Zona</DialogTitle>
          </DialogHeader>
          {editingZona && (
            <ZonaForm zona={editingZona} onClose={() => setEditingZona(undefined)} />
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo para confirmar eliminación */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>¿Está seguro de que desea eliminar la zona <strong>{zonaToDelete?.nombre}</strong>?</p>
            <p className="mt-2 text-sm text-red-500">
              Esta acción no se puede deshacer y podría afectar a las subzonas asociadas.
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={() => setZonaToDelete(null)}>
                Cancelar
              </Button>
            </DialogClose>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default ZonasPage;

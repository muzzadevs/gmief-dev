
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getZonas } from '../api/zonasApi';
import { getSubzonas, createSubzona, updateSubzona, deleteSubzona } from '../api/zonasApi';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Subzone, Zone } from '../types/dataTypes';
import { Loader2, Plus, Pencil, Trash2, AlertTriangle } from 'lucide-react';

type FormValues = {
  nombre: string;
  zona_id: string;
};

type SubzonaFormProps = {
  subzona?: Subzone;
  zonas: Zone[];
  onClose: () => void;
};

const SubzonasPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [editingSubzona, setEditingSubzona] = useState<Subzone | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subzonaToDelete, setSubzonaToDelete] = useState<Subzone | null>(null);

  const { data: zonas, isLoading: zonasLoading } = useQuery({
    queryKey: ['zonas'],
    queryFn: getZonas,
  });

  const { data: subzonas, isLoading: subzonasLoading, error } = useQuery({
    queryKey: ['subzonas'],
    queryFn: () => getSubzonas(),
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<Subzone, 'id'>) => {
      return createSubzona({ ...data, zona_id: parseInt(data.zona_id as unknown as string) });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subzonas'] });
      toast({
        title: "Subzona creada",
        description: "La subzona ha sido creada correctamente.",
      });
      setOpenNewDialog(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Error al crear la subzona: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: Partial<Subzone> }) => {
      if (typeof data.zona_id === 'string') {
        data.zona_id = parseInt(data.zona_id);
      }
      return updateSubzona(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subzonas'] });
      toast({
        title: "Subzona actualizada",
        description: "La subzona ha sido actualizada correctamente.",
      });
      setEditingSubzona(undefined);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Error al actualizar la subzona: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSubzona,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subzonas'] });
      toast({
        title: "Subzona eliminada",
        description: "La subzona ha sido eliminada correctamente.",
      });
      setDeleteDialogOpen(false);
      setSubzonaToDelete(null);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Error al eliminar la subzona: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      });
    },
  });

  const handleDelete = (subzona: Subzone) => {
    setSubzonaToDelete(subzona);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (subzonaToDelete) {
      deleteMutation.mutate(subzonaToDelete.id);
    }
  };

  const SubzonaForm: React.FC<SubzonaFormProps> = ({ subzona, zonas, onClose }) => {
    const form = useForm<FormValues>({
      defaultValues: {
        nombre: subzona?.nombre || '',
        zona_id: subzona?.zona_id.toString() || '',
      },
    });
  
    const onSubmit = (data: FormValues) => {
      if (subzona) {
        updateMutation.mutate({ id: subzona.id, data });
      } else {
        createMutation.mutate(data as unknown as Omit<Subzone, 'id'>);
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
                  <Input placeholder="Nombre de la subzona" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
  
          <FormField
            control={form.control}
            name="zona_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zona</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una zona" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {zonas?.map((zona) => (
                      <SelectItem key={zona.id} value={zona.id.toString()}>
                        {zona.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              {subzona ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    );
  };

  const isLoading = zonasLoading || subzonasLoading;

  if (error) {
    return (
      <Layout title="Subzonas">
        <div className="rounded-lg bg-red-50 p-6 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-red-800">Error al cargar las subzonas</h3>
          <p className="mt-2 text-red-600">
            {error instanceof Error ? error.message : 'Error desconocido. Intente de nuevo más tarde.'}
          </p>
          <Button 
            className="mt-4" 
            onClick={() => queryClient.invalidateQueries({ queryKey: ['subzonas'] })}
          >
            Reintentar
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Gestión de Subzonas">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-gray-500">
            Administre las subzonas geográficas de las iglesias
          </p>
          <Button onClick={() => setOpenNewDialog(true)} disabled={isLoading || !zonas?.length}>
            <Plus className="mr-2 h-4 w-4" /> Nueva Subzona
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
                  <TableHead>Zona</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subzonas?.length ? (
                  subzonas.map((subzona) => (
                    <TableRow key={subzona.id}>
                      <TableCell className="font-medium">{subzona.nombre}</TableCell>
                      <TableCell>{subzona.zona_nombre}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setEditingSubzona(subzona)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete(subzona)}
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
                      No hay subzonas registradas
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Diálogo para crear nueva subzona */}
      <Dialog open={openNewDialog} onOpenChange={setOpenNewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nueva Subzona</DialogTitle>
          </DialogHeader>
          {zonas && <SubzonaForm zonas={zonas} onClose={() => setOpenNewDialog(false)} />}
        </DialogContent>
      </Dialog>

      {/* Diálogo para editar subzona */}
      <Dialog open={!!editingSubzona} onOpenChange={(open) => !open && setEditingSubzona(undefined)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Subzona</DialogTitle>
          </DialogHeader>
          {editingSubzona && zonas && (
            <SubzonaForm subzona={editingSubzona} zonas={zonas} onClose={() => setEditingSubzona(undefined)} />
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
            <p>¿Está seguro de que desea eliminar la subzona <strong>{subzonaToDelete?.nombre}</strong>?</p>
            <p className="mt-2 text-sm text-red-500">
              Esta acción no se puede deshacer y podría afectar a las iglesias asociadas.
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={() => setSubzonaToDelete(null)}>
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

export default SubzonasPage;

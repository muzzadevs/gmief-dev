
import apiClient from './apiClient';
import { Zone, Subzone } from '../types/dataTypes';

// Obtener todas las zonas
export const getZonas = async (): Promise<Zone[]> => {
  try {
    const response = await apiClient.get('/zonas');
    console.log('Zonas obtenidas:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener zonas:', error);
    throw error;
  }
};

// Obtener zona por ID
export const getZonaById = async (id: number): Promise<Zone> => {
  try {
    const response = await apiClient.get(`/zonas/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener zona con ID ${id}:`, error);
    throw error;
  }
};

// Crear una nueva zona
export const createZona = async (zona: Omit<Zone, 'id'>): Promise<Zone> => {
  try {
    const response = await apiClient.post('/zonas', zona);
    return response.data;
  } catch (error) {
    console.error('Error al crear zona:', error);
    throw error;
  }
};

// Actualizar una zona existente
export const updateZona = async (id: number, zona: Partial<Zone>): Promise<Zone> => {
  try {
    const response = await apiClient.put(`/zonas/${id}`, zona);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar zona con ID ${id}:`, error);
    throw error;
  }
};

// Eliminar una zona
export const deleteZona = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/zonas/${id}`);
  } catch (error) {
    console.error(`Error al eliminar zona con ID ${id}:`, error);
    throw error;
  }
};

// Obtener todas las subzonas o por zona ID
export const getSubzonas = async (zonaId?: number): Promise<Subzone[]> => {
  try {
    if (zonaId) {
      const response = await apiClient.get(`/subzonas/${zonaId}`);
      return response.data;
    } else {
      const response = await apiClient.get('/subzonas');
      return response.data;
    }
  } catch (error) {
    console.error('Error al obtener subzonas:', error);
    throw error;
  }
};

// Crear una nueva subzona
export const createSubzona = async (subzona: Omit<Subzone, 'id'>): Promise<Subzone> => {
  try {
    const response = await apiClient.post('/subzonas', subzona);
    return response.data;
  } catch (error) {
    console.error('Error al crear subzona:', error);
    throw error;
  }
};

// Actualizar una subzona existente
export const updateSubzona = async (id: number, subzona: Partial<Subzone>): Promise<Subzone> => {
  try {
    const response = await apiClient.put(`/subzonas/${id}`, subzona);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar subzona con ID ${id}:`, error);
    throw error;
  }
};

// Eliminar una subzona
export const deleteSubzona = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/subzonas/${id}`);
  } catch (error) {
    console.error(`Error al eliminar subzona con ID ${id}:`, error);
    throw error;
  }
};

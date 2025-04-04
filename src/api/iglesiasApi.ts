
import apiClient from './apiClient';
import { Church } from '../types/dataTypes';

// Obtener todas las iglesias
export const getIglesias = async (): Promise<Church[]> => {
  try {
    const response = await apiClient.get('/iglesias');
    return response.data;
  } catch (error) {
    console.error('Error al obtener iglesias:', error);
    throw error;
  }
};

// Obtener iglesia por ID
export const getIglesiaById = async (id: number): Promise<Church> => {
  try {
    const response = await apiClient.get(`/iglesias/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener iglesia con ID ${id}:`, error);
    throw error;
  }
};

// Obtener iglesias por subzona
export const getIglesiasBySubzona = async (subzonaId: number): Promise<Church[]> => {
  try {
    const response = await apiClient.get(`/iglesias/subzona/${subzonaId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener iglesias de la subzona ${subzonaId}:`, error);
    throw error;
  }
};

// Crear una nueva iglesia
export const createIglesia = async (iglesia: Omit<Church, 'id'>): Promise<Church> => {
  try {
    const response = await apiClient.post('/iglesias', iglesia);
    return response.data;
  } catch (error) {
    console.error('Error al crear iglesia:', error);
    throw error;
  }
};

// Actualizar una iglesia existente
export const updateIglesia = async (id: number, iglesia: Partial<Church>): Promise<Church> => {
  try {
    const response = await apiClient.put(`/iglesias/${id}`, iglesia);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar iglesia con ID ${id}:`, error);
    throw error;
  }
};

// Eliminar una iglesia
export const deleteIglesia = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/iglesias/${id}`);
  } catch (error) {
    console.error(`Error al eliminar iglesia con ID ${id}:`, error);
    throw error;
  }
};

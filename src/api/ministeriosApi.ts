
import apiClient from './apiClient';
import { Ministry } from '../types/dataTypes';

// Obtener todos los ministerios
export const getMinisterios = async (): Promise<Ministry[]> => {
  try {
    const response = await apiClient.get('/ministerios');
    return response.data;
  } catch (error) {
    console.error('Error al obtener ministerios:', error);
    throw error;
  }
};

// Obtener ministerio por ID
export const getMinisterioById = async (id: number): Promise<Ministry> => {
  try {
    const response = await apiClient.get(`/ministerios/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener ministerio con ID ${id}:`, error);
    throw error;
  }
};

// Obtener ministerios por iglesia
export const getMinisteriosByIglesia = async (iglesiaId: number): Promise<Ministry[]> => {
  try {
    const response = await apiClient.get(`/ministerios/iglesia/${iglesiaId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener ministerios de la iglesia ${iglesiaId}:`, error);
    throw error;
  }
};

// Crear un nuevo ministerio
export const createMinisterio = async (ministerio: Omit<Ministry, 'id'>): Promise<Ministry> => {
  try {
    const response = await apiClient.post('/ministerios', ministerio);
    return response.data;
  } catch (error) {
    console.error('Error al crear ministerio:', error);
    throw error;
  }
};

// Actualizar un ministerio existente
export const updateMinisterio = async (id: number, ministerio: Partial<Ministry>): Promise<Ministry> => {
  try {
    const response = await apiClient.put(`/ministerios/${id}`, ministerio);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar ministerio con ID ${id}:`, error);
    throw error;
  }
};

// Eliminar un ministerio
export const deleteMinisterio = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/ministerios/${id}`);
  } catch (error) {
    console.error(`Error al eliminar ministerio con ID ${id}:`, error);
    throw error;
  }
};

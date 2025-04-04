
import apiClient from './apiClient';
import { Church } from '../types/dataTypes';

export const getIglesias = async (): Promise<Church[]> => {
  const response = await apiClient.get('/iglesias');
  return response.data;
};

export const getIglesiasBySubzona = async (subzonaId: number): Promise<Church[]> => {
  const response = await apiClient.get(`/iglesias/subzona/${subzonaId}`);
  return response.data;
};

export const getIglesiaById = async (id: number): Promise<Church> => {
  const response = await apiClient.get(`/iglesias/${id}`);
  return response.data;
};

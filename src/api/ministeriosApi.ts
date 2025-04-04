
import apiClient from './apiClient';
import { Ministry } from '../types/dataTypes';

export const getMinisterios = async (): Promise<Ministry[]> => {
  const response = await apiClient.get('/ministerios');
  return response.data;
};

export const getMinisteriosByIglesia = async (iglesiaId: number): Promise<Ministry[]> => {
  const response = await apiClient.get(`/ministerios/iglesia/${iglesiaId}`);
  return response.data;
};

export const getMinisterioById = async (id: number): Promise<Ministry> => {
  const response = await apiClient.get(`/ministerios/${id}`);
  return response.data;
};

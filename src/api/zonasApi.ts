
import apiClient from './apiClient';
import { Zone } from '../types/dataTypes';

export const getZonas = async (): Promise<Zone[]> => {
  const response = await apiClient.get('/zonas');
  return response.data;
};

export const getSubzonas = async (zonaId?: number): Promise<any[]> => {
  if (zonaId) {
    const response = await apiClient.get(`/subzonas/${zonaId}`);
    return response.data;
  } else {
    const response = await apiClient.get('/subzonas');
    return response.data;
  }
};

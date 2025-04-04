
import axios from 'axios';

// Configuration
const API_URL = 'http://localhost:3001/api';

// Types
export interface Zona {
  id: number;
  nombre: string;
  codigo: string;
}

export interface Subzona {
  id: number;
  nombre: string;
  zona_id: number;
}

export interface Iglesia {
  id: number;
  nombre: string;
  direccion: string;
  municipio: string;
  provincia: string;
  subzona_id: number;
  cp: number | null;
}

export interface Ministerio {
  id: number;
  nombre: string;
  apellidos: string;
  alias: string;
  iglesia_id: number;
  codigo: string;
  estado_id: number;
  aprob: number;
  telefono: string | null;
  email: string | null;
  cargos?: string; // For GROUP_CONCAT results
}

export interface Cargo {
  id: number;
  cargo: string;
}

export interface Estado {
  id: number;
  nombre: string;
}

export interface Observacion {
  id: number;
  ministerio_id: number;
  observacion: string;
}

// API functions
export const fetchZonas = async (): Promise<Zona[]> => {
  const response = await axios.get(`${API_URL}/zonas`);
  return response.data;
};

export const fetchSubzonas = async (): Promise<Subzona[]> => {
  const response = await axios.get(`${API_URL}/subzonas`);
  return response.data;
};

export const fetchSubzonasByZona = async (zonaId: number): Promise<Subzona[]> => {
  const response = await axios.get(`${API_URL}/subzonas/${zonaId}`);
  return response.data;
};

export const fetchIglesias = async (): Promise<Iglesia[]> => {
  const response = await axios.get(`${API_URL}/iglesias`);
  return response.data;
};

export const fetchIglesiasBySubzona = async (subzonaId: number): Promise<Iglesia[]> => {
  const response = await axios.get(`${API_URL}/iglesias/subzona/${subzonaId}`);
  return response.data;
};

export const fetchMinisterios = async (): Promise<Ministerio[]> => {
  const response = await axios.get(`${API_URL}/ministerios`);
  return response.data;
};

export const fetchMinisteriosByIglesia = async (iglesiaId: number): Promise<Ministerio[]> => {
  const response = await axios.get(`${API_URL}/ministerios/iglesia/${iglesiaId}`);
  return response.data;
};

export const fetchCargosByMinisterio = async (ministerioId: number): Promise<Cargo[]> => {
  const response = await axios.get(`${API_URL}/ministerio/${ministerioId}/cargos`);
  return response.data;
};

export const fetchObservacionesByMinisterio = async (ministerioId: number): Promise<Observacion[]> => {
  const response = await axios.get(`${API_URL}/ministerio/${ministerioId}/observaciones`);
  return response.data;
};

export const fetchCargos = async (): Promise<Cargo[]> => {
  const response = await axios.get(`${API_URL}/cargos`);
  return response.data;
};

export const fetchEstados = async (): Promise<Estado[]> => {
  const response = await axios.get(`${API_URL}/estados`);
  return response.data;
};

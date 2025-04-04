
// Basic types that match the database schema
export interface Zone {
  id: number;
  nombre: string;
  codigo: string;
}

export interface Subzone {
  id: number;
  nombre: string;
  zona_id: number;
  zona_nombre?: string;
}

export interface Church {
  id: number;
  nombre: string;
  direccion: string;
  municipio: string;
  provincia: string;
  subzona_id: number;
  cp?: number;
  subzona_nombre?: string;
  zona_nombre?: string;
}

export interface Cargo {
  id: number;
  cargo: string;
}

export interface Estado {
  id: number;
  nombre: string;
}

export interface Ministry {
  id: number;
  nombre: string;
  apellidos: string;
  alias: string;
  iglesia_id: number;
  codigo: string;
  estado_id: number;
  aprob: number;
  telefono?: string;
  email?: string;
  iglesia_nombre?: string;
  estado_nombre?: string;
  cargos?: Cargo[];
}

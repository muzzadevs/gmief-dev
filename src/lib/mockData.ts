
export interface Region {
  id: string;
  name: string;
  pathCoordinates: Array<[number, number]>; // Coordinates for canvas drawing
}

export interface Church {
  id: string;
  regionId: string;
  name: string;
  address: string;
  additionalInfo: string;
}

export interface Ministry {
  id: string;
  churchId: string;
  name: string;
  lastName: string;
  alias?: string;
  position: string;
  approvalYear: number;
  photoUrl?: string;
  extraInfo?: string;
}

// Data for Spain's regions
export const regions: Region[] = [
  {
    id: "norte",
    name: "Norte",
    pathCoordinates: [[50, 50], [150, 30], [200, 70], [180, 120], [80, 100]]
  },
  {
    id: "centro",
    name: "Centro",
    pathCoordinates: [[180, 120], [250, 100], [300, 150], [250, 200], [180, 180]]
  },
  {
    id: "este",
    name: "Este",
    pathCoordinates: [[300, 80], [350, 50], [400, 100], [350, 150], [300, 120]]
  },
  {
    id: "sur",
    name: "Sur",
    pathCoordinates: [[180, 180], [250, 200], [280, 250], [200, 280], [150, 230]]
  },
  {
    id: "oeste",
    name: "Oeste",
    pathCoordinates: [[50, 120], [130, 110], [150, 180], [100, 220], [40, 180]]
  }
];

// Mock data for churches
export const churches: Church[] = [
  {
    id: "iglesia-norte-1",
    regionId: "norte",
    name: "Iglesia Evangélica de Bilbao",
    address: "Calle Principal 123, Bilbao",
    additionalInfo: "Fundada en 1980, cuenta con una congregación de 150 miembros."
  },
  {
    id: "iglesia-norte-2",
    regionId: "norte",
    name: "Comunidad Cristiana de Santander",
    address: "Avenida de la Costa 45, Santander",
    additionalInfo: "Iglesia con enfoque en jóvenes y familias."
  },
  {
    id: "iglesia-centro-1",
    regionId: "centro",
    name: "Iglesia Evangélica de Madrid",
    address: "Gran Vía 78, Madrid",
    additionalInfo: "Una de las congregaciones más antiguas de la capital."
  },
  {
    id: "iglesia-centro-2",
    regionId: "centro",
    name: "Centro Cristiano de Alcalá",
    address: "Plaza Mayor 12, Alcalá de Henares",
    additionalInfo: "Enfocada en misiones locales e internacionales."
  },
  {
    id: "iglesia-este-1",
    regionId: "este",
    name: "Comunidad Cristiana de Barcelona",
    address: "Paseo de Gracia 56, Barcelona",
    additionalInfo: "Servicios en catalán y castellano."
  },
  {
    id: "iglesia-este-2",
    regionId: "este",
    name: "Iglesia de Valencia",
    address: "Calle del Mar 23, Valencia",
    additionalInfo: "Iglesia con fuerte compromiso social."
  },
  {
    id: "iglesia-sur-1",
    regionId: "sur",
    name: "Iglesia Evangélica de Sevilla",
    address: "Calle Sierpes 34, Sevilla",
    additionalInfo: "Congregación con más de 40 años de historia."
  },
  {
    id: "iglesia-sur-2",
    regionId: "sur",
    name: "Centro Cristiano de Málaga",
    address: "Avenida Andalucía 89, Málaga",
    additionalInfo: "Actividades semanales para todas las edades."
  },
  {
    id: "iglesia-oeste-1",
    regionId: "oeste",
    name: "Iglesia Evangélica de Salamanca",
    address: "Plaza Mayor 7, Salamanca",
    additionalInfo: "Ubicada en un edificio histórico restaurado."
  },
  {
    id: "iglesia-oeste-2",
    regionId: "oeste",
    name: "Comunidad Cristiana de Cáceres",
    address: "Calle Real 45, Cáceres",
    additionalInfo: "Especializada en ministerios de alabanza."
  }
];

// Mock data for ministries (people)
export const ministries: Ministry[] = [
  {
    id: "min-1",
    churchId: "iglesia-norte-1",
    name: "Antonio",
    lastName: "Rodríguez García",
    position: "Pastor Principal",
    approvalYear: 2005,
    extraInfo: "Especializado en consejería familiar."
  },
  {
    id: "min-2",
    churchId: "iglesia-norte-1",
    name: "María",
    lastName: "González López",
    alias: "Mari",
    position: "Coordinadora de Educación",
    approvalYear: 2010,
    extraInfo: "Maestra de profesión."
  },
  {
    id: "min-3",
    churchId: "iglesia-norte-2",
    name: "Carlos",
    lastName: "Fernández Martín",
    position: "Pastor Principal",
    approvalYear: 2008,
    extraInfo: "Anteriormente misionero en Latinoamérica."
  },
  {
    id: "min-4",
    churchId: "iglesia-centro-1",
    name: "Elena",
    lastName: "Sánchez Ruiz",
    position: "Pastora de Jóvenes",
    approvalYear: 2015,
    extraInfo: "Dirige el ministerio de música también."
  },
  {
    id: "min-5",
    churchId: "iglesia-centro-1",
    name: "David",
    lastName: "López Vázquez",
    position: "Anciano",
    approvalYear: 2003,
    extraInfo: "Responsable de las finanzas."
  },
  {
    id: "min-6",
    churchId: "iglesia-centro-2",
    name: "Raquel",
    lastName: "Martínez Silva",
    position: "Pastora Principal",
    approvalYear: 2012,
    extraInfo: "Autora de varios libros de teología práctica."
  },
  {
    id: "min-7",
    churchId: "iglesia-este-1",
    name: "Jorge",
    lastName: "Gómez Pérez",
    alias: "Jordi",
    position: "Pastor Principal",
    approvalYear: 2007,
    extraInfo: "Especializado en ministerios urbanos."
  },
  {
    id: "min-8",
    churchId: "iglesia-este-2",
    name: "Lucía",
    lastName: "Torres Navarro",
    position: "Pastora de Familia",
    approvalYear: 2014,
    extraInfo: "Psicóloga de profesión."
  },
  {
    id: "min-9",
    churchId: "iglesia-sur-1",
    name: "Manuel",
    lastName: "Díaz González",
    alias: "Manolo",
    position: "Pastor Principal",
    approvalYear: 2000,
    extraInfo: "Fundador de la congregación."
  },
  {
    id: "min-10",
    churchId: "iglesia-sur-2",
    name: "Alicia",
    lastName: "Romero Sanz",
    position: "Coordinadora de Misiones",
    approvalYear: 2011,
    extraInfo: "Ha servido en más de 10 países."
  },
  {
    id: "min-11",
    churchId: "iglesia-oeste-1",
    name: "Francisco",
    lastName: "Ortega Castro",
    alias: "Paco",
    position: "Pastor Principal",
    approvalYear: 2006,
    extraInfo: "Especializado en estudios bíblicos."
  },
  {
    id: "min-12",
    churchId: "iglesia-oeste-2",
    name: "Beatriz",
    lastName: "Jiménez Reyes",
    position: "Directora de Alabanza",
    approvalYear: 2013,
    extraInfo: "Compositora de música cristiana."
  }
];

// Helper functions
export const getRegionById = (id: string): Region | undefined => {
  return regions.find(region => region.id === id);
};

export const getChurchesByRegionId = (regionId: string): Church[] => {
  return churches.filter(church => church.regionId === regionId);
};

export const getChurchById = (id: string): Church | undefined => {
  return churches.find(church => church.id === id);
};

export const getMinistriesByChurchId = (churchId: string): Ministry[] => {
  return ministries.filter(ministry => ministry.churchId === churchId);
};

export const getMinistryById = (id: string): Ministry | undefined => {
  return ministries.find(ministry => ministry.id === id);
};

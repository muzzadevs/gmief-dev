
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
  alias: string; // Now required for all
  position: string;
  approvalYear: number;
  photoUrl?: string;
  extraInfo?: string;
}

// Datos actualizados para las regiones de España
export const regions: Region[] = [
  {
    id: "norte",
    name: "Norte",
    pathCoordinates: [
      [50, 30], [150, 20], [250, 30], [300, 80], [200, 100], [100, 90]
    ]
  },
  {
    id: "centro",
    name: "Centro",
    pathCoordinates: [
      [100, 90], [200, 100], [300, 80], [350, 150], [250, 200], [150, 180]
    ]
  },
  {
    id: "este",
    name: "Este",
    pathCoordinates: [
      [300, 80], [400, 60], [450, 150], [400, 250], [350, 150]
    ]
  },
  {
    id: "sur",
    name: "Sur",
    pathCoordinates: [
      [150, 180], [250, 200], [350, 150], [400, 250], [300, 300], [200, 280]
    ]
  },
  {
    id: "oeste",
    name: "Oeste",
    pathCoordinates: [
      [50, 30], [100, 90], [150, 180], [200, 280], [100, 250], [30, 150]
    ]
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

// Mock data for ministries (only men with aliases)
export const ministries: Ministry[] = [
  {
    id: "min-1",
    churchId: "iglesia-norte-1",
    name: "Antonio",
    lastName: "Rodríguez García",
    alias: "Toño",
    position: "Pastor Principal",
    approvalYear: 2005,
    extraInfo: "Especializado en consejería familiar."
  },
  {
    id: "min-2",
    churchId: "iglesia-norte-1",
    name: "Miguel",
    lastName: "González López",
    alias: "Mike",
    position: "Coordinador de Educación",
    approvalYear: 2010,
    extraInfo: "Profesor de teología."
  },{
    id: "min-21",
    churchId: "iglesia-norte-1",
    name: "Miguel",
    lastName: "González López",
    alias: "Mike",
    position: "Coordinador de Educación",
    approvalYear: 2010,
    extraInfo: "Profesor de teología."
  },{
    id: "min-22",
    churchId: "iglesia-norte-1",
    name: "Miguel",
    lastName: "González López",
    alias: "Mike",
    position: "Coordinador de Educación",
    approvalYear: 2010,
    extraInfo: "Profesor de teología."
  },{
    id: "min-23",
    churchId: "iglesia-norte-1",
    name: "Miguel",
    lastName: "González López",
    alias: "Mike",
    position: "Coordinador de Educación",
    approvalYear: 2010,
    extraInfo: "Profesor de teología."
  },{
    id: "min-24",
    churchId: "iglesia-norte-1",
    name: "Miguel",
    lastName: "González López",
    alias: "Mike",
    position: "Coordinador de Educación",
    approvalYear: 2010,
    extraInfo: "Profesor de teología."
  },{
    id: "min-25",
    churchId: "iglesia-norte-1",
    name: "Miguel",
    lastName: "González López",
    alias: "Mike",
    position: "Coordinador de Educación",
    approvalYear: 2010,
    extraInfo: "Profesor de teología."
  },{
    id: "min-26",
    churchId: "iglesia-norte-1",
    name: "Miguel",
    lastName: "González López",
    alias: "Mike",
    position: "Coordinador de Educación",
    approvalYear: 2010,
    extraInfo: "Profesor de teología."
  },{
    id: "min-27",
    churchId: "iglesia-norte-1",
    name: "Miguel",
    lastName: "González López",
    alias: "Mike",
    position: "Coordinador de Educación",
    approvalYear: 2010,
    extraInfo: "Profesor de teología."
  },{
    id: "min-28",
    churchId: "iglesia-norte-1",
    name: "Miguel",
    lastName: "González López",
    alias: "Mike",
    position: "Coordinador de Educación",
    approvalYear: 2010,
    extraInfo: "Profesor de teología."
  },{
    id: "min-29",
    churchId: "iglesia-norte-1",
    name: "Miguel",
    lastName: "González López",
    alias: "Mike",
    position: "Coordinador de Educación",
    approvalYear: 2010,
    extraInfo: "Profesor de teología."
  },
  {
    id: "min-3",
    churchId: "iglesia-norte-2",
    name: "Carlos",
    lastName: "Fernández Martín",
    alias: "Charly",
    position: "Pastor Principal",
    approvalYear: 2008,
    extraInfo: "Anteriormente misionero en Latinoamérica."
  },
  {
    id: "min-4",
    churchId: "iglesia-centro-1",
    name: "Eduardo",
    lastName: "Sánchez Ruiz",
    alias: "Edu",
    position: "Pastor de Jóvenes",
    approvalYear: 2015,
    extraInfo: "Dirige el ministerio de música también."
  },
  {
    id: "min-5",
    churchId: "iglesia-centro-1",
    name: "David",
    lastName: "López Vázquez",
    alias: "Davo",
    position: "Anciano",
    approvalYear: 2003,
    extraInfo: "Responsable de las finanzas."
  },
  {
    id: "min-6",
    churchId: "iglesia-centro-2",
    name: "Roberto",
    lastName: "Martínez Silva",
    alias: "Berto",
    position: "Pastor Principal",
    approvalYear: 2012,
    extraInfo: "Autor de varios libros de teología práctica."
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
    name: "Luis",
    lastName: "Torres Navarro",
    alias: "Lucho",
    position: "Pastor de Familia",
    approvalYear: 2014,
    extraInfo: "Psicólogo de profesión."
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
    name: "Alberto",
    lastName: "Romero Sanz",
    alias: "Beto",
    position: "Coordinador de Misiones",
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
    name: "Javier",
    lastName: "Jiménez Reyes",
    alias: "Javi",
    position: "Director de Alabanza",
    approvalYear: 2013,
    extraInfo: "Compositor de música cristiana."
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

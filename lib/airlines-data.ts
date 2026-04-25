export interface Airline {
  id: string
  name: string
  code: string
  country: string
  logo: string
  rating: number
  reviews: number
  category: string
  type: 'premium' | 'standard' | 'low-cost'
  alliance: string | null
  highlights: string[]
  stats: {
    puntualidad: number
    servicio: number
    comida: number
    entretenimiento: number
    confort: number
    relacionCalidadPrecio: number
  }
  features: {
    wifi: boolean
    entretenimiento: boolean
    comidaIncluida: boolean
    equipajeMano: string
    equipajeFacturado: string
    seleccionAsiento: 'gratis' | 'pago' | 'no disponible'
    cambiosGratis: boolean
    loungeAccess: boolean
  }
  flota: {
    aviones: number
    edadPromedio: number
    tiposAvion: string[]
  }
  destinos: number
  fundacion: number
  hub: string[]
  contacto: {
    web: string
    telefono: string
  }
}

export const airlinesData: Airline[] = [
  {
    id: 'singapore-airlines',
    name: 'Singapore Airlines',
    code: 'SQ',
    country: 'Singapur',
    logo: 'SQ',
    rating: 4.9,
    reviews: 12847,
    category: 'Mejor Overall',
    type: 'premium',
    alliance: 'Star Alliance',
    highlights: ['Mejor servicio a bordo', 'Asientos premium', 'Entretenimiento 5 estrellas'],
    stats: {
      puntualidad: 92,
      servicio: 98,
      comida: 95,
      entretenimiento: 97,
      confort: 96,
      relacionCalidadPrecio: 85,
    },
    features: {
      wifi: true,
      entretenimiento: true,
      comidaIncluida: true,
      equipajeMano: '7 kg',
      equipajeFacturado: '30 kg',
      seleccionAsiento: 'gratis',
      cambiosGratis: true,
      loungeAccess: true,
    },
    flota: {
      aviones: 147,
      edadPromedio: 6.2,
      tiposAvion: ['A350-900', 'A380-800', 'B787-10', 'B777-300ER'],
    },
    destinos: 137,
    fundacion: 1947,
    hub: ['Singapur Changi'],
    contacto: {
      web: 'singaporeair.com',
      telefono: '+65 6223 8888',
    },
  },
  {
    id: 'qatar-airways',
    name: 'Qatar Airways',
    code: 'QR',
    country: 'Qatar',
    logo: 'QR',
    rating: 4.8,
    reviews: 10234,
    category: 'Mejor Business',
    type: 'premium',
    alliance: 'Oneworld',
    highlights: ['Clase business excepcional', 'Lounge VIP', 'Gastronomia gourmet'],
    stats: {
      puntualidad: 88,
      servicio: 96,
      comida: 94,
      entretenimiento: 95,
      confort: 94,
      relacionCalidadPrecio: 82,
    },
    features: {
      wifi: true,
      entretenimiento: true,
      comidaIncluida: true,
      equipajeMano: '7 kg',
      equipajeFacturado: '30 kg',
      seleccionAsiento: 'gratis',
      cambiosGratis: true,
      loungeAccess: true,
    },
    flota: {
      aviones: 234,
      edadPromedio: 5.8,
      tiposAvion: ['A350-1000', 'A380-800', 'B787-9', 'B777-300ER'],
    },
    destinos: 170,
    fundacion: 1993,
    hub: ['Doha Hamad'],
    contacto: {
      web: 'qatarairways.com',
      telefono: '+974 4449 6666',
    },
  },
  {
    id: 'emirates',
    name: 'Emirates',
    code: 'EK',
    country: 'Emiratos Arabes Unidos',
    logo: 'EK',
    rating: 4.8,
    reviews: 15672,
    category: 'Mejor Lujo',
    type: 'premium',
    alliance: null,
    highlights: ['Suite privada', 'Bar a bordo', 'Conectividad WiFi'],
    stats: {
      puntualidad: 85,
      servicio: 94,
      comida: 93,
      entretenimiento: 98,
      confort: 95,
      relacionCalidadPrecio: 80,
    },
    features: {
      wifi: true,
      entretenimiento: true,
      comidaIncluida: true,
      equipajeMano: '7 kg',
      equipajeFacturado: '30 kg',
      seleccionAsiento: 'gratis',
      cambiosGratis: false,
      loungeAccess: true,
    },
    flota: {
      aviones: 262,
      edadPromedio: 7.1,
      tiposAvion: ['A380-800', 'B777-300ER', 'B777-200LR'],
    },
    destinos: 157,
    fundacion: 1985,
    hub: ['Dubai DXB'],
    contacto: {
      web: 'emirates.com',
      telefono: '+971 600 555 555',
    },
  },
  {
    id: 'ana',
    name: 'ANA All Nippon',
    code: 'NH',
    country: 'Japon',
    logo: 'NH',
    rating: 4.7,
    reviews: 8934,
    category: 'Mejor Puntualidad',
    type: 'premium',
    alliance: 'Star Alliance',
    highlights: ['Puntualidad impecable', 'Servicio japones', 'Limpieza excepcional'],
    stats: {
      puntualidad: 98,
      servicio: 95,
      comida: 90,
      entretenimiento: 88,
      confort: 92,
      relacionCalidadPrecio: 88,
    },
    features: {
      wifi: true,
      entretenimiento: true,
      comidaIncluida: true,
      equipajeMano: '10 kg',
      equipajeFacturado: '23 kg x2',
      seleccionAsiento: 'gratis',
      cambiosGratis: true,
      loungeAccess: true,
    },
    flota: {
      aviones: 218,
      edadPromedio: 8.3,
      tiposAvion: ['B787-10', 'B787-9', 'B777-300ER', 'A321neo'],
    },
    destinos: 118,
    fundacion: 1952,
    hub: ['Tokyo Haneda', 'Tokyo Narita'],
    contacto: {
      web: 'ana.co.jp',
      telefono: '+81 3 6741 1120',
    },
  },
  {
    id: 'cathay-pacific',
    name: 'Cathay Pacific',
    code: 'CX',
    country: 'Hong Kong',
    logo: 'CX',
    rating: 4.7,
    reviews: 7823,
    category: 'Mejor Asia-Pacifico',
    type: 'premium',
    alliance: 'Oneworld',
    highlights: ['Hub en Hong Kong', 'Asientos comodos', 'Tripulacion profesional'],
    stats: {
      puntualidad: 86,
      servicio: 93,
      comida: 89,
      entretenimiento: 90,
      confort: 91,
      relacionCalidadPrecio: 83,
    },
    features: {
      wifi: true,
      entretenimiento: true,
      comidaIncluida: true,
      equipajeMano: '7 kg',
      equipajeFacturado: '30 kg',
      seleccionAsiento: 'gratis',
      cambiosGratis: false,
      loungeAccess: true,
    },
    flota: {
      aviones: 178,
      edadPromedio: 9.2,
      tiposAvion: ['A350-1000', 'A350-900', 'B777-300ER', 'A321neo'],
    },
    destinos: 86,
    fundacion: 1946,
    hub: ['Hong Kong HKG'],
    contacto: {
      web: 'cathaypacific.com',
      telefono: '+852 2747 3333',
    },
  },
  {
    id: 'lufthansa',
    name: 'Lufthansa',
    code: 'LH',
    country: 'Alemania',
    logo: 'LH',
    rating: 4.5,
    reviews: 9876,
    category: 'Mejor Europa',
    type: 'premium',
    alliance: 'Star Alliance',
    highlights: ['Red extensa', 'Servicio aleman', 'Conexiones eficientes'],
    stats: {
      puntualidad: 82,
      servicio: 88,
      comida: 85,
      entretenimiento: 87,
      confort: 86,
      relacionCalidadPrecio: 78,
    },
    features: {
      wifi: true,
      entretenimiento: true,
      comidaIncluida: true,
      equipajeMano: '8 kg',
      equipajeFacturado: '23 kg',
      seleccionAsiento: 'pago',
      cambiosGratis: false,
      loungeAccess: true,
    },
    flota: {
      aviones: 276,
      edadPromedio: 11.5,
      tiposAvion: ['A350-900', 'A380-800', 'B747-8', 'A321neo'],
    },
    destinos: 220,
    fundacion: 1953,
    hub: ['Frankfurt FRA', 'Munich MUC'],
    contacto: {
      web: 'lufthansa.com',
      telefono: '+49 69 86799799',
    },
  },
  {
    id: 'ryanair',
    name: 'Ryanair',
    code: 'FR',
    country: 'Irlanda',
    logo: 'FR',
    rating: 3.2,
    reviews: 24567,
    category: 'Mejor Precio',
    type: 'low-cost',
    alliance: null,
    highlights: ['Precios bajos', 'Red europea amplia', 'Reserva facil'],
    stats: {
      puntualidad: 88,
      servicio: 55,
      comida: 40,
      entretenimiento: 30,
      confort: 50,
      relacionCalidadPrecio: 92,
    },
    features: {
      wifi: false,
      entretenimiento: false,
      comidaIncluida: false,
      equipajeMano: '40x20x25 cm gratis',
      equipajeFacturado: 'Desde 20 kg (pago)',
      seleccionAsiento: 'pago',
      cambiosGratis: false,
      loungeAccess: false,
    },
    flota: {
      aviones: 565,
      edadPromedio: 6.8,
      tiposAvion: ['B737-8200', 'B737 MAX 8'],
    },
    destinos: 225,
    fundacion: 1984,
    hub: ['Dublin DUB', 'London STN'],
    contacto: {
      web: 'ryanair.com',
      telefono: '+353 1 249 7700',
    },
  },
  {
    id: 'easyjet',
    name: 'easyJet',
    code: 'U2',
    country: 'Reino Unido',
    logo: 'U2',
    rating: 3.5,
    reviews: 18234,
    category: 'Low-Cost Europa',
    type: 'low-cost',
    alliance: null,
    highlights: ['Precios competitivos', 'Puntualidad aceptable', 'App moderna'],
    stats: {
      puntualidad: 80,
      servicio: 60,
      comida: 45,
      entretenimiento: 35,
      confort: 55,
      relacionCalidadPrecio: 88,
    },
    features: {
      wifi: false,
      entretenimiento: false,
      comidaIncluida: false,
      equipajeMano: '45x36x20 cm gratis',
      equipajeFacturado: 'Desde 15 kg (pago)',
      seleccionAsiento: 'pago',
      cambiosGratis: false,
      loungeAccess: false,
    },
    flota: {
      aviones: 334,
      edadPromedio: 7.5,
      tiposAvion: ['A320neo', 'A321neo', 'A320-200'],
    },
    destinos: 156,
    fundacion: 1995,
    hub: ['London LGW', 'London LTN'],
    contacto: {
      web: 'easyjet.com',
      telefono: '+44 330 365 5000',
    },
  },
  {
    id: 'iberia',
    name: 'Iberia',
    code: 'IB',
    country: 'Espana',
    logo: 'IB',
    rating: 4.0,
    reviews: 11234,
    category: 'Mejor Espana-Latam',
    type: 'standard',
    alliance: 'Oneworld',
    highlights: ['Conexion Espana-Latam', 'Servicio mejorado', 'Avios millas'],
    stats: {
      puntualidad: 78,
      servicio: 80,
      comida: 75,
      entretenimiento: 82,
      confort: 78,
      relacionCalidadPrecio: 75,
    },
    features: {
      wifi: true,
      entretenimiento: true,
      comidaIncluida: true,
      equipajeMano: '56x40x25 cm',
      equipajeFacturado: '23 kg',
      seleccionAsiento: 'pago',
      cambiosGratis: false,
      loungeAccess: true,
    },
    flota: {
      aviones: 134,
      edadPromedio: 10.2,
      tiposAvion: ['A350-900', 'A330-200', 'A321neo', 'A320neo'],
    },
    destinos: 130,
    fundacion: 1927,
    hub: ['Madrid MAD'],
    contacto: {
      web: 'iberia.com',
      telefono: '+34 901 111 500',
    },
  },
  {
    id: 'latam',
    name: 'LATAM Airlines',
    code: 'LA',
    country: 'Chile',
    logo: 'LA',
    rating: 4.1,
    reviews: 9876,
    category: 'Mejor Sudamerica',
    type: 'standard',
    alliance: null,
    highlights: ['Lider en Sudamerica', 'Buena cobertura', 'Programa LATAM Pass'],
    stats: {
      puntualidad: 82,
      servicio: 82,
      comida: 78,
      entretenimiento: 85,
      confort: 80,
      relacionCalidadPrecio: 78,
    },
    features: {
      wifi: true,
      entretenimiento: true,
      comidaIncluida: true,
      equipajeMano: '10 kg',
      equipajeFacturado: '23 kg',
      seleccionAsiento: 'pago',
      cambiosGratis: false,
      loungeAccess: true,
    },
    flota: {
      aviones: 312,
      edadPromedio: 9.8,
      tiposAvion: ['B787-9', 'A350-900', 'A321neo', 'A320neo'],
    },
    destinos: 145,
    fundacion: 1929,
    hub: ['Santiago SCL', 'Lima LIM', 'Sao Paulo GRU'],
    contacto: {
      web: 'latamairlines.com',
      telefono: '+56 2 2565 1000',
    },
  },
]

export function getAirlineById(id: string): Airline | undefined {
  return airlinesData.find((airline) => airline.id === id)
}

export function getAirlinesByType(type: Airline['type']): Airline[] {
  return airlinesData.filter((airline) => airline.type === type)
}

export function getTopAirlines(limit: number = 5): Airline[] {
  return [...airlinesData].sort((a, b) => b.rating - a.rating).slice(0, limit)
}

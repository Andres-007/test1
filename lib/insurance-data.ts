export interface InsurancePlan {
  id: string
  name: string
  provider: string
  logo: string
  price: number
  pricePerDay: number
  coverage: {
    medical: number
    cancellation: number
    baggage: number
    delay: number
  }
  features: string[]
  excludes: string[]
  rating: number
  reviews: number
  recommended?: boolean
}

export const insurancePlans: InsurancePlan[] = [
  {
    id: 'allianz-basic',
    name: 'Viaje Basico',
    provider: 'Allianz',
    logo: 'A',
    price: 45,
    pricePerDay: 4.5,
    coverage: {
      medical: 50000,
      cancellation: 1500,
      baggage: 500,
      delay: 100,
    },
    features: [
      'Asistencia medica 24/7',
      'Repatriacion sanitaria',
      'Cobertura COVID-19',
      'App movil de asistencia',
    ],
    excludes: [
      'Deportes extremos',
      'Enfermedades preexistentes',
    ],
    rating: 4.2,
    reviews: 1234,
  },
  {
    id: 'allianz-premium',
    name: 'Viaje Premium',
    provider: 'Allianz',
    logo: 'A',
    price: 89,
    pricePerDay: 8.9,
    coverage: {
      medical: 150000,
      cancellation: 5000,
      baggage: 1500,
      delay: 300,
    },
    features: [
      'Asistencia medica 24/7',
      'Repatriacion sanitaria',
      'Cobertura COVID-19',
      'Deportes de aventura',
      'Cancelacion por cualquier motivo',
      'Gastos de hotel extra',
      'App movil de asistencia',
    ],
    excludes: [
      'Deportes extremos profesionales',
    ],
    rating: 4.6,
    reviews: 2345,
    recommended: true,
  },
  {
    id: 'mapfre-esencial',
    name: 'Viajero Esencial',
    provider: 'MAPFRE',
    logo: 'M',
    price: 39,
    pricePerDay: 3.9,
    coverage: {
      medical: 30000,
      cancellation: 1000,
      baggage: 400,
      delay: 75,
    },
    features: [
      'Asistencia medica',
      'Repatriacion',
      'Perdida de equipaje',
      'Responsabilidad civil',
    ],
    excludes: [
      'Deportes de riesgo',
      'Enfermedades preexistentes',
      'Cancelacion voluntaria',
    ],
    rating: 4.0,
    reviews: 987,
  },
  {
    id: 'mapfre-total',
    name: 'Viajero Total',
    provider: 'MAPFRE',
    logo: 'M',
    price: 75,
    pricePerDay: 7.5,
    coverage: {
      medical: 100000,
      cancellation: 3000,
      baggage: 1200,
      delay: 200,
    },
    features: [
      'Asistencia medica ilimitada',
      'Repatriacion',
      'Cobertura equipaje completa',
      'Responsabilidad civil',
      'Deportes de aventura',
      'Robo de documentos',
    ],
    excludes: [
      'Deportes extremos',
    ],
    rating: 4.4,
    reviews: 1567,
  },
  {
    id: 'axa-explorer',
    name: 'Explorer',
    provider: 'AXA',
    logo: 'X',
    price: 55,
    pricePerDay: 5.5,
    coverage: {
      medical: 75000,
      cancellation: 2000,
      baggage: 800,
      delay: 150,
    },
    features: [
      'Asistencia medica 24/7',
      'Repatriacion sanitaria',
      'Cobertura COVID',
      'Interrupcion de viaje',
      'Asistencia legal',
    ],
    excludes: [
      'Deportes extremos',
      'Viajes de mas de 90 dias',
    ],
    rating: 4.3,
    reviews: 1890,
  },
  {
    id: 'axa-adventure',
    name: 'Adventure Plus',
    provider: 'AXA',
    logo: 'X',
    price: 110,
    pricePerDay: 11,
    coverage: {
      medical: 200000,
      cancellation: 6000,
      baggage: 2000,
      delay: 400,
    },
    features: [
      'Cobertura medica maxima',
      'Todos los deportes incluidos',
      'Cancelacion flexible',
      'Equipaje premium',
      'Asistencia VIP 24/7',
      'Traslado familiar',
      'Segunda opinion medica',
    ],
    excludes: [
      'Competiciones profesionales',
    ],
    rating: 4.8,
    reviews: 756,
  },
  {
    id: 'mondo-basico',
    name: 'Tranquilidad',
    provider: 'Mondo',
    logo: 'Mo',
    price: 35,
    pricePerDay: 3.5,
    coverage: {
      medical: 40000,
      cancellation: 800,
      baggage: 300,
      delay: 50,
    },
    features: [
      'Asistencia medica',
      'App con chat medico',
      'Repatriacion',
      'COVID incluido',
    ],
    excludes: [
      'Deportes de riesgo',
      'Cancelacion voluntaria',
      'Enfermedades preexistentes',
    ],
    rating: 4.1,
    reviews: 2100,
  },
  {
    id: 'mondo-top',
    name: 'Top Viajero',
    provider: 'Mondo',
    logo: 'Mo',
    price: 95,
    pricePerDay: 9.5,
    coverage: {
      medical: 500000,
      cancellation: 4000,
      baggage: 1800,
      delay: 350,
    },
    features: [
      'Cobertura medica excepcional',
      'Telemedicina ilimitada',
      'Deportes de aventura',
      'Cancelacion ampliada',
      'Robo de efectivo',
      'Demora de vuelo desde 4h',
      'App premium',
    ],
    excludes: [
      'Deportes profesionales',
    ],
    rating: 4.7,
    reviews: 1432,
  },
]

export const destinations = [
  { value: 'europe', label: 'Europa', multiplier: 1 },
  { value: 'usa', label: 'Estados Unidos', multiplier: 1.3 },
  { value: 'asia', label: 'Asia', multiplier: 1.2 },
  { value: 'latam', label: 'Latinoamerica', multiplier: 1.1 },
  { value: 'africa', label: 'Africa', multiplier: 1.25 },
  { value: 'oceania', label: 'Oceania', multiplier: 1.35 },
  { value: 'worldwide', label: 'Mundial', multiplier: 1.5 },
]

export const tripTypes = [
  { value: 'tourism', label: 'Turismo', multiplier: 1 },
  { value: 'business', label: 'Negocios', multiplier: 1.1 },
  { value: 'adventure', label: 'Aventura', multiplier: 1.4 },
  { value: 'study', label: 'Estudios', multiplier: 1.15 },
]

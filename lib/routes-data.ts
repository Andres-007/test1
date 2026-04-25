export interface AirlineRoute {
  id: string
  airlineId: string
  airlineName: string
  airlineCode: string
  origin: {
    code: string
    city: string
    country: string
    coordinates: [number, number] // [longitude, latitude]
  }
  destination: {
    code: string
    city: string
    country: string
    coordinates: [number, number]
  }
  frequency: string
  aircraft: string
}

export const airlineRoutes: AirlineRoute[] = [
  // Singapore Airlines routes
  {
    id: 'sq-1',
    airlineId: 'singapore-airlines',
    airlineName: 'Singapore Airlines',
    airlineCode: 'SQ',
    origin: { code: 'SIN', city: 'Singapur', country: 'Singapur', coordinates: [103.9915, 1.3644] },
    destination: { code: 'LHR', city: 'Londres', country: 'Reino Unido', coordinates: [-0.4543, 51.4700] },
    frequency: 'Diario',
    aircraft: 'A350-900',
  },
  {
    id: 'sq-2',
    airlineId: 'singapore-airlines',
    airlineName: 'Singapore Airlines',
    airlineCode: 'SQ',
    origin: { code: 'SIN', city: 'Singapur', country: 'Singapur', coordinates: [103.9915, 1.3644] },
    destination: { code: 'JFK', city: 'Nueva York', country: 'Estados Unidos', coordinates: [-73.7781, 40.6413] },
    frequency: 'Diario',
    aircraft: 'A350-900ULR',
  },
  {
    id: 'sq-3',
    airlineId: 'singapore-airlines',
    airlineName: 'Singapore Airlines',
    airlineCode: 'SQ',
    origin: { code: 'SIN', city: 'Singapur', country: 'Singapur', coordinates: [103.9915, 1.3644] },
    destination: { code: 'SYD', city: 'Sydney', country: 'Australia', coordinates: [151.1772, -33.9462] },
    frequency: 'Diario',
    aircraft: 'A380-800',
  },
  // Emirates routes
  {
    id: 'ek-1',
    airlineId: 'emirates',
    airlineName: 'Emirates',
    airlineCode: 'EK',
    origin: { code: 'DXB', city: 'Dubai', country: 'Emiratos Arabes Unidos', coordinates: [55.3644, 25.2532] },
    destination: { code: 'MAD', city: 'Madrid', country: 'Espana', coordinates: [-3.5673, 40.4722] },
    frequency: 'Diario',
    aircraft: 'B777-300ER',
  },
  {
    id: 'ek-2',
    airlineId: 'emirates',
    airlineName: 'Emirates',
    airlineCode: 'EK',
    origin: { code: 'DXB', city: 'Dubai', country: 'Emiratos Arabes Unidos', coordinates: [55.3644, 25.2532] },
    destination: { code: 'LAX', city: 'Los Angeles', country: 'Estados Unidos', coordinates: [-118.4085, 33.9416] },
    frequency: 'Diario',
    aircraft: 'A380-800',
  },
  {
    id: 'ek-3',
    airlineId: 'emirates',
    airlineName: 'Emirates',
    airlineCode: 'EK',
    origin: { code: 'DXB', city: 'Dubai', country: 'Emiratos Arabes Unidos', coordinates: [55.3644, 25.2532] },
    destination: { code: 'HKG', city: 'Hong Kong', country: 'China', coordinates: [113.9153, 22.3080] },
    frequency: 'Diario',
    aircraft: 'B777-300ER',
  },
  // Qatar Airways routes
  {
    id: 'qr-1',
    airlineId: 'qatar-airways',
    airlineName: 'Qatar Airways',
    airlineCode: 'QR',
    origin: { code: 'DOH', city: 'Doha', country: 'Qatar', coordinates: [51.6082, 25.2611] },
    destination: { code: 'BCN', city: 'Barcelona', country: 'Espana', coordinates: [2.0785, 41.2974] },
    frequency: 'Diario',
    aircraft: 'A350-1000',
  },
  {
    id: 'qr-2',
    airlineId: 'qatar-airways',
    airlineName: 'Qatar Airways',
    airlineCode: 'QR',
    origin: { code: 'DOH', city: 'Doha', country: 'Qatar', coordinates: [51.6082, 25.2611] },
    destination: { code: 'CDG', city: 'Paris', country: 'Francia', coordinates: [2.5479, 49.0097] },
    frequency: 'Diario',
    aircraft: 'B787-9',
  },
  {
    id: 'qr-3',
    airlineId: 'qatar-airways',
    airlineName: 'Qatar Airways',
    airlineCode: 'QR',
    origin: { code: 'DOH', city: 'Doha', country: 'Qatar', coordinates: [51.6082, 25.2611] },
    destination: { code: 'SIN', city: 'Singapur', country: 'Singapur', coordinates: [103.9915, 1.3644] },
    frequency: 'Diario',
    aircraft: 'A380-800',
  },
  // Iberia routes
  {
    id: 'ib-1',
    airlineId: 'iberia',
    airlineName: 'Iberia',
    airlineCode: 'IB',
    origin: { code: 'MAD', city: 'Madrid', country: 'Espana', coordinates: [-3.5673, 40.4722] },
    destination: { code: 'MEX', city: 'Ciudad de Mexico', country: 'Mexico', coordinates: [-99.0721, 19.4363] },
    frequency: 'Diario',
    aircraft: 'A350-900',
  },
  {
    id: 'ib-2',
    airlineId: 'iberia',
    airlineName: 'Iberia',
    airlineCode: 'IB',
    origin: { code: 'MAD', city: 'Madrid', country: 'Espana', coordinates: [-3.5673, 40.4722] },
    destination: { code: 'EZE', city: 'Buenos Aires', country: 'Argentina', coordinates: [-58.5358, -34.8222] },
    frequency: '4x semana',
    aircraft: 'A350-900',
  },
  {
    id: 'ib-3',
    airlineId: 'iberia',
    airlineName: 'Iberia',
    airlineCode: 'IB',
    origin: { code: 'MAD', city: 'Madrid', country: 'Espana', coordinates: [-3.5673, 40.4722] },
    destination: { code: 'GRU', city: 'Sao Paulo', country: 'Brasil', coordinates: [-46.4729, -23.4356] },
    frequency: 'Diario',
    aircraft: 'A330-200',
  },
  // LATAM routes
  {
    id: 'la-1',
    airlineId: 'latam',
    airlineName: 'LATAM Airlines',
    airlineCode: 'LA',
    origin: { code: 'SCL', city: 'Santiago', country: 'Chile', coordinates: [-70.7858, -33.3930] },
    destination: { code: 'MAD', city: 'Madrid', country: 'Espana', coordinates: [-3.5673, 40.4722] },
    frequency: 'Diario',
    aircraft: 'B787-9',
  },
  {
    id: 'la-2',
    airlineId: 'latam',
    airlineName: 'LATAM Airlines',
    airlineCode: 'LA',
    origin: { code: 'SCL', city: 'Santiago', country: 'Chile', coordinates: [-70.7858, -33.3930] },
    destination: { code: 'MIA', city: 'Miami', country: 'Estados Unidos', coordinates: [-80.2906, 25.7959] },
    frequency: 'Diario',
    aircraft: 'B787-9',
  },
  {
    id: 'la-3',
    airlineId: 'latam',
    airlineName: 'LATAM Airlines',
    airlineCode: 'LA',
    origin: { code: 'GRU', city: 'Sao Paulo', country: 'Brasil', coordinates: [-46.4729, -23.4356] },
    destination: { code: 'CDG', city: 'Paris', country: 'Francia', coordinates: [2.5479, 49.0097] },
    frequency: 'Diario',
    aircraft: 'B777-300ER',
  },
  // Lufthansa routes
  {
    id: 'lh-1',
    airlineId: 'lufthansa',
    airlineName: 'Lufthansa',
    airlineCode: 'LH',
    origin: { code: 'FRA', city: 'Frankfurt', country: 'Alemania', coordinates: [8.5622, 50.0379] },
    destination: { code: 'JFK', city: 'Nueva York', country: 'Estados Unidos', coordinates: [-73.7781, 40.6413] },
    frequency: 'Diario',
    aircraft: 'A380-800',
  },
  {
    id: 'lh-2',
    airlineId: 'lufthansa',
    airlineName: 'Lufthansa',
    airlineCode: 'LH',
    origin: { code: 'FRA', city: 'Frankfurt', country: 'Alemania', coordinates: [8.5622, 50.0379] },
    destination: { code: 'HND', city: 'Tokio', country: 'Japon', coordinates: [139.7798, 35.5494] },
    frequency: 'Diario',
    aircraft: 'B747-8',
  },
  {
    id: 'lh-3',
    airlineId: 'lufthansa',
    airlineName: 'Lufthansa',
    airlineCode: 'LH',
    origin: { code: 'MUC', city: 'Munich', country: 'Alemania', coordinates: [11.7861, 48.3538] },
    destination: { code: 'SIN', city: 'Singapur', country: 'Singapur', coordinates: [103.9915, 1.3644] },
    frequency: 'Diario',
    aircraft: 'A350-900',
  },
]

export function getRoutesByAirline(airlineId: string): AirlineRoute[] {
  return airlineRoutes.filter((route) => route.airlineId === airlineId)
}

export function getAllHubCities(): { code: string; city: string; coordinates: [number, number] }[] {
  const hubs = new Map<string, { code: string; city: string; coordinates: [number, number] }>()
  
  airlineRoutes.forEach((route) => {
    if (!hubs.has(route.origin.code)) {
      hubs.set(route.origin.code, {
        code: route.origin.code,
        city: route.origin.city,
        coordinates: route.origin.coordinates,
      })
    }
    if (!hubs.has(route.destination.code)) {
      hubs.set(route.destination.code, {
        code: route.destination.code,
        city: route.destination.city,
        coordinates: route.destination.coordinates,
      })
    }
  })
  
  return Array.from(hubs.values())
}

export interface Flight {
  id: string
  airline: {
    code: string
    name: string
  }
  flightNumber: string
  origin: {
    code: string
    city: string
    airport: string
  }
  destination: {
    code: string
    city: string
    airport: string
  }
  departure: string
  arrival: string
  duration: string
  stops: number
  stopCities?: string[]
  price: number
  currency: string
  cabinClass: 'economy' | 'premium-economy' | 'business' | 'first'
  seatsAvailable: number
  features: {
    wifi: boolean
    entertainment: boolean
    meals: boolean
    usb: boolean
  }
  aircraft: string
  baggageIncluded: {
    cabin: string
    checked: string
  }
}

export interface Airport {
  code: string
  city: string
  country: string
  name: string
}

export const popularAirports: Airport[] = [
  { code: 'MAD', city: 'Madrid', country: 'Espana', name: 'Adolfo Suarez Madrid-Barajas' },
  { code: 'BCN', city: 'Barcelona', country: 'Espana', name: 'Josep Tarradellas Barcelona-El Prat' },
  { code: 'LHR', city: 'Londres', country: 'Reino Unido', name: 'London Heathrow' },
  { code: 'CDG', city: 'Paris', country: 'Francia', name: 'Charles de Gaulle' },
  { code: 'FCO', city: 'Roma', country: 'Italia', name: 'Leonardo da Vinci-Fiumicino' },
  { code: 'AMS', city: 'Amsterdam', country: 'Paises Bajos', name: 'Schiphol' },
  { code: 'FRA', city: 'Frankfurt', country: 'Alemania', name: 'Frankfurt Airport' },
  { code: 'JFK', city: 'Nueva York', country: 'Estados Unidos', name: 'John F. Kennedy' },
  { code: 'MIA', city: 'Miami', country: 'Estados Unidos', name: 'Miami International' },
  { code: 'LAX', city: 'Los Angeles', country: 'Estados Unidos', name: 'Los Angeles International' },
  { code: 'DXB', city: 'Dubai', country: 'Emiratos Arabes Unidos', name: 'Dubai International' },
  { code: 'SIN', city: 'Singapur', country: 'Singapur', name: 'Changi Airport' },
  { code: 'HND', city: 'Tokio', country: 'Japon', name: 'Haneda Airport' },
  { code: 'HKG', city: 'Hong Kong', country: 'China', name: 'Hong Kong International' },
  { code: 'SYD', city: 'Sydney', country: 'Australia', name: 'Kingsford Smith' },
  { code: 'MEX', city: 'Ciudad de Mexico', country: 'Mexico', name: 'Benito Juarez' },
  { code: 'GRU', city: 'Sao Paulo', country: 'Brasil', name: 'Guarulhos' },
  { code: 'EZE', city: 'Buenos Aires', country: 'Argentina', name: 'Ministro Pistarini' },
  { code: 'BOG', city: 'Bogota', country: 'Colombia', name: 'El Dorado' },
  { code: 'SCL', city: 'Santiago', country: 'Chile', name: 'Arturo Merino Benitez' },
]

// Generate sample flights based on search criteria
export function generateFlights(
  origin: string,
  destination: string,
  date: string,
  passengers: number = 1
): Flight[] {
  const airlines = [
    { code: 'IB', name: 'Iberia' },
    { code: 'VY', name: 'Vueling' },
    { code: 'FR', name: 'Ryanair' },
    { code: 'U2', name: 'easyJet' },
    { code: 'LH', name: 'Lufthansa' },
    { code: 'AF', name: 'Air France' },
    { code: 'BA', name: 'British Airways' },
    { code: 'EK', name: 'Emirates' },
  ]

  const originAirport = popularAirports.find((a) => a.code === origin) || {
    code: origin,
    city: origin,
    airport: origin,
  }
  const destAirport = popularAirports.find((a) => a.code === destination) || {
    code: destination,
    city: destination,
    airport: destination,
  }

  const flights: Flight[] = []

  // Generate 6-10 flights
  const numFlights = Math.floor(Math.random() * 5) + 6

  for (let i = 0; i < numFlights; i++) {
    const airline = airlines[Math.floor(Math.random() * airlines.length)]
    const departureHour = 6 + Math.floor(Math.random() * 16)
    const durationHours = 1 + Math.floor(Math.random() * 10)
    const durationMinutes = Math.floor(Math.random() * 60)
    const stops = Math.random() > 0.6 ? 0 : Math.random() > 0.5 ? 1 : 2
    const basePrice = 50 + Math.floor(Math.random() * 500)

    const arrivalHour = (departureHour + durationHours) % 24
    const arrivalMinutes = durationMinutes

    flights.push({
      id: `${airline.code}${1000 + Math.floor(Math.random() * 9000)}`,
      airline,
      flightNumber: `${airline.code}${1000 + Math.floor(Math.random() * 9000)}`,
      origin: {
        code: originAirport.code,
        city: originAirport.city,
        airport: 'name' in originAirport ? originAirport.name : originAirport.airport,
      },
      destination: {
        code: destAirport.code,
        city: destAirport.city,
        airport: 'name' in destAirport ? destAirport.name : destAirport.airport,
      },
      departure: `${String(departureHour).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      arrival: `${String(arrivalHour).padStart(2, '0')}:${String(arrivalMinutes).padStart(2, '0')}`,
      duration: `${durationHours}h ${durationMinutes}m`,
      stops,
      stopCities: stops > 0 ? ['Frankfurt', 'Paris', 'Amsterdam'].slice(0, stops) : undefined,
      price: basePrice * passengers,
      currency: 'EUR',
      cabinClass: 'economy',
      seatsAvailable: Math.floor(Math.random() * 20) + 1,
      features: {
        wifi: Math.random() > 0.5,
        entertainment: Math.random() > 0.4,
        meals: Math.random() > 0.5,
        usb: Math.random() > 0.3,
      },
      aircraft: ['A320', 'A321', 'B737', 'A350', 'B787'][Math.floor(Math.random() * 5)],
      baggageIncluded: {
        cabin: '10 kg',
        checked: Math.random() > 0.5 ? '23 kg' : 'No incluido',
      },
    })
  }

  // Sort by price
  return flights.sort((a, b) => a.price - b.price)
}

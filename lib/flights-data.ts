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
  // Europa
  { code: 'MAD', city: 'Madrid', country: 'Espana', name: 'Adolfo Suarez Madrid-Barajas' },
  { code: 'BCN', city: 'Barcelona', country: 'Espana', name: 'Josep Tarradellas Barcelona-El Prat' },
  { code: 'LHR', city: 'Londres', country: 'Reino Unido', name: 'London Heathrow' },
  { code: 'LGW', city: 'Londres', country: 'Reino Unido', name: 'London Gatwick' },
  { code: 'CDG', city: 'Paris', country: 'Francia', name: 'Charles de Gaulle' },
  { code: 'ORY', city: 'Paris', country: 'Francia', name: 'Paris Orly' },
  { code: 'FCO', city: 'Roma', country: 'Italia', name: 'Leonardo da Vinci-Fiumicino' },
  { code: 'MXP', city: 'Milan', country: 'Italia', name: 'Milano Malpensa' },
  { code: 'AMS', city: 'Amsterdam', country: 'Paises Bajos', name: 'Schiphol' },
  { code: 'FRA', city: 'Frankfurt', country: 'Alemania', name: 'Frankfurt Airport' },
  { code: 'MUC', city: 'Munich', country: 'Alemania', name: 'Franz Josef Strauss' },
  { code: 'ZRH', city: 'Zurich', country: 'Suiza', name: 'Zurich Airport' },
  { code: 'VIE', city: 'Viena', country: 'Austria', name: 'Vienna International' },
  { code: 'CPH', city: 'Copenhague', country: 'Dinamarca', name: 'Copenhagen Airport' },
  { code: 'OSL', city: 'Oslo', country: 'Noruega', name: 'Oslo Gardermoen' },
  { code: 'ARN', city: 'Estocolmo', country: 'Suecia', name: 'Stockholm Arlanda' },
  { code: 'HEL', city: 'Helsinki', country: 'Finlandia', name: 'Helsinki-Vantaa' },
  { code: 'DUB', city: 'Dublin', country: 'Irlanda', name: 'Dublin Airport' },
  { code: 'LIS', city: 'Lisboa', country: 'Portugal', name: 'Humberto Delgado' },
  { code: 'ATH', city: 'Atenas', country: 'Grecia', name: 'Eleftherios Venizelos' },
  { code: 'IST', city: 'Estambul', country: 'Turquia', name: 'Istanbul Airport' },
  { code: 'WAW', city: 'Varsovia', country: 'Polonia', name: 'Warsaw Chopin' },
  { code: 'PRG', city: 'Praga', country: 'Republica Checa', name: 'Vaclav Havel' },
  { code: 'BRU', city: 'Bruselas', country: 'Belgica', name: 'Brussels Airport' },
  
  // Norteamerica
  { code: 'JFK', city: 'Nueva York', country: 'Estados Unidos', name: 'John F. Kennedy' },
  { code: 'EWR', city: 'Newark', country: 'Estados Unidos', name: 'Newark Liberty' },
  { code: 'LGA', city: 'Nueva York', country: 'Estados Unidos', name: 'LaGuardia' },
  { code: 'LAX', city: 'Los Angeles', country: 'Estados Unidos', name: 'Los Angeles International' },
  { code: 'SFO', city: 'San Francisco', country: 'Estados Unidos', name: 'San Francisco International' },
  { code: 'ORD', city: 'Chicago', country: 'Estados Unidos', name: 'O Hare International' },
  { code: 'MIA', city: 'Miami', country: 'Estados Unidos', name: 'Miami International' },
  { code: 'ATL', city: 'Atlanta', country: 'Estados Unidos', name: 'Hartsfield-Jackson' },
  { code: 'DFW', city: 'Dallas', country: 'Estados Unidos', name: 'Dallas Fort Worth' },
  { code: 'DEN', city: 'Denver', country: 'Estados Unidos', name: 'Denver International' },
  { code: 'SEA', city: 'Seattle', country: 'Estados Unidos', name: 'Seattle-Tacoma' },
  { code: 'BOS', city: 'Boston', country: 'Estados Unidos', name: 'Logan International' },
  { code: 'LAS', city: 'Las Vegas', country: 'Estados Unidos', name: 'Harry Reid International' },
  { code: 'PHX', city: 'Phoenix', country: 'Estados Unidos', name: 'Phoenix Sky Harbor' },
  { code: 'IAH', city: 'Houston', country: 'Estados Unidos', name: 'George Bush Intercontinental' },
  { code: 'YYZ', city: 'Toronto', country: 'Canada', name: 'Toronto Pearson' },
  { code: 'YVR', city: 'Vancouver', country: 'Canada', name: 'Vancouver International' },
  { code: 'YUL', city: 'Montreal', country: 'Canada', name: 'Montreal-Trudeau' },
  { code: 'MEX', city: 'Ciudad de Mexico', country: 'Mexico', name: 'Benito Juarez' },
  { code: 'CUN', city: 'Cancun', country: 'Mexico', name: 'Cancun International' },
  { code: 'GDL', city: 'Guadalajara', country: 'Mexico', name: 'Miguel Hidalgo' },
  
  // Centroamerica y Caribe
  { code: 'PTY', city: 'Panama', country: 'Panama', name: 'Tocumen International' },
  { code: 'SJO', city: 'San Jose', country: 'Costa Rica', name: 'Juan Santamaria' },
  { code: 'SAL', city: 'San Salvador', country: 'El Salvador', name: 'Oscar Arnulfo Romero' },
  { code: 'GUA', city: 'Guatemala', country: 'Guatemala', name: 'La Aurora' },
  { code: 'TGU', city: 'Tegucigalpa', country: 'Honduras', name: 'Toncontin' },
  { code: 'MGA', city: 'Managua', country: 'Nicaragua', name: 'Augusto C. Sandino' },
  { code: 'HAV', city: 'La Habana', country: 'Cuba', name: 'Jose Marti' },
  { code: 'SDQ', city: 'Santo Domingo', country: 'Republica Dominicana', name: 'Las Americas' },
  { code: 'SJU', city: 'San Juan', country: 'Puerto Rico', name: 'Luis Munoz Marin' },
  { code: 'MBJ', city: 'Montego Bay', country: 'Jamaica', name: 'Sangster International' },
  
  // Sudamerica
  { code: 'GRU', city: 'Sao Paulo', country: 'Brasil', name: 'Guarulhos' },
  { code: 'GIG', city: 'Rio de Janeiro', country: 'Brasil', name: 'Galeao' },
  { code: 'BSB', city: 'Brasilia', country: 'Brasil', name: 'Presidente Juscelino Kubitschek' },
  { code: 'EZE', city: 'Buenos Aires', country: 'Argentina', name: 'Ministro Pistarini' },
  { code: 'AEP', city: 'Buenos Aires', country: 'Argentina', name: 'Jorge Newbery' },
  { code: 'SCL', city: 'Santiago', country: 'Chile', name: 'Arturo Merino Benitez' },
  { code: 'BOG', city: 'Bogota', country: 'Colombia', name: 'El Dorado' },
  { code: 'MDE', city: 'Medellin', country: 'Colombia', name: 'Jose Maria Cordova' },
  { code: 'LIM', city: 'Lima', country: 'Peru', name: 'Jorge Chavez' },
  { code: 'UIO', city: 'Quito', country: 'Ecuador', name: 'Mariscal Sucre' },
  { code: 'GYE', city: 'Guayaquil', country: 'Ecuador', name: 'Jose Joaquin de Olmedo' },
  { code: 'CCS', city: 'Caracas', country: 'Venezuela', name: 'Simon Bolivar' },
  { code: 'MVD', city: 'Montevideo', country: 'Uruguay', name: 'Carrasco' },
  { code: 'ASU', city: 'Asuncion', country: 'Paraguay', name: 'Silvio Pettirossi' },
  { code: 'LPB', city: 'La Paz', country: 'Bolivia', name: 'El Alto' },
  { code: 'VVI', city: 'Santa Cruz', country: 'Bolivia', name: 'Viru Viru' },
  
  // Asia
  { code: 'DXB', city: 'Dubai', country: 'Emiratos Arabes Unidos', name: 'Dubai International' },
  { code: 'AUH', city: 'Abu Dhabi', country: 'Emiratos Arabes Unidos', name: 'Abu Dhabi International' },
  { code: 'DOH', city: 'Doha', country: 'Qatar', name: 'Hamad International' },
  { code: 'SIN', city: 'Singapur', country: 'Singapur', name: 'Changi Airport' },
  { code: 'HKG', city: 'Hong Kong', country: 'China', name: 'Hong Kong International' },
  { code: 'PEK', city: 'Beijing', country: 'China', name: 'Beijing Capital' },
  { code: 'PKX', city: 'Beijing', country: 'China', name: 'Beijing Daxing' },
  { code: 'PVG', city: 'Shanghai', country: 'China', name: 'Shanghai Pudong' },
  { code: 'CAN', city: 'Guangzhou', country: 'China', name: 'Baiyun International' },
  { code: 'HND', city: 'Tokio', country: 'Japon', name: 'Haneda Airport' },
  { code: 'NRT', city: 'Tokio', country: 'Japon', name: 'Narita International' },
  { code: 'KIX', city: 'Osaka', country: 'Japon', name: 'Kansai International' },
  { code: 'ICN', city: 'Seoul', country: 'Corea del Sur', name: 'Incheon International' },
  { code: 'BKK', city: 'Bangkok', country: 'Tailandia', name: 'Suvarnabhumi' },
  { code: 'KUL', city: 'Kuala Lumpur', country: 'Malasia', name: 'Kuala Lumpur International' },
  { code: 'CGK', city: 'Yakarta', country: 'Indonesia', name: 'Soekarno-Hatta' },
  { code: 'DPS', city: 'Bali', country: 'Indonesia', name: 'Ngurah Rai' },
  { code: 'MNL', city: 'Manila', country: 'Filipinas', name: 'Ninoy Aquino' },
  { code: 'SGN', city: 'Ho Chi Minh', country: 'Vietnam', name: 'Tan Son Nhat' },
  { code: 'HAN', city: 'Hanoi', country: 'Vietnam', name: 'Noi Bai' },
  { code: 'DEL', city: 'Nueva Delhi', country: 'India', name: 'Indira Gandhi' },
  { code: 'BOM', city: 'Mumbai', country: 'India', name: 'Chhatrapati Shivaji' },
  { code: 'BLR', city: 'Bangalore', country: 'India', name: 'Kempegowda' },
  { code: 'CMB', city: 'Colombo', country: 'Sri Lanka', name: 'Bandaranaike' },
  { code: 'DAC', city: 'Dhaka', country: 'Bangladesh', name: 'Hazrat Shahjalal' },
  { code: 'KTM', city: 'Katmandu', country: 'Nepal', name: 'Tribhuvan' },
  { code: 'TLV', city: 'Tel Aviv', country: 'Israel', name: 'Ben Gurion' },
  { code: 'AMM', city: 'Amman', country: 'Jordania', name: 'Queen Alia' },
  { code: 'RUH', city: 'Riyadh', country: 'Arabia Saudita', name: 'King Khalid' },
  { code: 'JED', city: 'Jeddah', country: 'Arabia Saudita', name: 'King Abdulaziz' },
  
  // Africa
  { code: 'JNB', city: 'Johannesburgo', country: 'Sudafrica', name: 'O.R. Tambo' },
  { code: 'CPT', city: 'Ciudad del Cabo', country: 'Sudafrica', name: 'Cape Town International' },
  { code: 'CAI', city: 'El Cairo', country: 'Egipto', name: 'Cairo International' },
  { code: 'CMN', city: 'Casablanca', country: 'Marruecos', name: 'Mohammed V' },
  { code: 'RAK', city: 'Marrakech', country: 'Marruecos', name: 'Menara' },
  { code: 'ALG', city: 'Argel', country: 'Argelia', name: 'Houari Boumediene' },
  { code: 'TUN', city: 'Tunez', country: 'Tunez', name: 'Tunis-Carthage' },
  { code: 'NBO', city: 'Nairobi', country: 'Kenia', name: 'Jomo Kenyatta' },
  { code: 'ADD', city: 'Addis Abeba', country: 'Etiopia', name: 'Bole International' },
  { code: 'LOS', city: 'Lagos', country: 'Nigeria', name: 'Murtala Muhammed' },
  { code: 'ACC', city: 'Accra', country: 'Ghana', name: 'Kotoka International' },
  { code: 'DAR', city: 'Dar es Salaam', country: 'Tanzania', name: 'Julius Nyerere' },
  { code: 'MRU', city: 'Mauricio', country: 'Mauricio', name: 'Sir Seewoosagur Ramgoolam' },
  
  // Oceania
  { code: 'SYD', city: 'Sydney', country: 'Australia', name: 'Kingsford Smith' },
  { code: 'MEL', city: 'Melbourne', country: 'Australia', name: 'Tullamarine' },
  { code: 'BNE', city: 'Brisbane', country: 'Australia', name: 'Brisbane Airport' },
  { code: 'PER', city: 'Perth', country: 'Australia', name: 'Perth Airport' },
  { code: 'AKL', city: 'Auckland', country: 'Nueva Zelanda', name: 'Auckland Airport' },
  { code: 'WLG', city: 'Wellington', country: 'Nueva Zelanda', name: 'Wellington Airport' },
  { code: 'CHC', city: 'Christchurch', country: 'Nueva Zelanda', name: 'Christchurch Airport' },
  { code: 'NAN', city: 'Nadi', country: 'Fiyi', name: 'Nadi International' },
  { code: 'PPT', city: 'Papeete', country: 'Polinesia Francesa', name: 'Faa a International' },
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

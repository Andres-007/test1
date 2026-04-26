'use server'

// Flight tracking with simulated real-time data
// In production, you would use AviationStack, FlightAware, or similar APIs

export interface FlightStatus {
  flightNumber: string
  airline: string
  airlineLogo: string
  status: 'scheduled' | 'boarding' | 'departed' | 'in-flight' | 'landed' | 'arrived' | 'delayed' | 'cancelled'
  statusColor: string
  departure: {
    airport: string
    city: string
    terminal: string
    gate: string
    scheduledTime: string
    actualTime: string | null
    delay: number // minutes
  }
  arrival: {
    airport: string
    city: string
    terminal: string
    gate: string
    scheduledTime: string
    estimatedTime: string
    actualTime: string | null
  }
  aircraft: {
    model: string
    registration: string
  }
  progress: number // 0-100
  altitude: number | null // feet
  speed: number | null // km/h
  position: {
    lat: number
    lng: number
  } | null
}

const airlines: Record<string, { name: string; logo: string }> = {
  'IB': { name: 'Iberia', logo: 'https://images.kiwi.com/airlines/64/IB.png' },
  'AA': { name: 'American Airlines', logo: 'https://images.kiwi.com/airlines/64/AA.png' },
  'UA': { name: 'United Airlines', logo: 'https://images.kiwi.com/airlines/64/UA.png' },
  'DL': { name: 'Delta Air Lines', logo: 'https://images.kiwi.com/airlines/64/DL.png' },
  'BA': { name: 'British Airways', logo: 'https://images.kiwi.com/airlines/64/BA.png' },
  'LH': { name: 'Lufthansa', logo: 'https://images.kiwi.com/airlines/64/LH.png' },
  'AF': { name: 'Air France', logo: 'https://images.kiwi.com/airlines/64/AF.png' },
  'EK': { name: 'Emirates', logo: 'https://images.kiwi.com/airlines/64/EK.png' },
  'QR': { name: 'Qatar Airways', logo: 'https://images.kiwi.com/airlines/64/QR.png' },
  'SQ': { name: 'Singapore Airlines', logo: 'https://images.kiwi.com/airlines/64/SQ.png' },
}

const airports: Record<string, { city: string; name: string }> = {
  'MAD': { city: 'Madrid', name: 'Adolfo Suarez Madrid-Barajas' },
  'BCN': { city: 'Barcelona', name: 'El Prat' },
  'JFK': { city: 'New York', name: 'John F. Kennedy' },
  'LAX': { city: 'Los Angeles', name: 'Los Angeles International' },
  'LHR': { city: 'London', name: 'Heathrow' },
  'CDG': { city: 'Paris', name: 'Charles de Gaulle' },
  'FRA': { city: 'Frankfurt', name: 'Frankfurt Airport' },
  'DXB': { city: 'Dubai', name: 'Dubai International' },
  'SIN': { city: 'Singapore', name: 'Changi' },
  'NRT': { city: 'Tokyo', name: 'Narita' },
  'MIA': { city: 'Miami', name: 'Miami International' },
  'ORD': { city: 'Chicago', name: "O'Hare International" },
}

function getStatusColor(status: FlightStatus['status']): string {
  switch (status) {
    case 'scheduled': return 'text-muted-foreground'
    case 'boarding': return 'text-blue-500'
    case 'departed': return 'text-green-500'
    case 'in-flight': return 'text-green-500'
    case 'landed': return 'text-green-500'
    case 'arrived': return 'text-green-500'
    case 'delayed': return 'text-amber-500'
    case 'cancelled': return 'text-red-500'
    default: return 'text-muted-foreground'
  }
}

function generateFlightStatus(flightNumber: string): FlightStatus {
  // Parse airline code from flight number
  const airlineCode = flightNumber.substring(0, 2).toUpperCase()
  const airline = airlines[airlineCode] || { name: 'Unknown Airline', logo: '' }
  
  // Generate random but consistent flight data based on flight number
  const hash = flightNumber.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
  
  const airportCodes = Object.keys(airports)
  const depIndex = hash % airportCodes.length
  const arrIndex = (hash + 3) % airportCodes.length
  const depCode = airportCodes[depIndex]
  const arrCode = airportCodes[arrIndex === depIndex ? (arrIndex + 1) % airportCodes.length : arrIndex]
  
  const depAirport = airports[depCode]
  const arrAirport = airports[arrCode]
  
  // Simulate different flight statuses
  const statuses: FlightStatus['status'][] = ['scheduled', 'boarding', 'departed', 'in-flight', 'in-flight', 'in-flight', 'landed', 'arrived', 'delayed']
  const status = statuses[hash % statuses.length]
  
  const now = new Date()
  const scheduledDep = new Date(now.getTime() - (hash % 8) * 60 * 60 * 1000)
  const scheduledArr = new Date(scheduledDep.getTime() + (4 + (hash % 12)) * 60 * 60 * 1000)
  
  const delay = status === 'delayed' ? 15 + (hash % 120) : 0
  const progress = status === 'in-flight' ? 20 + (hash % 60) : 
                   status === 'arrived' || status === 'landed' ? 100 : 
                   status === 'departed' ? 10 : 0
  
  return {
    flightNumber: flightNumber.toUpperCase(),
    airline: airline.name,
    airlineLogo: airline.logo,
    status,
    statusColor: getStatusColor(status),
    departure: {
      airport: depCode,
      city: depAirport.city,
      terminal: `T${1 + (hash % 4)}`,
      gate: `${String.fromCharCode(65 + (hash % 6))}${10 + (hash % 30)}`,
      scheduledTime: scheduledDep.toISOString(),
      actualTime: status !== 'scheduled' ? new Date(scheduledDep.getTime() + delay * 60 * 1000).toISOString() : null,
      delay,
    },
    arrival: {
      airport: arrCode,
      city: arrAirport.city,
      terminal: `T${1 + ((hash + 2) % 3)}`,
      gate: status === 'arrived' ? `${String.fromCharCode(65 + ((hash + 1) % 6))}${5 + (hash % 20)}` : 'TBD',
      scheduledTime: scheduledArr.toISOString(),
      estimatedTime: new Date(scheduledArr.getTime() + delay * 60 * 1000).toISOString(),
      actualTime: status === 'arrived' ? new Date(scheduledArr.getTime() + delay * 60 * 1000).toISOString() : null,
    },
    aircraft: {
      model: ['Boeing 787-9', 'Airbus A350-900', 'Boeing 777-300ER', 'Airbus A320neo'][hash % 4],
      registration: `${airlineCode}-${String.fromCharCode(65 + (hash % 26))}${String.fromCharCode(65 + ((hash + 5) % 26))}${String.fromCharCode(65 + ((hash + 10) % 26))}`,
    },
    progress,
    altitude: status === 'in-flight' ? 35000 + (hash % 6000) : null,
    speed: status === 'in-flight' ? 800 + (hash % 150) : null,
    position: status === 'in-flight' ? {
      lat: 40 + (hash % 20) - 10,
      lng: -40 + (hash % 80) - 40,
    } : null,
  }
}

export async function trackFlight(flightNumber: string): Promise<FlightStatus | null> {
  if (!flightNumber || flightNumber.length < 3) {
    return null
  }
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return generateFlightStatus(flightNumber)
}

export async function getRecentFlights(): Promise<FlightStatus[]> {
  const sampleFlights = ['IB3456', 'AA100', 'BA178', 'LH400', 'EK201']
  return Promise.all(sampleFlights.map(fn => generateFlightStatus(fn)))
}

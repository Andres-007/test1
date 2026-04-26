'use server'

import { searchFlights as kiwiSearchFlights, formatDuration, type KiwiFlight } from './kiwi-api'
import { searchFlights as amadeusSearchFlights, type FlightOffer } from './amadeus-service'
import type { Flight, Airline } from './types'

// Check which API is available
export async function getAvailableFlightAPI(): Promise<'kiwi' | 'amadeus' | 'mock'> {
  if (process.env.KIWI_API_KEY) {
    return 'kiwi'
  }
  if (process.env.AMADEUS_API_KEY && process.env.AMADEUS_API_SECRET) {
    return 'amadeus'
  }
  return 'mock'
}

// Airline code to name mapping
const airlineNames: Record<string, string> = {
  'AA': 'American Airlines',
  'UA': 'United Airlines',
  'DL': 'Delta Air Lines',
  'WN': 'Southwest Airlines',
  'B6': 'JetBlue',
  'AS': 'Alaska Airlines',
  'NK': 'Spirit Airlines',
  'F9': 'Frontier Airlines',
  'IB': 'Iberia',
  'VY': 'Vueling',
  'FR': 'Ryanair',
  'U2': 'easyJet',
  'LH': 'Lufthansa',
  'AF': 'Air France',
  'BA': 'British Airways',
  'EK': 'Emirates',
  'QR': 'Qatar Airways',
  'TK': 'Turkish Airlines',
  'AM': 'Aeromexico',
  'AV': 'Avianca',
  'CM': 'Copa Airlines',
  'LA': 'LATAM Airlines',
  'Y4': 'Volaris',
  'AC': 'Air Canada',
  'KL': 'KLM',
  'SQ': 'Singapore Airlines',
  'CX': 'Cathay Pacific',
  'QF': 'Qantas',
  'NZ': 'Air New Zealand',
  'ET': 'Ethiopian Airlines',
  'SA': 'South African Airways',
}

function getAirlineName(code: string): string {
  return airlineNames[code] || code
}

// Convert Kiwi flight to our Flight type
function kiwiToFlight(kiwiFlight: KiwiFlight, index: number): Flight {
  const firstRoute = kiwiFlight.route[0]
  const lastRoute = kiwiFlight.route[kiwiFlight.route.length - 1]
  
  const airline: Airline = {
    id: firstRoute.airline,
    name: getAirlineName(firstRoute.airline),
    logo: firstRoute.airline,
    rating: 4.0 + Math.random() * 0.8, // Placeholder rating
  }

  return {
    id: kiwiFlight.id || `kiwi-${index}`,
    airline,
    origin: kiwiFlight.cityFrom,
    originCode: kiwiFlight.flyFrom,
    destination: kiwiFlight.cityTo,
    destinationCode: kiwiFlight.flyTo,
    departureTime: new Date(kiwiFlight.local_departure).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    arrivalTime: new Date(kiwiFlight.local_arrival).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    duration: formatDuration(kiwiFlight.duration.departure / 60),
    price: Math.round(kiwiFlight.price),
    stops: kiwiFlight.route.length - 1,
    class: 'economy',
    // Extra data for real flights
    deepLink: kiwiFlight.deep_link,
    bookingToken: kiwiFlight.booking_token,
    isReal: true,
  } as Flight & { deepLink?: string; bookingToken?: string; isReal?: boolean }
}

// Convert Amadeus flight to our Flight type
function amadeusToFlight(offer: FlightOffer, index: number): Flight {
  const itinerary = offer.itineraries[0]
  const firstSegment = itinerary.segments[0]
  const lastSegment = itinerary.segments[itinerary.segments.length - 1]
  
  const airline: Airline = {
    id: firstSegment.carrierCode,
    name: getAirlineName(firstSegment.carrierCode),
    logo: firstSegment.carrierCode,
    rating: 4.0 + Math.random() * 0.8,
  }

  // Parse duration from ISO 8601
  const durationMatch = itinerary.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
  const hours = durationMatch?.[1] ? parseInt(durationMatch[1]) : 0
  const minutes = durationMatch?.[2] ? parseInt(durationMatch[2]) : 0
  const durationStr = `${hours}h ${minutes}m`

  return {
    id: offer.id || `amadeus-${index}`,
    airline,
    origin: firstSegment.departure.iataCode,
    originCode: firstSegment.departure.iataCode,
    destination: lastSegment.arrival.iataCode,
    destinationCode: lastSegment.arrival.iataCode,
    departureTime: new Date(firstSegment.departure.at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    arrivalTime: new Date(lastSegment.arrival.at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    duration: durationStr,
    price: Math.round(parseFloat(offer.price.total)),
    stops: itinerary.segments.length - 1,
    class: 'economy',
    isReal: true,
  } as Flight & { isReal?: boolean }
}

// Format date for APIs (DD/MM/YYYY for Kiwi, YYYY-MM-DD for Amadeus)
function formatDateForKiwi(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

function formatDateForAmadeus(date: Date): string {
  return date.toISOString().split('T')[0]
}

export interface FlightSearchResult {
  flights: Flight[]
  isReal: boolean
  source: 'kiwi' | 'amadeus' | 'mock'
  error?: string
}

// Main search function that tries real APIs first
export async function searchRealFlights(
  originCode: string,
  destinationCode: string,
  departureDate?: Date,
): Promise<FlightSearchResult> {
  const date = departureDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Default to 7 days from now
  
  // Try Kiwi first (generally better free tier)
  if (process.env.KIWI_API_KEY) {
    try {
      const dateStr = formatDateForKiwi(date)
      const response = await kiwiSearchFlights({
        flyFrom: originCode.toUpperCase(),
        flyTo: destinationCode.toUpperCase(),
        dateFrom: dateStr,
        dateTo: dateStr,
        adults: 1,
        currency: 'USD',
        limit: 15,
      })
      
      if (response.data && response.data.length > 0) {
        const flights = response.data.map((f, i) => kiwiToFlight(f, i))
        return {
          flights: flights.sort((a, b) => a.price - b.price),
          isReal: true,
          source: 'kiwi',
        }
      }
    } catch (error) {
      console.error('[Kiwi API Error]', error)
    }
  }
  
  // Try Amadeus as fallback
  if (process.env.AMADEUS_API_KEY && process.env.AMADEUS_API_SECRET) {
    try {
      const dateStr = formatDateForAmadeus(date)
      const { data, isLive } = await amadeusSearchFlights(
        originCode.toUpperCase(),
        destinationCode.toUpperCase(),
        dateStr,
      )
      
      if (data && data.length > 0) {
        const flights = data.map((f, i) => amadeusToFlight(f, i))
        return {
          flights: flights.sort((a, b) => a.price - b.price),
          isReal: isLive,
          source: 'amadeus',
        }
      }
    } catch (error) {
      console.error('[Amadeus API Error]', error)
    }
  }
  
  // Return empty with mock indicator
  return {
    flights: [],
    isReal: false,
    source: 'mock',
    error: 'NO_API_CONFIGURED',
  }
}

// Check if any flight API is configured
export function isFlightAPIConfigured(): boolean {
  return !!(process.env.KIWI_API_KEY || (process.env.AMADEUS_API_KEY && process.env.AMADEUS_API_SECRET))
}

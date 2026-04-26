'use server'

import { searchRealFlights, isFlightAPIConfigured } from './flight-service'
import { generateFlights } from './mock-data'
import type { Flight } from './types'

export interface ChatFlightResult {
  flights: Flight[]
  isReal: boolean
  source: string
  message?: string
}

export async function searchFlightsForChat(
  originCode: string,
  destinationCode: string,
  originCity?: string,
  destinationCity?: string
): Promise<ChatFlightResult> {
  // Try real flight APIs first
  if (isFlightAPIConfigured()) {
    try {
      const result = await searchRealFlights(originCode, destinationCode)
      
      if (result.flights.length > 0) {
        return {
          flights: result.flights,
          isReal: result.isReal,
          source: result.source,
          message: result.isReal 
            ? `Datos de vuelos reales proporcionados por ${result.source === 'kiwi' ? 'Kiwi.com' : 'Amadeus'}`
            : undefined,
        }
      }
    } catch (error) {
      console.error('[Chat Flight Search Error]', error)
    }
  }
  
  // Fall back to mock data
  const mockFlights = generateFlights(
    originCity || originCode,
    destinationCity || destinationCode
  )
  
  return {
    flights: mockFlights,
    isReal: false,
    source: 'mock',
    message: 'Mostrando vuelos de ejemplo. Para ver vuelos reales, configura la API de vuelos.',
  }
}

export async function checkFlightAPIStatus(): Promise<{
  configured: boolean
  provider?: string
}> {
  if (process.env.KIWI_API_KEY) {
    return { configured: true, provider: 'Kiwi.com (Tequila)' }
  }
  if (process.env.AMADEUS_API_KEY && process.env.AMADEUS_API_SECRET) {
    return { configured: true, provider: 'Amadeus' }
  }
  return { configured: false }
}

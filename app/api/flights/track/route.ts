import { NextRequest, NextResponse } from 'next/server'
import { trackFlight, getRecentFlights } from '@/lib/flight-tracking-api'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const flightNumber = searchParams.get('flight')
  
  try {
    if (flightNumber) {
      const status = await trackFlight(flightNumber)
      
      if (!status) {
        return NextResponse.json(
          { error: 'Vuelo no encontrado' },
          { status: 404 }
        )
      }
      
      return NextResponse.json(status)
    } else {
      // Return sample flights
      const flights = await getRecentFlights()
      return NextResponse.json(flights)
    }
  } catch (error) {
    console.error('Error tracking flight:', error)
    return NextResponse.json(
      { error: 'Error al rastrear vuelo' },
      { status: 500 }
    )
  }
}

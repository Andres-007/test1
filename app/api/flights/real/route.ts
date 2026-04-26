import { NextRequest, NextResponse } from 'next/server'
import { searchRealFlights, isFlightAPIConfigured } from '@/lib/flight-service'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  
  const origin = searchParams.get('origin')
  const destination = searchParams.get('destination')
  const dateStr = searchParams.get('date')

  if (!origin || !destination) {
    return NextResponse.json(
      { error: 'Missing required parameters: origin, destination' },
      { status: 400 }
    )
  }

  // Check if API is configured
  if (!isFlightAPIConfigured()) {
    return NextResponse.json({
      flights: [],
      isReal: false,
      source: 'mock',
      error: 'NO_API_CONFIGURED',
      message: 'Para ver vuelos reales, configura KIWI_API_KEY o AMADEUS_API_KEY + AMADEUS_API_SECRET'
    })
  }

  try {
    const date = dateStr ? new Date(dateStr) : undefined
    const result = await searchRealFlights(origin, destination, date)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Real flight search error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to search flights',
        flights: [],
        isReal: false,
        source: 'mock'
      },
      { status: 500 }
    )
  }
}

// Also expose API status
export async function HEAD() {
  const configured = isFlightAPIConfigured()
  return new NextResponse(null, {
    status: configured ? 200 : 503,
    headers: {
      'X-API-Configured': configured ? 'true' : 'false',
    },
  })
}

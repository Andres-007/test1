import { NextRequest, NextResponse } from 'next/server'
import { searchFlights } from '@/lib/amadeus-service'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  
  const origin = searchParams.get('origin')
  const destination = searchParams.get('destination')
  const departureDate = searchParams.get('departureDate')
  const returnDate = searchParams.get('returnDate')
  const adults = parseInt(searchParams.get('adults') || '1')
  const travelClass = searchParams.get('travelClass') || 'ECONOMY'

  if (!origin || !destination || !departureDate) {
    return NextResponse.json(
      { error: 'Missing required parameters: origin, destination, departureDate' },
      { status: 400 }
    )
  }

  try {
    const result = await searchFlights(
      origin,
      destination,
      departureDate,
      returnDate || undefined,
      adults,
      travelClass
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('[API] Flight search error:', error)
    return NextResponse.json(
      { error: 'Failed to search flights' },
      { status: 500 }
    )
  }
}

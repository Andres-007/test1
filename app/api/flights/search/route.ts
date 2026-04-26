import { NextRequest, NextResponse } from 'next/server'
import { searchFlights } from '@/lib/kiwi-api'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  
  const flyFrom = searchParams.get('from')
  const flyTo = searchParams.get('to')
  const dateFrom = searchParams.get('dateFrom')
  const dateTo = searchParams.get('dateTo')
  const returnFrom = searchParams.get('returnFrom')
  const returnTo = searchParams.get('returnTo')
  const adults = searchParams.get('adults')
  const children = searchParams.get('children')
  const directOnly = searchParams.get('directOnly')
  const cabinClass = searchParams.get('cabinClass') as 'M' | 'W' | 'C' | 'F' | null

  if (!flyFrom || !flyTo || !dateFrom || !dateTo) {
    return NextResponse.json(
      { error: 'Missing required parameters: from, to, dateFrom, dateTo' },
      { status: 400 }
    )
  }

  try {
    const results = await searchFlights({
      flyFrom,
      flyTo,
      dateFrom,
      dateTo,
      returnFrom: returnFrom || undefined,
      returnTo: returnTo || undefined,
      adults: adults ? parseInt(adults) : 1,
      children: children ? parseInt(children) : 0,
      directOnly: directOnly === 'true',
      cabinClass: cabinClass || 'M',
      currency: 'USD',
      limit: 30,
    })

    return NextResponse.json(results)
  } catch (error) {
    console.error('Flight search error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to search flights' },
      { status: 500 }
    )
  }
}

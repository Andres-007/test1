import { NextRequest, NextResponse } from 'next/server'
import { searchLocations } from '@/lib/kiwi-api'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query')

  if (!query || query.length < 2) {
    return NextResponse.json({ locations: [] })
  }

  try {
    const locations = await searchLocations(query)
    return NextResponse.json({ locations })
  } catch (error) {
    console.error('Location search error:', error)
    return NextResponse.json(
      { error: 'Failed to search locations' },
      { status: 500 }
    )
  }
}

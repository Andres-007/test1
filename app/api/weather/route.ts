import { NextRequest, NextResponse } from 'next/server'
import { getWeatherByCity } from '@/lib/weather-api'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const city = searchParams.get('city')

  if (!city) {
    return NextResponse.json({ error: 'City is required' }, { status: 400 })
  }

  const weather = await getWeatherByCity(city)

  if (!weather) {
    return NextResponse.json({ error: 'Could not fetch weather data' }, { status: 500 })
  }

  return NextResponse.json(weather)
}

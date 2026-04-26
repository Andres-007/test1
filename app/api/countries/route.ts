import { NextRequest, NextResponse } from 'next/server'
import { getCountryByName, getCountryByCode, getAllCountries, getCountriesByRegion } from '@/lib/countries-api'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const name = searchParams.get('name')
  const code = searchParams.get('code')
  const region = searchParams.get('region')
  const all = searchParams.get('all')

  if (code) {
    const country = await getCountryByCode(code)
    if (!country) {
      return NextResponse.json({ error: 'Country not found' }, { status: 404 })
    }
    return NextResponse.json(country)
  }

  if (name) {
    const country = await getCountryByName(name)
    if (!country) {
      return NextResponse.json({ error: 'Country not found' }, { status: 404 })
    }
    return NextResponse.json(country)
  }

  if (region) {
    const countries = await getCountriesByRegion(region)
    return NextResponse.json(countries)
  }

  if (all === 'true') {
    const countries = await getAllCountries()
    return NextResponse.json(countries)
  }

  return NextResponse.json({ error: 'Please provide a name, code, region, or all=true parameter' }, { status: 400 })
}

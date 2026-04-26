const KIWI_API_URL = 'https://api.tequila.kiwi.com/v2'

interface KiwiSearchParams {
  flyFrom: string
  flyTo: string
  dateFrom: string
  dateTo: string
  returnFrom?: string
  returnTo?: string
  adults?: number
  children?: number
  infants?: number
  cabinClass?: 'M' | 'W' | 'C' | 'F' // Economy, Premium Economy, Business, First
  directOnly?: boolean
  currency?: string
  limit?: number
}

export interface KiwiFlight {
  id: string
  flyFrom: string
  flyTo: string
  cityFrom: string
  cityTo: string
  countryFrom: { code: string; name: string }
  countryTo: { code: string; name: string }
  price: number
  airlines: string[]
  route: Array<{
    id: string
    flyFrom: string
    flyTo: string
    cityFrom: string
    cityTo: string
    airline: string
    flight_no: number
    local_departure: string
    local_arrival: string
    utc_departure: string
    utc_arrival: string
  }>
  local_departure: string
  local_arrival: string
  utc_departure: string
  utc_arrival: string
  duration: {
    departure: number
    return: number
    total: number
  }
  distance: number
  bags_price: {
    '1': number
    '2': number
  }
  availability: {
    seats: number | null
  }
  deep_link: string
  booking_token: string
}

interface KiwiSearchResponse {
  search_id: string
  data: KiwiFlight[]
  currency: string
}

export async function searchFlights(params: KiwiSearchParams): Promise<KiwiSearchResponse> {
  const apiKey = process.env.KIWI_API_KEY

  if (!apiKey) {
    throw new Error('KIWI_API_KEY is not configured')
  }

  const searchParams = new URLSearchParams({
    fly_from: params.flyFrom,
    fly_to: params.flyTo,
    date_from: params.dateFrom,
    date_to: params.dateTo,
    adults: String(params.adults || 1),
    children: String(params.children || 0),
    infants: String(params.infants || 0),
    curr: params.currency || 'USD',
    limit: String(params.limit || 20),
    sort: 'price',
  })

  if (params.returnFrom) {
    searchParams.set('return_from', params.returnFrom)
  }
  if (params.returnTo) {
    searchParams.set('return_to', params.returnTo)
  }
  if (params.cabinClass) {
    searchParams.set('selected_cabins', params.cabinClass)
  }
  if (params.directOnly) {
    searchParams.set('max_stopovers', '0')
  }

  const response = await fetch(`${KIWI_API_URL}/search?${searchParams.toString()}`, {
    headers: {
      'apikey': apiKey,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Kiwi API error: ${response.status} - ${error}`)
  }

  return response.json()
}

export interface KiwiLocation {
  id: string
  name: string
  code: string
  city: { id: string; name: string; code: string }
  country: { id: string; name: string; code: string }
  type: string
}

export async function searchLocations(query: string): Promise<KiwiLocation[]> {
  const apiKey = process.env.KIWI_API_KEY

  if (!apiKey) {
    throw new Error('KIWI_API_KEY is not configured')
  }

  const response = await fetch(
    `${KIWI_API_URL}/locations/query?term=${encodeURIComponent(query)}&location_types=airport&limit=10`,
    {
      headers: {
        'apikey': apiKey,
      },
    }
  )

  if (!response.ok) {
    throw new Error(`Kiwi API error: ${response.status}`)
  }

  const data = await response.json()
  return data.locations || []
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

export function formatDateTime(dateString: string): { date: string; time: string } {
  const date = new Date(dateString)
  return {
    date: date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
    time: date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
  }
}

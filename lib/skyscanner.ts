'use server'

const SKYSCANNER_API_KEY = process.env.SKYSCANNER_API_KEY
const BASE_URL = 'https://partners.api.skyscanner.net/apiservices/v3'

interface FlightQuery {
  originSkyId: string
  destinationSkyId: string
  originEntityId: string
  destinationEntityId: string
  date: string
  returnDate?: string
  cabinClass?: 'CABIN_CLASS_ECONOMY' | 'CABIN_CLASS_PREMIUM_ECONOMY' | 'CABIN_CLASS_BUSINESS' | 'CABIN_CLASS_FIRST'
  adults?: number
  children?: number
  infants?: number
}

interface Place {
  entityId: string
  skyId: string
  name: string
  type: string
  iata?: string
  country?: string
  city?: string
}

interface FlightLeg {
  id: string
  origin: {
    name: string
    displayCode: string
    city: string
    country: string
  }
  destination: {
    name: string
    displayCode: string
    city: string
    country: string
  }
  departure: string
  arrival: string
  duration: number
  carriers: {
    name: string
    logoUrl: string
  }[]
  stopCount: number
}

interface FlightItinerary {
  id: string
  price: {
    raw: number
    formatted: string
  }
  legs: FlightLeg[]
  score: number
  deepLink: string
}

export interface SearchFlightsResult {
  itineraries: FlightItinerary[]
  status: string
  sessionToken?: string
}

// Buscar lugares/aeropuertos por nombre
export async function searchPlaces(query: string): Promise<Place[]> {
  if (!SKYSCANNER_API_KEY) {
    throw new Error('SKYSCANNER_API_KEY no configurada')
  }

  try {
    const response = await fetch(`${BASE_URL}/autosuggest/flights`, {
      method: 'POST',
      headers: {
        'x-api-key': SKYSCANNER_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: {
          market: 'ES',
          locale: 'es-ES',
          searchTerm: query,
          includedEntityTypes: ['PLACE_TYPE_AIRPORT', 'PLACE_TYPE_CITY'],
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[v0] Skyscanner autosuggest error:', response.status, errorText)
      throw new Error(`Error en autosuggest: ${response.status}`)
    }

    const data = await response.json()
    
    return (data.places || []).map((place: any) => ({
      entityId: place.entityId,
      skyId: place.skyId,
      name: place.name,
      type: place.type,
      iata: place.iata,
      country: place.hierarchy?.split(',').pop()?.trim() || '',
      city: place.hierarchy?.split(',')[0]?.trim() || place.name,
    }))
  } catch (error) {
    console.error('[v0] Error buscando lugares:', error)
    throw error
  }
}

// Crear sesion de busqueda de vuelos
export async function createFlightSearch(query: FlightQuery): Promise<SearchFlightsResult> {
  if (!SKYSCANNER_API_KEY) {
    throw new Error('SKYSCANNER_API_KEY no configurada')
  }

  const requestBody = {
    query: {
      market: 'ES',
      locale: 'es-ES',
      currency: 'EUR',
      queryLegs: [
        {
          originPlaceId: { skyId: query.originSkyId, entityId: query.originEntityId },
          destinationPlaceId: { skyId: query.destinationSkyId, entityId: query.destinationEntityId },
          date: {
            year: parseInt(query.date.split('-')[0]),
            month: parseInt(query.date.split('-')[1]),
            day: parseInt(query.date.split('-')[2]),
          },
        },
        ...(query.returnDate ? [{
          originPlaceId: { skyId: query.destinationSkyId, entityId: query.destinationEntityId },
          destinationPlaceId: { skyId: query.originSkyId, entityId: query.originEntityId },
          date: {
            year: parseInt(query.returnDate.split('-')[0]),
            month: parseInt(query.returnDate.split('-')[1]),
            day: parseInt(query.returnDate.split('-')[2]),
          },
        }] : []),
      ],
      cabinClass: query.cabinClass || 'CABIN_CLASS_ECONOMY',
      adults: query.adults || 1,
      childrenAges: query.children ? Array(query.children).fill(10) : [],
      infantsAges: query.infants ? Array(query.infants).fill(1) : [],
      excludedAgentsIds: [],
      excludedCarriersIds: [],
      includedAgentsIds: [],
      includedCarriersIds: [],
    },
  }

  try {
    const response = await fetch(`${BASE_URL}/flights/live/search/create`, {
      method: 'POST',
      headers: {
        'x-api-key': SKYSCANNER_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[v0] Skyscanner search error:', response.status, errorText)
      throw new Error(`Error en busqueda: ${response.status}`)
    }

    const data = await response.json()
    return parseFlightResults(data)
  } catch (error) {
    console.error('[v0] Error creando busqueda:', error)
    throw error
  }
}

// Continuar polling de resultados
export async function pollFlightResults(sessionToken: string): Promise<SearchFlightsResult> {
  if (!SKYSCANNER_API_KEY) {
    throw new Error('SKYSCANNER_API_KEY no configurada')
  }

  try {
    const response = await fetch(`${BASE_URL}/flights/live/search/poll/${sessionToken}`, {
      method: 'POST',
      headers: {
        'x-api-key': SKYSCANNER_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })

    if (!response.ok) {
      throw new Error(`Error en polling: ${response.status}`)
    }

    const data = await response.json()
    return parseFlightResults(data)
  } catch (error) {
    console.error('[v0] Error en polling:', error)
    throw error
  }
}

// Parsear resultados de Skyscanner
function parseFlightResults(data: any): SearchFlightsResult {
  const { content, status, sessionToken } = data

  if (!content) {
    return { itineraries: [], status: status || 'RESULT_STATUS_INCOMPLETE', sessionToken }
  }

  const { results, sortingOptions } = content
  const { itineraries, legs, carriers, places } = results || {}

  const parsedItineraries: FlightItinerary[] = []

  // Obtener los itinerarios ordenados por precio
  const sortedIds = sortingOptions?.best || []

  for (const itineraryId of sortedIds.slice(0, 20)) {
    const itinerary = itineraries?.[itineraryId]
    if (!itinerary) continue

    const pricingOptions = itinerary.pricingOptions || []
    const bestPrice = pricingOptions[0]
    if (!bestPrice) continue

    const parsedLegs: FlightLeg[] = []
    
    for (const legId of itinerary.legIds || []) {
      const leg = legs?.[legId]
      if (!leg) continue

      const originPlace = places?.[leg.originPlaceId]
      const destPlace = places?.[leg.destinationPlaceId]
      const legCarriers = (leg.marketingCarrierIds || []).map((cid: string) => {
        const carrier = carriers?.[cid]
        return {
          name: carrier?.name || 'Desconocida',
          logoUrl: carrier?.imageUrl || '',
        }
      })

      parsedLegs.push({
        id: legId,
        origin: {
          name: originPlace?.name || '',
          displayCode: originPlace?.displayCode || '',
          city: originPlace?.cityName || originPlace?.name || '',
          country: originPlace?.countryName || '',
        },
        destination: {
          name: destPlace?.name || '',
          displayCode: destPlace?.displayCode || '',
          city: destPlace?.cityName || destPlace?.name || '',
          country: destPlace?.countryName || '',
        },
        departure: leg.departureDateTime?.isoStr || leg.departure || '',
        arrival: leg.arrivalDateTime?.isoStr || leg.arrival || '',
        duration: leg.durationInMinutes || 0,
        carriers: legCarriers,
        stopCount: leg.stopCount || 0,
      })
    }

    parsedItineraries.push({
      id: itineraryId,
      price: {
        raw: bestPrice.price?.amount || 0,
        formatted: `${bestPrice.price?.amount || 0} €`,
      },
      legs: parsedLegs,
      score: itinerary.score || 0,
      deepLink: bestPrice.items?.[0]?.deepLink || '',
    })
  }

  return {
    itineraries: parsedItineraries,
    status: status || 'RESULT_STATUS_COMPLETE',
    sessionToken,
  }
}

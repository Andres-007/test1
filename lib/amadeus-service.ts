'use server'

import Amadeus from 'amadeus'

// Initialize Amadeus client only if credentials are available
const amadeus = process.env.AMADEUS_API_KEY && process.env.AMADEUS_API_SECRET
  ? new Amadeus({
      clientId: process.env.AMADEUS_API_KEY,
      clientSecret: process.env.AMADEUS_API_SECRET,
    })
  : null

export interface FlightOffer {
  id: string
  price: {
    total: string
    currency: string
  }
  itineraries: Array<{
    duration: string
    segments: Array<{
      departure: {
        iataCode: string
        at: string
        terminal?: string
      }
      arrival: {
        iataCode: string
        at: string
        terminal?: string
      }
      carrierCode: string
      number: string
      aircraft: { code: string }
      duration: string
      numberOfStops: number
    }>
  }>
  travelerPricings: Array<{
    travelerId: string
    fareOption: string
    travelerType: string
    price: { total: string; currency: string }
    fareDetailsBySegment: Array<{
      cabin: string
      class: string
      includedCheckedBags?: { weight?: number; quantity?: number }
    }>
  }>
}

export interface Airport {
  iataCode: string
  name: string
  cityName: string
  countryName: string
}

// Mock data for when API is not available
const mockFlightOffers: FlightOffer[] = [
  {
    id: '1',
    price: { total: '245.00', currency: 'EUR' },
    itineraries: [{
      duration: 'PT2H30M',
      segments: [{
        departure: { iataCode: 'MAD', at: '2024-03-15T08:00:00', terminal: '4' },
        arrival: { iataCode: 'BCN', at: '2024-03-15T09:30:00', terminal: '1' },
        carrierCode: 'IB',
        number: '1234',
        aircraft: { code: '320' },
        duration: 'PT1H30M',
        numberOfStops: 0
      }]
    }],
    travelerPricings: [{
      travelerId: '1',
      fareOption: 'STANDARD',
      travelerType: 'ADULT',
      price: { total: '245.00', currency: 'EUR' },
      fareDetailsBySegment: [{ cabin: 'ECONOMY', class: 'Y', includedCheckedBags: { weight: 23 } }]
    }]
  },
  {
    id: '2',
    price: { total: '189.00', currency: 'EUR' },
    itineraries: [{
      duration: 'PT3H15M',
      segments: [{
        departure: { iataCode: 'MAD', at: '2024-03-15T12:00:00', terminal: '1' },
        arrival: { iataCode: 'BCN', at: '2024-03-15T13:30:00', terminal: '2' },
        carrierCode: 'VY',
        number: '1001',
        aircraft: { code: '320' },
        duration: 'PT1H30M',
        numberOfStops: 0
      }]
    }],
    travelerPricings: [{
      travelerId: '1',
      fareOption: 'STANDARD',
      travelerType: 'ADULT',
      price: { total: '189.00', currency: 'EUR' },
      fareDetailsBySegment: [{ cabin: 'ECONOMY', class: 'Y' }]
    }]
  },
  {
    id: '3',
    price: { total: '520.00', currency: 'EUR' },
    itineraries: [{
      duration: 'PT2H00M',
      segments: [{
        departure: { iataCode: 'MAD', at: '2024-03-15T14:30:00', terminal: '4S' },
        arrival: { iataCode: 'BCN', at: '2024-03-15T16:00:00', terminal: '1' },
        carrierCode: 'IB',
        number: '1502',
        aircraft: { code: '321' },
        duration: 'PT1H30M',
        numberOfStops: 0
      }]
    }],
    travelerPricings: [{
      travelerId: '1',
      fareOption: 'STANDARD',
      travelerType: 'ADULT',
      price: { total: '520.00', currency: 'EUR' },
      fareDetailsBySegment: [{ cabin: 'BUSINESS', class: 'J', includedCheckedBags: { quantity: 2 } }]
    }]
  }
]

const mockAirports: Airport[] = [
  { iataCode: 'MAD', name: 'Adolfo Suarez Madrid-Barajas', cityName: 'Madrid', countryName: 'Spain' },
  { iataCode: 'BCN', name: 'Josep Tarradellas Barcelona-El Prat', cityName: 'Barcelona', countryName: 'Spain' },
  { iataCode: 'LHR', name: 'Heathrow Airport', cityName: 'London', countryName: 'United Kingdom' },
  { iataCode: 'CDG', name: 'Charles de Gaulle Airport', cityName: 'Paris', countryName: 'France' },
  { iataCode: 'FCO', name: 'Leonardo da Vinci-Fiumicino', cityName: 'Rome', countryName: 'Italy' },
  { iataCode: 'AMS', name: 'Amsterdam Airport Schiphol', cityName: 'Amsterdam', countryName: 'Netherlands' },
  { iataCode: 'FRA', name: 'Frankfurt Airport', cityName: 'Frankfurt', countryName: 'Germany' },
  { iataCode: 'JFK', name: 'John F. Kennedy International', cityName: 'New York', countryName: 'United States' },
  { iataCode: 'LAX', name: 'Los Angeles International', cityName: 'Los Angeles', countryName: 'United States' },
  { iataCode: 'MIA', name: 'Miami International', cityName: 'Miami', countryName: 'United States' },
  { iataCode: 'NRT', name: 'Narita International', cityName: 'Tokyo', countryName: 'Japan' },
  { iataCode: 'SYD', name: 'Sydney Airport', cityName: 'Sydney', countryName: 'Australia' },
  { iataCode: 'DXB', name: 'Dubai International', cityName: 'Dubai', countryName: 'United Arab Emirates' },
  { iataCode: 'SIN', name: 'Singapore Changi', cityName: 'Singapore', countryName: 'Singapore' },
  { iataCode: 'HKG', name: 'Hong Kong International', cityName: 'Hong Kong', countryName: 'Hong Kong' },
]

export async function searchFlights(
  origin: string,
  destination: string,
  departureDate: string,
  returnDate?: string,
  adults: number = 1,
  travelClass: string = 'ECONOMY'
): Promise<{ data: FlightOffer[]; isLive: boolean }> {
  // If no API credentials, return mock data
  if (!amadeus) {
    console.log('[Amadeus] No API credentials - returning mock data')
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    return { data: mockFlightOffers, isLive: false }
  }

  try {
    const params: Record<string, string | number> = {
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate,
      adults,
      travelClass,
      max: 10,
      currencyCode: 'EUR'
    }

    if (returnDate) {
      params.returnDate = returnDate
    }

    const response = await amadeus.shopping.flightOffersSearch.get(params)
    return { data: response.data as FlightOffer[], isLive: true }
  } catch (error) {
    console.error('[Amadeus] API error:', error)
    return { data: mockFlightOffers, isLive: false }
  }
}

export async function searchAirports(keyword: string): Promise<{ data: Airport[]; isLive: boolean }> {
  if (!amadeus) {
    // Filter mock airports by keyword
    const filtered = mockAirports.filter(
      a => 
        a.iataCode.toLowerCase().includes(keyword.toLowerCase()) ||
        a.name.toLowerCase().includes(keyword.toLowerCase()) ||
        a.cityName.toLowerCase().includes(keyword.toLowerCase())
    )
    return { data: filtered.slice(0, 5), isLive: false }
  }

  try {
    const response = await amadeus.referenceData.locations.get({
      keyword,
      subType: 'AIRPORT,CITY',
      'page[limit]': 5
    })
    
    const airports: Airport[] = response.data.map((loc: { iataCode: string; name: string; address: { cityName: string; countryName: string } }) => ({
      iataCode: loc.iataCode,
      name: loc.name,
      cityName: loc.address?.cityName || '',
      countryName: loc.address?.countryName || ''
    }))
    
    return { data: airports, isLive: true }
  } catch (error) {
    console.error('[Amadeus] Airport search error:', error)
    const filtered = mockAirports.filter(
      a => 
        a.iataCode.toLowerCase().includes(keyword.toLowerCase()) ||
        a.name.toLowerCase().includes(keyword.toLowerCase()) ||
        a.cityName.toLowerCase().includes(keyword.toLowerCase())
    )
    return { data: filtered.slice(0, 5), isLive: false }
  }
}

export async function getFlightPrice(flightOfferId: string): Promise<{ data: FlightOffer | null; isLive: boolean }> {
  if (!amadeus) {
    const flight = mockFlightOffers.find(f => f.id === flightOfferId)
    return { data: flight || null, isLive: false }
  }

  try {
    const response = await amadeus.shopping.flightOffers.pricing.post(
      JSON.stringify({
        data: {
          type: 'flight-offers-pricing',
          flightOffers: [{ id: flightOfferId }]
        }
      })
    )
    return { data: response.data?.flightOffers?.[0] || null, isLive: true }
  } catch (error) {
    console.error('[Amadeus] Pricing error:', error)
    return { data: null, isLive: false }
  }
}

export function isAmadeusConfigured(): boolean {
  return amadeus !== null
}

export interface Airline {
  id: string
  name: string
  logo: string
  rating: number
}

export interface Flight {
  id: string
  airline: Airline
  origin: string
  originCode: string
  destination: string
  destinationCode: string
  departureTime: string
  arrivalTime: string
  duration: string
  price: number
  stops: number
  class: 'economy' | 'business' | 'first'
  // Real flight data (when using APIs)
  deepLink?: string
  bookingToken?: string
  isReal?: boolean
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  flights?: Flight[]
  timestamp: Date
  // Metadata for flight results
  flightsMeta?: {
    isReal: boolean
    source: string
    message?: string
  }
}

export interface SearchQuery {
  origin?: string
  destination?: string
  date?: string
  passengers?: number
}

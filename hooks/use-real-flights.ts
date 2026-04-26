'use client'

import useSWR from 'swr'
import type { Flight } from '@/lib/types'

interface FlightSearchResult {
  flights: Flight[]
  isReal: boolean
  source: 'kiwi' | 'amadeus' | 'mock'
  error?: string
  message?: string
}

const fetcher = async (url: string): Promise<FlightSearchResult> => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Failed to fetch flights')
  }
  return res.json()
}

export function useRealFlights(
  originCode: string | null,
  destinationCode: string | null,
  date?: string
) {
  const shouldFetch = originCode && destinationCode
  
  const params = new URLSearchParams()
  if (originCode) params.set('origin', originCode)
  if (destinationCode) params.set('destination', destinationCode)
  if (date) params.set('date', date)
  
  const { data, error, isLoading, mutate } = useSWR<FlightSearchResult>(
    shouldFetch ? `/api/flights/real?${params.toString()}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // Cache for 1 minute
    }
  )

  return {
    flights: data?.flights || [],
    isReal: data?.isReal || false,
    source: data?.source || 'mock',
    apiError: data?.error,
    apiMessage: data?.message,
    error,
    isLoading,
    refresh: mutate,
  }
}

// Check if flight API is configured
export function useFlightAPIStatus() {
  const { data, error } = useSWR<{ configured: boolean }>(
    '/api/flights/real',
    async (url) => {
      const res = await fetch(url, { method: 'HEAD' })
      return { configured: res.headers.get('X-API-Configured') === 'true' }
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  return {
    isConfigured: data?.configured || false,
    isLoading: !data && !error,
  }
}

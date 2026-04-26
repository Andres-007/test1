'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { getNearbyAirports, type AirportWithCoordinates } from './airports-coordinates'

export interface UserLocation {
  lat: number
  lng: number
  city: string
  country: string
  countryCode: string
  nearestAirport: AirportWithCoordinates & { distance: number }
  nearbyAirports: (AirportWithCoordinates & { distance: number })[]
}

interface LocationContextType {
  location: UserLocation | null
  loading: boolean
  error: string | null
  requestLocation: () => void
  clearLocation: () => void
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<UserLocation | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const requestLocation = useCallback(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setError('Tu navegador no soporta geolocalizacion')
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        
        // Get nearby airports
        const airports = getNearbyAirports(latitude, longitude, 8)
        const nearestAirport = airports[0]
        
        // Try to get location name via reverse geocoding
        let city = nearestAirport?.city || 'Tu ubicacion'
        let country = nearestAirport?.country || ''
        let countryCode = ''

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                'User-Agent': 'FlyBot/1.0'
              }
            }
          )
          const data = await response.json()
          if (data.address) {
            city = data.address.city || data.address.town || data.address.village || data.address.state || city
            country = data.address.country || country
            countryCode = data.address.country_code?.toUpperCase() || ''
          }
        } catch {
          // Use airport data as fallback
        }

        setLocation({
          lat: latitude,
          lng: longitude,
          city,
          country,
          countryCode,
          nearestAirport,
          nearbyAirports: airports
        })
        setLoading(false)
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Permiso de ubicacion denegado')
            break
          case err.POSITION_UNAVAILABLE:
            setError('Ubicacion no disponible')
            break
          case err.TIMEOUT:
            setError('Tiempo de espera agotado')
            break
          default:
            setError('Error al obtener ubicacion')
        }
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // Cache for 5 minutes
      }
    )
  }, [])

  const clearLocation = useCallback(() => {
    setLocation(null)
    setError(null)
  }, [])

  // Auto-request location on mount
  useEffect(() => {
    // Check if we already have permission
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted') {
          requestLocation()
        }
      }).catch(() => {
        // Permissions API not supported, don't auto-request
      })
    }
  }, [requestLocation])

  return (
    <LocationContext.Provider value={{ location, loading, error, requestLocation, clearLocation }}>
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  const context = useContext(LocationContext)
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider')
  }
  return context
}

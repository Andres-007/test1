"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  ArrowLeft,
  Search,
  Plane,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  Navigation,
  Gauge,
} from 'lucide-react'

interface FlightStatus {
  flightNumber: string
  airline: string
  airlineLogo: string
  status: 'scheduled' | 'boarding' | 'departed' | 'in-flight' | 'landed' | 'arrived' | 'delayed' | 'cancelled'
  statusColor: string
  departure: {
    airport: string
    city: string
    terminal: string
    gate: string
    scheduledTime: string
    actualTime: string | null
    delay: number
  }
  arrival: {
    airport: string
    city: string
    terminal: string
    gate: string
    scheduledTime: string
    estimatedTime: string
    actualTime: string | null
  }
  aircraft: {
    model: string
    registration: string
  }
  progress: number
  altitude: number | null
  speed: number | null
  position: {
    lat: number
    lng: number
  } | null
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  'scheduled': { label: 'Programado', color: 'text-muted-foreground', bgColor: 'bg-muted' },
  'boarding': { label: 'Embarcando', color: 'text-blue-500', bgColor: 'bg-blue-500' },
  'departed': { label: 'Despegado', color: 'text-green-500', bgColor: 'bg-green-500' },
  'in-flight': { label: 'En Vuelo', color: 'text-green-500', bgColor: 'bg-green-500' },
  'landed': { label: 'Aterrizado', color: 'text-green-500', bgColor: 'bg-green-500' },
  'arrived': { label: 'Llegado', color: 'text-green-500', bgColor: 'bg-green-500' },
  'delayed': { label: 'Retrasado', color: 'text-amber-500', bgColor: 'bg-amber-500' },
  'cancelled': { label: 'Cancelado', color: 'text-red-500', bgColor: 'bg-red-500' },
}

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  })
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('es-ES', { 
    weekday: 'short',
    day: 'numeric', 
    month: 'short'
  })
}

export function FlightTracker() {
  const [flightNumber, setFlightNumber] = useState('')
  const [flight, setFlight] = useState<FlightStatus | null>(null)
  const [recentFlights, setRecentFlights] = useState<FlightStatus[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingRecent, setIsLoadingRecent] = useState(true)
  const [error, setError] = useState('')
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [autoRefresh, setAutoRefresh] = useState(false)

  // Load recent flights on mount
  useEffect(() => {
    const loadRecentFlights = async () => {
      try {
        const res = await fetch('/api/flights/track')
        if (res.ok) {
          const data = await res.json()
          setRecentFlights(data)
        }
      } catch (err) {
        console.error('Error loading recent flights:', err)
      } finally {
        setIsLoadingRecent(false)
      }
    }
    loadRecentFlights()
  }, [])

  // Auto-refresh every 30 seconds if enabled
  useEffect(() => {
    if (!autoRefresh || !flight) return
    
    const interval = setInterval(() => {
      searchFlight(flight.flightNumber)
    }, 30000)
    
    return () => clearInterval(interval)
  }, [autoRefresh, flight])

  const searchFlight = async (number?: string) => {
    const searchNumber = (number || flightNumber).toUpperCase().replace(/\s/g, '')
    
    if (!searchNumber) {
      setError('Ingresa un numero de vuelo')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/flights/track?flight=${encodeURIComponent(searchNumber)}`)
      
      if (res.ok) {
        const data = await res.json()
        setFlight(data)
        setRecentSearches(prev => [searchNumber, ...prev.filter(s => s !== searchNumber)].slice(0, 5))
      } else {
        const errorData = await res.json()
        setError(errorData.error || 'Vuelo no encontrado')
        setFlight(null)
      }
    } catch (err) {
      setError('Error al buscar el vuelo. Intenta de nuevo.')
      setFlight(null)
    }

    setIsLoading(false)
  }

  const StatusIcon = flight?.status === 'cancelled' ? XCircle : 
                     flight?.status === 'delayed' ? AlertTriangle :
                     flight?.status === 'in-flight' || flight?.status === 'departed' ? Plane :
                     CheckCircle2

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/chat">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">Seguimiento de Vuelos</h1>
              <p className="text-sm text-muted-foreground">Rastrea tu vuelo en tiempo real</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Buscar Vuelo</CardTitle>
            <CardDescription>Ingresa el numero de vuelo (ej: IB3456, AA100, LH400)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Numero de vuelo..."
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && searchFlight()}
                className="flex-1"
              />
              <Button onClick={() => searchFlight()} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>

            {error && (
              <p className="text-sm text-destructive mt-2">{error}</p>
            )}

            {recentSearches.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Busquedas recientes:</p>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search) => (
                    <Button
                      key={search}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFlightNumber(search)
                        searchFlight(search)
                      }}
                    >
                      {search}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Flight Result */}
        {flight && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  {flight.airlineLogo && (
                    <Image
                      src={flight.airlineLogo}
                      alt={flight.airline}
                      width={48}
                      height={48}
                      className="rounded"
                    />
                  )}
                  <div>
                    <CardTitle className="text-2xl">{flight.flightNumber}</CardTitle>
                    <CardDescription>{flight.airline}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`${statusConfig[flight.status]?.bgColor || 'bg-muted'} text-white`}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusConfig[flight.status]?.label || flight.status}
                  </Badge>
                  <Button 
                    variant={autoRefresh ? "default" : "ghost"} 
                    size="icon" 
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    title={autoRefresh ? "Auto-refrescando cada 30s" : "Activar auto-refresco"}
                  >
                    <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Flight Progress */}
              {flight.progress > 0 && (
                <div className="relative">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${flight.progress}%` }}
                    />
                  </div>
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-500"
                    style={{ left: `${flight.progress}%` }}
                  >
                    <div className="bg-primary text-primary-foreground rounded-full p-1">
                      <Plane className="h-4 w-4 rotate-90" />
                    </div>
                  </div>
                </div>
              )}

              {/* In-flight Data */}
              {flight.status === 'in-flight' && flight.altitude && flight.speed && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <Navigation className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <p className="text-xs text-muted-foreground">Altitud</p>
                    <p className="font-bold">{flight.altitude.toLocaleString()} ft</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <Gauge className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <p className="text-xs text-muted-foreground">Velocidad</p>
                    <p className="font-bold">{flight.speed} km/h</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <Plane className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <p className="text-xs text-muted-foreground">Avion</p>
                    <p className="font-bold text-sm">{flight.aircraft.model}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <span className="text-lg">🛫</span>
                    <p className="text-xs text-muted-foreground">Registro</p>
                    <p className="font-bold text-sm">{flight.aircraft.registration}</p>
                  </div>
                </div>
              )}

              {/* Departure and Arrival */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Departure */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-green-500" />
                    Salida
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold">{flight.departure.airport}</span>
                      <span className="text-muted-foreground">{flight.departure.city}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Programado</p>
                        <p className="font-medium">
                          {formatTime(flight.departure.scheduledTime)}
                          <span className="text-xs text-muted-foreground ml-1">
                            {formatDate(flight.departure.scheduledTime)}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Real</p>
                        <p className={`font-medium ${flight.departure.delay > 0 ? 'text-amber-500' : ''}`}>
                          {flight.departure.actualTime 
                            ? formatTime(flight.departure.actualTime)
                            : '--:--'}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Terminal</p>
                        <p className="font-medium">{flight.departure.terminal}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Puerta</p>
                        <p className="font-medium">{flight.departure.gate}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Arrival */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-red-500" />
                    Llegada
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold">{flight.arrival.airport}</span>
                      <span className="text-muted-foreground">{flight.arrival.city}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Programado</p>
                        <p className="font-medium">
                          {formatTime(flight.arrival.scheduledTime)}
                          <span className="text-xs text-muted-foreground ml-1">
                            {formatDate(flight.arrival.scheduledTime)}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Estimado</p>
                        <p className={`font-medium ${flight.departure.delay > 0 ? 'text-amber-500' : ''}`}>
                          {formatTime(flight.arrival.estimatedTime)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Terminal</p>
                        <p className="font-medium">{flight.arrival.terminal}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Puerta</p>
                        <p className="font-medium">{flight.arrival.gate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delay Notice */}
              {flight.departure.delay > 0 && (
                <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <div>
                    <p className="font-medium text-amber-800 dark:text-amber-200">
                      Retraso de {flight.departure.delay} minutos
                    </p>
                    <p className="text-sm text-amber-600 dark:text-amber-400">
                      Verifica la informacion actualizada en el aeropuerto
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Sample Flights */}
        {!flight && (
          <Card>
            <CardHeader>
              <CardTitle>Vuelos Populares</CardTitle>
              <CardDescription>Selecciona un vuelo para ver su estado</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingRecent ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {recentFlights.map((f) => (
                    <Button
                      key={f.flightNumber}
                      variant="outline"
                      className="h-auto p-4 justify-start"
                      onClick={() => {
                        setFlightNumber(f.flightNumber)
                        searchFlight(f.flightNumber)
                      }}
                    >
                      <div className="flex items-start gap-3 w-full">
                        {f.airlineLogo && (
                          <Image
                            src={f.airlineLogo}
                            alt={f.airline}
                            width={32}
                            height={32}
                            className="rounded"
                          />
                        )}
                        <div className="text-left flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-bold">{f.flightNumber}</p>
                            <Badge 
                              variant="outline" 
                              className={statusConfig[f.status]?.color || ''}
                            >
                              {statusConfig[f.status]?.label || f.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {f.departure.city} → {f.arrival.city}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {f.airline}
                          </p>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

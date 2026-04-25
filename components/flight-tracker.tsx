"use client"

import { useState } from 'react'
import Link from 'next/link'
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
} from 'lucide-react'

interface FlightStatus {
  flightNumber: string
  airline: string
  status: 'on-time' | 'delayed' | 'cancelled' | 'boarding' | 'departed' | 'landed'
  departure: {
    airport: string
    city: string
    scheduled: string
    estimated: string
    gate: string
    terminal: string
  }
  arrival: {
    airport: string
    city: string
    scheduled: string
    estimated: string
    gate: string
    terminal: string
  }
  delay: number
  progress: number
}

// Simulated flight data
const mockFlights: Record<string, FlightStatus> = {
  'IB3456': {
    flightNumber: 'IB3456',
    airline: 'Iberia',
    status: 'on-time',
    departure: {
      airport: 'MAD',
      city: 'Madrid',
      scheduled: '14:30',
      estimated: '14:30',
      gate: 'B23',
      terminal: 'T4',
    },
    arrival: {
      airport: 'BCN',
      city: 'Barcelona',
      scheduled: '15:45',
      estimated: '15:45',
      gate: 'A12',
      terminal: 'T1',
    },
    delay: 0,
    progress: 0,
  },
  'AA100': {
    flightNumber: 'AA100',
    airline: 'American Airlines',
    status: 'delayed',
    departure: {
      airport: 'JFK',
      city: 'New York',
      scheduled: '09:00',
      estimated: '10:15',
      gate: 'C45',
      terminal: 'T8',
    },
    arrival: {
      airport: 'LAX',
      city: 'Los Angeles',
      scheduled: '12:30',
      estimated: '13:45',
      gate: 'D22',
      terminal: 'T4',
    },
    delay: 75,
    progress: 0,
  },
  'LH456': {
    flightNumber: 'LH456',
    airline: 'Lufthansa',
    status: 'departed',
    departure: {
      airport: 'FRA',
      city: 'Frankfurt',
      scheduled: '10:00',
      estimated: '10:05',
      gate: 'A10',
      terminal: 'T1',
    },
    arrival: {
      airport: 'LHR',
      city: 'London',
      scheduled: '10:55',
      estimated: '11:00',
      gate: 'B32',
      terminal: 'T2',
    },
    delay: 5,
    progress: 65,
  },
  'EK205': {
    flightNumber: 'EK205',
    airline: 'Emirates',
    status: 'boarding',
    departure: {
      airport: 'DXB',
      city: 'Dubai',
      scheduled: '22:30',
      estimated: '22:30',
      gate: 'A1',
      terminal: 'T3',
    },
    arrival: {
      airport: 'JFK',
      city: 'New York',
      scheduled: '04:20',
      estimated: '04:20',
      gate: 'B11',
      terminal: 'T1',
    },
    delay: 0,
    progress: 0,
  },
}

const statusConfig = {
  'on-time': { label: 'A tiempo', color: 'bg-green-500', icon: CheckCircle2 },
  'delayed': { label: 'Retrasado', color: 'bg-yellow-500', icon: AlertTriangle },
  'cancelled': { label: 'Cancelado', color: 'bg-red-500', icon: XCircle },
  'boarding': { label: 'Embarcando', color: 'bg-blue-500', icon: Plane },
  'departed': { label: 'En vuelo', color: 'bg-primary', icon: Plane },
  'landed': { label: 'Aterrizado', color: 'bg-green-500', icon: CheckCircle2 },
}

export function FlightTracker() {
  const [flightNumber, setFlightNumber] = useState('')
  const [flight, setFlight] = useState<FlightStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  const searchFlight = async (number?: string) => {
    const searchNumber = (number || flightNumber).toUpperCase().replace(/\s/g, '')
    
    if (!searchNumber) {
      setError('Ingresa un numero de vuelo')
      return
    }

    setIsLoading(true)
    setError('')

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    const foundFlight = mockFlights[searchNumber]
    
    if (foundFlight) {
      setFlight(foundFlight)
      setRecentSearches(prev => [searchNumber, ...prev.filter(s => s !== searchNumber)].slice(0, 5))
    } else {
      setError(`No se encontro el vuelo ${searchNumber}. Prueba con: IB3456, AA100, LH456 o EK205`)
      setFlight(null)
    }

    setIsLoading(false)
  }

  const StatusIcon = flight ? statusConfig[flight.status].icon : CheckCircle2

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
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
            <CardDescription>Ingresa el numero de vuelo (ej: IB3456, AA100)</CardDescription>
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
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Plane className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{flight.flightNumber}</CardTitle>
                    <CardDescription>{flight.airline}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`${statusConfig[flight.status].color} text-white`}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusConfig[flight.status].label}
                  </Badge>
                  <Button variant="ghost" size="icon" onClick={() => searchFlight(flight.flightNumber)}>
                    <RefreshCw className="h-4 w-4" />
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
                        <p className="font-medium">{flight.departure.scheduled}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Estimado</p>
                        <p className={`font-medium ${flight.delay > 0 ? 'text-yellow-500' : ''}`}>
                          {flight.departure.estimated}
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
                        <p className="font-medium">{flight.arrival.scheduled}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Estimado</p>
                        <p className={`font-medium ${flight.delay > 0 ? 'text-yellow-500' : ''}`}>
                          {flight.arrival.estimated}
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
              {flight.delay > 0 && (
                <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  <div>
                    <p className="font-medium text-yellow-800 dark:text-yellow-200">
                      Retraso de {flight.delay} minutos
                    </p>
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">
                      Verifica la informacion actualizada en el aeropuerto
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Demo Flights */}
        {!flight && (
          <Card>
            <CardHeader>
              <CardTitle>Vuelos de Ejemplo</CardTitle>
              <CardDescription>Prueba con estos numeros de vuelo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {Object.values(mockFlights).map((f) => (
                  <Button
                    key={f.flightNumber}
                    variant="outline"
                    className="h-auto p-4 justify-start"
                    onClick={() => {
                      setFlightNumber(f.flightNumber)
                      searchFlight(f.flightNumber)
                    }}
                  >
                    <div className="text-left">
                      <p className="font-bold">{f.flightNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {f.departure.city} → {f.arrival.city}
                      </p>
                      <Badge variant="outline" className="mt-1">
                        {statusConfig[f.status].label}
                      </Badge>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

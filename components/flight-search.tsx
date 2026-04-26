'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  ArrowLeft,
  Search,
  Plane,
  ArrowRightLeft,
  Calendar,
  Users,
  Clock,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { KiwiFlight, KiwiLocation } from '@/lib/kiwi-api'

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

function AirportSelector({
  label,
  value,
  displayValue,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  displayValue: string
  onChange: (code: string, display: string) => void
  placeholder: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [locations, setLocations] = useState<KiwiLocation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    if (debouncedSearch.length < 2) {
      setLocations([])
      return
    }

    const fetchLocations = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/flights/locations?query=${encodeURIComponent(debouncedSearch)}`)
        const data = await response.json()
        setLocations(data.locations || [])
      } catch (error) {
        console.error('Error fetching locations:', error)
        setLocations([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchLocations()
  }, [debouncedSearch])

  return (
    <div className="relative flex-1">
      <Label className="text-xs text-muted-foreground mb-1.5 block">{label}</Label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 p-3 rounded-lg border bg-background hover:bg-muted transition-colors text-left"
      >
        <Plane className="h-4 w-4 text-muted-foreground" />
        {displayValue ? (
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{displayValue}</p>
            <p className="text-xs text-muted-foreground">{value}</p>
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">{placeholder}</span>
        )}
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>

      {isOpen && (
        <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg max-h-64 overflow-hidden">
          <div className="p-2 border-b">
            <Input
              placeholder="Buscar ciudad o aeropuerto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 text-sm"
              autoFocus
            />
          </div>
          <div className="overflow-y-auto max-h-48">
            {isLoading && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            )}
            {!isLoading && locations.length === 0 && search.length >= 2 && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No se encontraron resultados
              </div>
            )}
            {!isLoading && locations.length === 0 && search.length < 2 && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Escribe al menos 2 caracteres
              </div>
            )}
            {!isLoading && locations.map((location) => (
              <button
                key={location.id}
                type="button"
                onClick={() => {
                  onChange(location.code, `${location.city?.name || location.name}, ${location.country?.name || ''}`)
                  setIsOpen(false)
                  setSearch('')
                }}
                className="w-full flex items-center gap-3 p-2 hover:bg-muted transition-colors text-left"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-xs font-bold text-primary">
                  {location.code}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm">{location.city?.name || location.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {location.name} - {location.country?.name}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
  })
}

function FlightResultCard({ 
  flight, 
  expanded, 
  onToggle 
}: { 
  flight: KiwiFlight
  expanded: boolean
  onToggle: () => void 
}) {
  const stops = flight.route.length - 1
  
  return (
    <Card className={`transition-all ${expanded ? 'ring-2 ring-primary' : ''}`}>
      <CardContent className="p-4">
        {/* Main Info */}
        <div className="flex items-center gap-4">
          {/* Airlines */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
              {flight.airlines[0]}
            </div>
            <p className="text-xs text-muted-foreground">
              {flight.route[0]?.flight_no ? `${flight.airlines[0]}${flight.route[0].flight_no}` : flight.airlines[0]}
            </p>
          </div>

          {/* Times & Route */}
          <div className="flex-1 grid grid-cols-3 gap-2 items-center">
            <div className="text-center">
              <p className="text-xl font-bold">{formatTime(flight.local_departure)}</p>
              <p className="text-sm font-medium">{flight.flyFrom}</p>
              <p className="text-xs text-muted-foreground">{formatDate(flight.local_departure)}</p>
            </div>

            <div className="flex flex-col items-center gap-1">
              <p className="text-xs text-muted-foreground">{formatDuration(flight.duration.departure)}</p>
              <div className="flex items-center gap-1 w-full">
                <div className="h-px flex-1 bg-border" />
                <Plane className="h-3 w-3 text-muted-foreground" />
                <div className="h-px flex-1 bg-border" />
              </div>
              <p className="text-xs text-muted-foreground">
                {stops === 0 ? 'Directo' : `${stops} escala${stops > 1 ? 's' : ''}`}
              </p>
            </div>

            <div className="text-center">
              <p className="text-xl font-bold">{formatTime(flight.local_arrival)}</p>
              <p className="text-sm font-medium">{flight.flyTo}</p>
              <p className="text-xs text-muted-foreground">{formatDate(flight.local_arrival)}</p>
            </div>
          </div>

          {/* Price & Book */}
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">
              ${flight.price}
              <span className="text-sm font-normal text-muted-foreground ml-1">USD</span>
            </p>
            {flight.availability?.seats && (
              <p className="text-xs text-muted-foreground mb-2">
                {flight.availability.seats} asientos
              </p>
            )}
            <Button size="sm" asChild>
              <a href={flight.deep_link} target="_blank" rel="noopener noreferrer" className="gap-1">
                Reservar <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>
        </div>

        {/* Toggle Details */}
        <button
          onClick={onToggle}
          className="flex items-center justify-center gap-1 w-full mt-4 pt-3 border-t text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {expanded ? 'Ocultar detalles' : 'Ver detalles del vuelo'}
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {/* Expanded Details */}
        {expanded && (
          <div className="mt-4 pt-4 border-t space-y-4">
            {/* Route segments */}
            <div className="space-y-3">
              <p className="text-sm font-medium">Itinerario del vuelo</p>
              {flight.route.map((segment, index) => (
                <div key={segment.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-xs font-bold text-primary">
                    {segment.airline}
                  </div>
                  <div className="flex-1 grid grid-cols-3 gap-2 items-center text-sm">
                    <div>
                      <p className="font-medium">{formatTime(segment.local_departure)}</p>
                      <p className="text-xs text-muted-foreground">{segment.cityFrom} ({segment.flyFrom})</p>
                    </div>
                    <div className="text-center">
                      <Clock className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                      <p className="text-xs text-muted-foreground">
                        {segment.airline}{segment.flight_no}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatTime(segment.local_arrival)}</p>
                      <p className="text-xs text-muted-foreground">{segment.cityTo} ({segment.flyTo})</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Baggage info */}
            {flight.bags_price && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Equipaje de mano</p>
                  <p className="font-medium">Incluido</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Equipaje facturado</p>
                  <p className="font-medium">
                    {flight.bags_price['1'] ? `+$${flight.bags_price['1']} USD` : 'Consultar'}
                  </p>
                </div>
              </div>
            )}

            {/* Airlines */}
            {flight.airlines.length > 1 && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Operado por:</p>
                <div className="flex gap-2">
                  {flight.airlines.map((airline) => (
                    <Badge key={airline} variant="outline">
                      {airline}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function FlightSearch() {
  const [originCode, setOriginCode] = useState('')
  const [originDisplay, setOriginDisplay] = useState('')
  const [destinationCode, setDestinationCode] = useState('')
  const [destinationDisplay, setDestinationDisplay] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [passengers, setPassengers] = useState(1)
  const [directOnly, setDirectOnly] = useState(false)
  const [flights, setFlights] = useState<KiwiFlight[]>([])
  const [expandedFlight, setExpandedFlight] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!originCode || !destinationCode || !dateFrom) return

    setIsSearching(true)
    setHasSearched(true)
    setError(null)

    try {
      const searchDate = new Date(dateFrom)
      const formattedDateFrom = `${String(searchDate.getDate()).padStart(2, '0')}/${String(searchDate.getMonth() + 1).padStart(2, '0')}/${searchDate.getFullYear()}`
      
      let formattedDateTo = formattedDateFrom
      if (dateTo) {
        const toDate = new Date(dateTo)
        formattedDateTo = `${String(toDate.getDate()).padStart(2, '0')}/${String(toDate.getMonth() + 1).padStart(2, '0')}/${toDate.getFullYear()}`
      }

      const params = new URLSearchParams({
        from: originCode,
        to: destinationCode,
        dateFrom: formattedDateFrom,
        dateTo: formattedDateTo,
        adults: String(passengers),
        directOnly: String(directOnly),
      })

      const response = await fetch(`/api/flights/search?${params}`)
      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setFlights(data.data || [])
    } catch (err) {
      console.error('Search error:', err)
      setError(err instanceof Error ? err.message : 'Error al buscar vuelos')
      setFlights([])
    } finally {
      setIsSearching(false)
    }
  }

  const swapAirports = () => {
    const tempCode = originCode
    const tempDisplay = originDisplay
    setOriginCode(destinationCode)
    setOriginDisplay(destinationDisplay)
    setDestinationCode(tempCode)
    setDestinationDisplay(tempDisplay)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground">Buscar Vuelos</h1>
              <p className="text-sm text-muted-foreground">Vuelos reales de Kiwi.com</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Search Form */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="grid gap-4">
              {/* Origin & Destination */}
              <div className="flex items-end gap-2">
                <AirportSelector
                  label="Origen"
                  value={originCode}
                  displayValue={originDisplay}
                  onChange={(code, display) => {
                    setOriginCode(code)
                    setOriginDisplay(display)
                  }}
                  placeholder="De donde sales?"
                />
                <button
                  type="button"
                  onClick={swapAirports}
                  className="flex h-10 w-10 items-center justify-center rounded-full border hover:bg-muted transition-colors mb-0.5"
                >
                  <ArrowRightLeft className="h-4 w-4" />
                </button>
                <AirportSelector
                  label="Destino"
                  value={destinationCode}
                  displayValue={destinationDisplay}
                  onChange={(code, display) => {
                    setDestinationCode(code)
                    setDestinationDisplay(display)
                  }}
                  placeholder="A donde vas?"
                />
              </div>

              {/* Date & Passengers */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">Fecha salida</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">Fecha regreso (opcional)</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      min={dateFrom || new Date().toISOString().split('T')[0]}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">Pasajeros</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      min={1}
                      max={9}
                      value={passengers}
                      onChange={(e) => setPassengers(Number(e.target.value))}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={handleSearch}
                    disabled={!originCode || !destinationCode || !dateFrom || isSearching}
                    className="w-full gap-2"
                  >
                    {isSearching ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                    {isSearching ? 'Buscando...' : 'Buscar'}
                  </Button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={directOnly}
                    onChange={(e) => setDirectOnly(e.target.checked)}
                    className="rounded border-muted-foreground"
                  />
                  Solo vuelos directos
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error */}
        {error && (
          <Card className="border-destructive">
            <CardContent className="p-4 text-center text-destructive">
              <p>{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {hasSearched && !error && (
          <div className="space-y-4">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {isSearching ? (
                  'Buscando los mejores vuelos...'
                ) : (
                  <>
                    {flights.length} vuelos encontrados de{' '}
                    <span className="font-medium text-foreground">{originDisplay || originCode}</span> a{' '}
                    <span className="font-medium text-foreground">{destinationDisplay || destinationCode}</span>
                  </>
                )}
              </p>
            </div>

            {/* Loading State */}
            {isSearching && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="animate-pulse flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-muted" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded w-3/4" />
                          <div className="h-3 bg-muted rounded w-1/2" />
                        </div>
                        <div className="h-8 w-24 bg-muted rounded" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Flight Results */}
            {!isSearching && flights.length > 0 && (
              <div className="space-y-3">
                {flights.map((flight) => (
                  <FlightResultCard
                    key={flight.id}
                    flight={flight}
                    expanded={expandedFlight === flight.id}
                    onToggle={() =>
                      setExpandedFlight(expandedFlight === flight.id ? null : flight.id)
                    }
                  />
                ))}
              </div>
            )}

            {/* No Results */}
            {!isSearching && flights.length === 0 && (
              <Card className="py-12">
                <CardContent className="text-center text-muted-foreground">
                  <Plane className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No se encontraron vuelos</p>
                  <p className="text-sm">Intenta con otras fechas o destinos</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Initial State */}
        {!hasSearched && (
          <Card className="py-12">
            <CardContent className="text-center text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Busca vuelos reales</p>
              <p className="text-sm">Precios actualizados en tiempo real con Kiwi.com</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

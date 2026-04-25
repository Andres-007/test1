'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  Search,
  Plane,
  ArrowRightLeft,
  Calendar,
  Users,
  Wifi,
  Tv,
  Utensils,
  Usb,
  Clock,
  Luggage,
  ChevronDown,
  ChevronUp,
  Filter,
} from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { generateFlights, popularAirports, type Flight } from '@/lib/flights-data'

function AirportSelector({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filteredAirports = popularAirports.filter(
    (airport) =>
      airport.city.toLowerCase().includes(search.toLowerCase()) ||
      airport.code.toLowerCase().includes(search.toLowerCase()) ||
      airport.country.toLowerCase().includes(search.toLowerCase())
  )

  const selectedAirport = popularAirports.find((a) => a.code === value)

  return (
    <div className="relative flex-1">
      <Label className="text-xs text-muted-foreground mb-1.5 block">{label}</Label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 p-3 rounded-lg border bg-background hover:bg-muted transition-colors text-left"
      >
        <Plane className="h-4 w-4 text-muted-foreground" />
        {selectedAirport ? (
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{selectedAirport.city}</p>
            <p className="text-xs text-muted-foreground">{selectedAirport.code}</p>
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
            />
          </div>
          <div className="overflow-y-auto max-h-48">
            {filteredAirports.map((airport) => (
              <button
                key={airport.code}
                type="button"
                onClick={() => {
                  onChange(airport.code)
                  setIsOpen(false)
                  setSearch('')
                }}
                className="w-full flex items-center gap-3 p-2 hover:bg-muted transition-colors text-left"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-xs font-bold text-primary">
                  {airport.code}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm">{airport.city}</p>
                  <p className="text-xs text-muted-foreground truncate">{airport.name}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function FlightResultCard({ flight, expanded, onToggle }: { flight: Flight; expanded: boolean; onToggle: () => void }) {
  return (
    <Card className={`transition-all ${expanded ? 'ring-2 ring-primary' : ''}`}>
      <CardContent className="p-4">
        {/* Main Info */}
        <div className="flex items-center gap-4">
          {/* Airline */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
              {flight.airline.code}
            </div>
            <p className="text-xs text-muted-foreground">{flight.flightNumber}</p>
          </div>

          {/* Times & Route */}
          <div className="flex-1 grid grid-cols-3 gap-2 items-center">
            <div className="text-center">
              <p className="text-xl font-bold">{flight.departure}</p>
              <p className="text-sm font-medium">{flight.origin.code}</p>
            </div>

            <div className="flex flex-col items-center gap-1">
              <p className="text-xs text-muted-foreground">{flight.duration}</p>
              <div className="flex items-center gap-1 w-full">
                <div className="h-px flex-1 bg-border" />
                <Plane className="h-3 w-3 text-muted-foreground" />
                <div className="h-px flex-1 bg-border" />
              </div>
              <p className="text-xs text-muted-foreground">
                {flight.stops === 0 ? 'Directo' : `${flight.stops} escala${flight.stops > 1 ? 's' : ''}`}
              </p>
            </div>

            <div className="text-center">
              <p className="text-xl font-bold">{flight.arrival}</p>
              <p className="text-sm font-medium">{flight.destination.code}</p>
            </div>
          </div>

          {/* Price & Book */}
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">
              {flight.price}
              <span className="text-sm font-normal text-muted-foreground ml-1">{flight.currency}</span>
            </p>
            <p className="text-xs text-muted-foreground mb-2">
              {flight.seatsAvailable} asientos
            </p>
            <Button size="sm">Reservar</Button>
          </div>
        </div>

        {/* Toggle Details */}
        <button
          onClick={onToggle}
          className="flex items-center justify-center gap-1 w-full mt-4 pt-3 border-t text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {expanded ? 'Ocultar detalles' : 'Ver detalles'}
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {/* Expanded Details */}
        {expanded && (
          <div className="mt-4 pt-4 border-t space-y-4">
            {/* Features */}
            <div className="flex flex-wrap gap-3">
              {flight.features.wifi && (
                <Badge variant="secondary" className="gap-1">
                  <Wifi className="h-3 w-3" /> WiFi
                </Badge>
              )}
              {flight.features.entertainment && (
                <Badge variant="secondary" className="gap-1">
                  <Tv className="h-3 w-3" /> Entretenimiento
                </Badge>
              )}
              {flight.features.meals && (
                <Badge variant="secondary" className="gap-1">
                  <Utensils className="h-3 w-3" /> Comidas
                </Badge>
              )}
              {flight.features.usb && (
                <Badge variant="secondary" className="gap-1">
                  <Usb className="h-3 w-3" /> USB
                </Badge>
              )}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Avion</p>
                <p className="font-medium">{flight.aircraft}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Clase</p>
                <p className="font-medium capitalize">{flight.cabinClass.replace('-', ' ')}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Equipaje mano</p>
                <p className="font-medium">{flight.baggageIncluded.cabin}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Equipaje facturado</p>
                <p className="font-medium">{flight.baggageIncluded.checked}</p>
              </div>
            </div>

            {/* Stops */}
            {flight.stopCities && flight.stopCities.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Escalas en:</p>
                <div className="flex gap-2">
                  {flight.stopCities.map((city) => (
                    <Badge key={city} variant="outline">
                      {city}
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
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [date, setDate] = useState('')
  const [passengers, setPassengers] = useState(1)
  const [flights, setFlights] = useState<Flight[]>([])
  const [expandedFlight, setExpandedFlight] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = () => {
    if (!origin || !destination || !date) return

    setIsSearching(true)
    setHasSearched(true)

    // Simulate API delay
    setTimeout(() => {
      const results = generateFlights(origin, destination, date, passengers)
      setFlights(results)
      setIsSearching(false)
    }, 1000)
  }

  const swapAirports = () => {
    const temp = origin
    setOrigin(destination)
    setDestination(temp)
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
              <p className="text-sm text-muted-foreground">Compara precios de multiples aerolineas</p>
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
                  value={origin}
                  onChange={setOrigin}
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
                  value={destination}
                  onChange={setDestination}
                  placeholder="A donde vas?"
                />
              </div>

              {/* Date & Passengers */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">Fecha</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
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
                <div className="col-span-2 sm:col-span-1 flex items-end">
                  <Button
                    onClick={handleSearch}
                    disabled={!origin || !destination || !date || isSearching}
                    className="w-full gap-2"
                  >
                    <Search className="h-4 w-4" />
                    {isSearching ? 'Buscando...' : 'Buscar vuelos'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {hasSearched && (
          <div className="space-y-4">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {isSearching ? (
                  'Buscando los mejores vuelos...'
                ) : (
                  <>
                    {flights.length} vuelos encontrados de{' '}
                    <span className="font-medium text-foreground">{origin}</span> a{' '}
                    <span className="font-medium text-foreground">{destination}</span>
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
              <p className="text-lg font-medium">Busca tu proximo vuelo</p>
              <p className="text-sm">Selecciona origen, destino y fecha para ver los vuelos disponibles</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

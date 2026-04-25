'use client'

import { useState, useMemo } from 'react'
import { ArrowLeft, Plane, MapPin, Filter } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerTooltip,
  MapArc,
  type MapArcDatum,
  type MapArcEvent,
} from '@/src/components/ui/map'
import { airlineRoutes, getAllHubCities, type AirlineRoute } from '@/lib/routes-data'
import { airlinesData } from '@/lib/airlines-data'

const airlineColors: Record<string, string> = {
  'singapore-airlines': '#F5A623',
  'emirates': '#D71920',
  'qatar-airways': '#5C0632',
  'iberia': '#D4213D',
  'latam': '#1B3E6F',
  'lufthansa': '#05164D',
  'ana': '#002D72',
  'cathay-pacific': '#006564',
  'ryanair': '#073590',
  'easyjet': '#FF6600',
}

function AirlineLogo({ code }: { code: string }) {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
      {code}
    </div>
  )
}

interface RouteArcDatum extends MapArcDatum {
  airlineId: string
  airlineName: string
  airlineCode: string
  originCity: string
  destinationCity: string
  frequency: string
  aircraft: string
}

export function RoutesMap() {
  const [selectedAirline, setSelectedAirline] = useState<string | null>(null)
  const [hoveredRoute, setHoveredRoute] = useState<RouteArcDatum | null>(null)

  const filteredRoutes = useMemo(() => {
    if (!selectedAirline) return airlineRoutes
    return airlineRoutes.filter((route) => route.airlineId === selectedAirline)
  }, [selectedAirline])

  // Convert routes to MapArc data format
  const arcData: RouteArcDatum[] = useMemo(() => {
    return filteredRoutes.map((route) => ({
      id: route.id,
      from: route.origin.coordinates,
      to: route.destination.coordinates,
      airlineId: route.airlineId,
      airlineName: route.airlineName,
      airlineCode: route.airlineCode,
      originCity: route.origin.city,
      destinationCity: route.destination.city,
      frequency: route.frequency,
      aircraft: route.aircraft,
    }))
  }, [filteredRoutes])

  const hubCities = useMemo(() => {
    if (!selectedAirline) return getAllHubCities()
    const routes = airlineRoutes.filter((r) => r.airlineId === selectedAirline)
    const hubs = new Map<string, { code: string; city: string; coordinates: [number, number] }>()
    routes.forEach((route) => {
      if (!hubs.has(route.origin.code)) {
        hubs.set(route.origin.code, {
          code: route.origin.code,
          city: route.origin.city,
          coordinates: route.origin.coordinates,
        })
      }
      if (!hubs.has(route.destination.code)) {
        hubs.set(route.destination.code, {
          code: route.destination.code,
          city: route.destination.city,
          coordinates: route.destination.coordinates,
        })
      }
    })
    return Array.from(hubs.values())
  }, [selectedAirline])

  const airlinesWithRoutes = useMemo(() => {
    const airlineIds = new Set(airlineRoutes.map((r) => r.airlineId))
    return airlinesData.filter((a) => airlineIds.has(a.id))
  }, [])

  const handleArcHover = (e: MapArcEvent<RouteArcDatum> | null) => {
    setHoveredRoute(e?.arc ?? null)
  }

  // Determine the arc color based on selection
  const arcColor = selectedAirline
    ? airlineColors[selectedAirline] || '#6366F1'
    : '#6366F1'

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Mapa de Rutas</h1>
                <p className="text-sm text-muted-foreground">Explora las rutas de las principales aerolineas</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Airline Filter */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filtrar por aerolinea:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedAirline === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedAirline(null)}
              >
                Todas
              </Button>
              {airlinesWithRoutes.map((airline) => (
                <Button
                  key={airline.id}
                  variant={selectedAirline === airline.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedAirline(airline.id)}
                  className="gap-2"
                  style={{
                    backgroundColor: selectedAirline === airline.id ? airlineColors[airline.id] : undefined,
                    borderColor: selectedAirline === airline.id ? airlineColors[airline.id] : undefined,
                  }}
                >
                  <AirlineLogo code={airline.code} />
                  {airline.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Map */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative h-[500px] md:h-[600px]">
              <Map
                center={[20, 20]}
                zoom={1.5}
                className="w-full h-full"
              >
                {/* Routes as arcs */}
                <MapArc
                  data={arcData}
                  curvature={0.3}
                  paint={{
                    'line-color': arcColor,
                    'line-width': 2,
                    'line-opacity': 0.7,
                  }}
                  hoverPaint={{
                    'line-width': 4,
                    'line-opacity': 1,
                  }}
                  onHover={handleArcHover}
                />

                {/* Hub Markers */}
                {hubCities.map((hub) => (
                  <MapMarker
                    key={hub.code}
                    longitude={hub.coordinates[0]}
                    latitude={hub.coordinates[1]}
                  >
                    <MarkerContent>
                      <div
                        className="w-3 h-3 rounded-full border-2 border-white shadow-lg cursor-pointer"
                        style={{
                          backgroundColor: selectedAirline
                            ? airlineColors[selectedAirline] || '#6366F1'
                            : '#6366F1',
                        }}
                      />
                    </MarkerContent>
                    <MarkerTooltip>
                      <div className="text-center">
                        <p className="font-bold">{hub.code}</p>
                        <p className="text-xs opacity-80">{hub.city}</p>
                      </div>
                    </MarkerTooltip>
                  </MapMarker>
                ))}
              </Map>

              {/* Route Info Tooltip */}
              {hoveredRoute && (
                <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur border rounded-lg p-3 shadow-lg max-w-xs z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <AirlineLogo code={hoveredRoute.airlineCode} />
                    <span className="font-medium text-sm">{hoveredRoute.airlineName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{hoveredRoute.originCity}</span>
                    <Plane className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{hoveredRoute.destinationCity}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <Badge variant="secondary">{hoveredRoute.frequency}</Badge>
                    <Badge variant="outline">{hoveredRoute.aircraft}</Badge>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Routes List */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4">
              {selectedAirline
                ? `Rutas de ${airlinesData.find((a) => a.id === selectedAirline)?.name}`
                : 'Todas las rutas'}
              <span className="text-muted-foreground font-normal ml-2">
                ({filteredRoutes.length} rutas)
              </span>
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredRoutes.map((route) => (
                <div
                  key={route.id}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                  onMouseEnter={() => setHoveredRoute({
                    id: route.id,
                    from: route.origin.coordinates,
                    to: route.destination.coordinates,
                    airlineId: route.airlineId,
                    airlineName: route.airlineName,
                    airlineCode: route.airlineCode,
                    originCity: route.origin.city,
                    destinationCity: route.destination.city,
                    frequency: route.frequency,
                    aircraft: route.aircraft,
                  })}
                  onMouseLeave={() => setHoveredRoute(null)}
                >
                  <div
                    className="w-1 h-10 rounded-full"
                    style={{ backgroundColor: airlineColors[route.airlineId] || '#6366F1' }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <span>{route.origin.code}</span>
                      <Plane className="h-3 w-3 text-muted-foreground" />
                      <span>{route.destination.code}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {route.origin.city} - {route.destination.city}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium">{route.airlineCode}</p>
                    <p className="text-xs text-muted-foreground">{route.frequency}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

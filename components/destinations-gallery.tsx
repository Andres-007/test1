'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  ArrowLeft,
  Search,
  Star,
  MapPin,
  Clock,
  Thermometer,
  DollarSign,
  Heart,
  Plane,
  Calendar,
  Globe,
  ChevronRight,
  X,
} from 'lucide-react'
import { destinations, continents, tags, type Destination } from '@/lib/destinations-data'

export function DestinationsGallery() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedContinent, setSelectedContinent] = useState('Todos')
  const [selectedTag, setSelectedTag] = useState('Todos')
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])

  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  const filteredDestinations = destinations.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesContinent = selectedContinent === 'Todos' || dest.continent === selectedContinent
    const matchesTag = selectedTag === 'Todos' || dest.tags.includes(selectedTag)
    return matchesSearch && matchesContinent && matchesTag
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Globe className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Destinos</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar destinos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Continent Filter */}
          <div className="flex flex-wrap gap-2">
            {continents.map(continent => (
              <Button
                key={continent}
                variant={selectedContinent === continent ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedContinent(continent)}
              >
                {continent}
              </Button>
            ))}
          </div>

          {/* Tags Filter */}
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? 'default' : 'secondary'}
                className="cursor-pointer"
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <p className="mb-6 text-sm text-muted-foreground">
          {filteredDestinations.length} destinos encontrados
        </p>

        {/* Destinations Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDestinations.map(dest => (
            <Card
              key={dest.id}
              className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg"
              onClick={() => setSelectedDestination(dest)}
            >
              {/* Image Placeholder */}
              <div className="relative aspect-[4/3] bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <MapPin className="h-12 w-12 text-primary/30" />
                </div>
                <div className="absolute right-3 top-3">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-white/80 backdrop-blur hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(dest.id)
                    }}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        favorites.includes(dest.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-muted-foreground'
                      }`}
                    />
                  </Button>
                </div>
                <div className="absolute bottom-3 left-3 flex gap-2">
                  {dest.tags.slice(0, 2).map(tag => (
                    <Badge key={tag} className="bg-white/80 text-foreground backdrop-blur">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <CardContent className="p-4">
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{dest.name}</h3>
                    <p className="text-sm text-muted-foreground">{dest.country}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{dest.rating}</span>
                  </div>
                </div>

                <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                  {dest.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Plane className="h-4 w-4" />
                    <span>Desde {dest.avgFlightPrice} EUR</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDestinations.length === 0 && (
          <div className="py-12 text-center">
            <Globe className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="mb-2 font-semibold">No se encontraron destinos</h3>
            <p className="text-sm text-muted-foreground">
              Intenta con otros filtros o terminos de busqueda
            </p>
          </div>
        )}
      </main>

      {/* Destination Detail Modal */}
      {selectedDestination && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedDestination(null)}
        >
          <Card
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Image */}
            <div className="relative aspect-video bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20">
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPin className="h-16 w-16 text-primary/30" />
              </div>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-3 top-3 rounded-full"
                onClick={() => setSelectedDestination(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <CardContent className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selectedDestination.name}</h2>
                  <p className="text-muted-foreground">{selectedDestination.country}, {selectedDestination.continent}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{selectedDestination.rating}</span>
                  <span className="text-sm text-muted-foreground">({selectedDestination.reviews.toLocaleString()})</span>
                </div>
              </div>

              <p className="mb-6 text-muted-foreground">{selectedDestination.description}</p>

              {/* Quick Info */}
              <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-lg bg-muted/50 p-3">
                  <Calendar className="mb-1 h-4 w-4 text-primary" />
                  <div className="text-xs text-muted-foreground">Mejor epoca</div>
                  <div className="text-sm font-medium">{selectedDestination.bestTime}</div>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <Thermometer className="mb-1 h-4 w-4 text-primary" />
                  <div className="text-xs text-muted-foreground">Temperatura</div>
                  <div className="text-sm font-medium">{selectedDestination.avgTemp}</div>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <Clock className="mb-1 h-4 w-4 text-primary" />
                  <div className="text-xs text-muted-foreground">Vuelo</div>
                  <div className="text-sm font-medium">{selectedDestination.flightTime}</div>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <DollarSign className="mb-1 h-4 w-4 text-primary" />
                  <div className="text-xs text-muted-foreground">Desde</div>
                  <div className="text-sm font-medium">{selectedDestination.avgFlightPrice} EUR</div>
                </div>
              </div>

              {/* Highlights */}
              <div className="mb-6">
                <h3 className="mb-3 font-semibold">Lugares destacados</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedDestination.highlights.map(highlight => (
                    <Badge key={highlight} variant="secondary">
                      {highlight}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <h3 className="mb-3 font-semibold">Categorias</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedDestination.tags.map(tag => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Info Grid */}
              <div className="mb-6 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Moneda</div>
                  <div className="font-medium">{selectedDestination.currency}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Idioma</div>
                  <div className="font-medium">{selectedDestination.language}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Zona horaria</div>
                  <div className="font-medium">{selectedDestination.timezone}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => toggleFavorite(selectedDestination.id)}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      favorites.includes(selectedDestination.id)
                        ? 'fill-red-500 text-red-500'
                        : ''
                    }`}
                  />
                  {favorites.includes(selectedDestination.id) ? 'Guardado' : 'Guardar'}
                </Button>
                <Link href="/vuelos" className="flex-1">
                  <Button className="w-full gap-2">
                    <Plane className="h-4 w-4" />
                    Buscar vuelos
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

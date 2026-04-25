'use client'

import { useState, useMemo } from 'react'
import { Star, Plane, Shield, Trophy, ArrowLeft, Filter, SortAsc, SortDesc, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { airlinesData, type Airline } from '@/lib/airlines-data'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= Math.floor(rating)
              ? 'fill-amber-400 text-amber-400'
              : star - 0.5 <= rating
                ? 'fill-amber-400/50 text-amber-400'
                : 'fill-muted text-muted'
          }`}
        />
      ))}
      <span className="ml-1 text-base font-semibold text-foreground">{rating}</span>
    </div>
  )
}

function RankBadge({ rank }: { rank: number }) {
  const colors = {
    1: 'bg-amber-400 text-amber-900',
    2: 'bg-slate-300 text-slate-700',
    3: 'bg-orange-400 text-orange-900',
  }
  return (
    <div
      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${colors[rank as keyof typeof colors] || 'bg-muted text-muted-foreground'}`}
    >
      {rank}
    </div>
  )
}

function AirlineLogo({ code }: { code: string }) {
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-base">
      {code}
    </div>
  )
}

type SortOption = 'rating' | 'reviews' | 'puntualidad' | 'servicio' | 'calidad-precio'
type TypeFilter = 'all' | 'premium' | 'standard' | 'low-cost'
type RegionFilter = 'all' | 'europa' | 'asia' | 'oriente-medio' | 'americas'

const regionMapping: Record<string, RegionFilter> = {
  'Alemania': 'europa',
  'Irlanda': 'europa',
  'Reino Unido': 'europa',
  'Espana': 'europa',
  'Singapur': 'asia',
  'Japon': 'asia',
  'Hong Kong': 'asia',
  'Qatar': 'oriente-medio',
  'Emiratos Arabes Unidos': 'oriente-medio',
  'Chile': 'americas',
}

export function TopAirlines() {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [regionFilter, setRegionFilter] = useState<RegionFilter>('all')
  const [sortBy, setSortBy] = useState<SortOption>('rating')
  const [sortAsc, setSortAsc] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const filteredAndSortedAirlines = useMemo(() => {
    let result = [...airlinesData]

    // Filter by type
    if (typeFilter !== 'all') {
      result = result.filter((a) => a.type === typeFilter)
    }

    // Filter by region
    if (regionFilter !== 'all') {
      result = result.filter((a) => regionMapping[a.country] === regionFilter)
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'rating':
          comparison = b.rating - a.rating
          break
        case 'reviews':
          comparison = b.reviews - a.reviews
          break
        case 'puntualidad':
          comparison = b.stats.puntualidad - a.stats.puntualidad
          break
        case 'servicio':
          comparison = b.stats.servicio - a.stats.servicio
          break
        case 'calidad-precio':
          comparison = b.stats.relacionCalidadPrecio - a.stats.relacionCalidadPrecio
          break
      }
      return sortAsc ? -comparison : comparison
    })

    return result
  }, [typeFilter, regionFilter, sortBy, sortAsc])

  const hasActiveFilters = typeFilter !== 'all' || regionFilter !== 'all'

  const clearFilters = () => {
    setTypeFilter('all')
    setRegionFilter('all')
    setSortBy('rating')
    setSortAsc(false)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                  <Trophy className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Top Aerolineas</h1>
                  <p className="text-sm text-muted-foreground">Ranking mundial 2024</p>
                </div>
              </div>
            </div>
            <Button
              variant={showFilters ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtros
              {hasActiveFilters && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                  {(typeFilter !== 'all' ? 1 : 0) + (regionFilter !== 'all' ? 1 : 0)}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container max-w-4xl mx-auto px-4 py-6">
        {/* Filters Panel */}
        {showFilters && (
          <Card className="mb-6">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Filtros y ordenacion</h3>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-muted-foreground">
                    <X className="h-4 w-4" />
                    Limpiar filtros
                  </Button>
                )}
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                {/* Type Filter */}
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Tipo de aerolinea</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
                    className="w-full p-2 rounded-lg border bg-background text-sm"
                  >
                    <option value="all">Todas</option>
                    <option value="premium">Premium</option>
                    <option value="standard">Estandar</option>
                    <option value="low-cost">Low Cost</option>
                  </select>
                </div>

                {/* Region Filter */}
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Region</label>
                  <select
                    value={regionFilter}
                    onChange={(e) => setRegionFilter(e.target.value as RegionFilter)}
                    className="w-full p-2 rounded-lg border bg-background text-sm"
                  >
                    <option value="all">Todas las regiones</option>
                    <option value="europa">Europa</option>
                    <option value="asia">Asia</option>
                    <option value="oriente-medio">Oriente Medio</option>
                    <option value="americas">Americas</option>
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Ordenar por</label>
                  <div className="flex gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="flex-1 p-2 rounded-lg border bg-background text-sm"
                    >
                      <option value="rating">Rating general</option>
                      <option value="reviews">Num. opiniones</option>
                      <option value="puntualidad">Puntualidad</option>
                      <option value="servicio">Servicio</option>
                      <option value="calidad-precio">Calidad/Precio</option>
                    </select>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setSortAsc(!sortAsc)}
                      title={sortAsc ? 'Ascendente' : 'Descendente'}
                    >
                      {sortAsc ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Active Filters Tags */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 pt-2 border-t">
                  {typeFilter !== 'all' && (
                    <Badge variant="secondary" className="gap-1">
                      {typeFilter === 'premium' ? 'Premium' : typeFilter === 'low-cost' ? 'Low Cost' : 'Estandar'}
                      <button onClick={() => setTypeFilter('all')}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {regionFilter !== 'all' && (
                    <Badge variant="secondary" className="gap-1 capitalize">
                      {regionFilter.replace('-', ' ')}
                      <button onClick={() => setRegionFilter('all')}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Results Count */}
        <p className="text-muted-foreground mb-6">
          {filteredAndSortedAirlines.length} aerolinea{filteredAndSortedAirlines.length !== 1 ? 's' : ''} encontrada{filteredAndSortedAirlines.length !== 1 ? 's' : ''}
        </p>

        {/* Airlines Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {filteredAndSortedAirlines.map((airline, index) => (
            <Link key={airline.id} href={`/aerolineas/${airline.id}`}>
              <Card
                className={`transition-all hover:shadow-lg hover:border-primary/30 cursor-pointer ${
                  index === 0 && !hasActiveFilters ? 'border-amber-300 bg-amber-50/30 sm:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-start gap-4">
                    <RankBadge rank={index + 1} />
                    <AirlineLogo code={airline.code} />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h2 className="font-semibold text-foreground text-lg">{airline.name}</h2>
                        <Badge variant="secondary" className="text-xs">
                          {airline.category}
                        </Badge>
                        <Badge
                          variant={airline.type === 'premium' ? 'default' : airline.type === 'low-cost' ? 'outline' : 'secondary'}
                          className="text-xs"
                        >
                          {airline.type === 'premium' ? 'Premium' : airline.type === 'low-cost' ? 'Low Cost' : 'Estandar'}
                        </Badge>
                      </div>
                      <StarRating rating={airline.rating} />
                      <p className="text-sm text-muted-foreground mt-1">
                        {airline.reviews.toLocaleString()} opiniones - {airline.country}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                      Puntos destacados
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {airline.highlights.map((highlight, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          {i === 0 && <Shield className="h-4 w-4 text-primary flex-shrink-0" />}
                          {i === 1 && <Plane className="h-4 w-4 text-primary flex-shrink-0" />}
                          {i === 2 && <Star className="h-4 w-4 text-primary flex-shrink-0" />}
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* No Results */}
        {filteredAndSortedAirlines.length === 0 && (
          <Card className="py-12">
            <CardContent className="text-center text-muted-foreground">
              <Plane className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No se encontraron aerolineas</p>
              <p className="text-sm mb-4">Intenta con otros filtros</p>
              <Button variant="outline" onClick={clearFilters}>
                Limpiar filtros
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="mt-8 text-center border-t pt-6">
          <p className="text-sm text-muted-foreground">
            Datos actualizados semanalmente basados en opiniones de viajeros verificados.
          </p>
        </div>
      </main>
    </div>
  )
}

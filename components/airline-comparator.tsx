'use client'

import { useState } from 'react'
import { ArrowLeft, Plus, X, Check, Minus, Star, Plane, Users, Calendar, MapPin, Wifi, Tv, Utensils, Briefcase, Luggage, Armchair } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { airlinesData, type Airline } from '@/lib/airlines-data'

function AirlineLogo({ code, size = 'md' }: { code: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'h-10 w-10 text-sm',
    md: 'h-14 w-14 text-base',
    lg: 'h-20 w-20 text-xl',
  }
  return (
    <div className={`flex items-center justify-center rounded-xl bg-primary/10 text-primary font-bold ${sizes[size]}`}>
      {code}
    </div>
  )
}

function StatBar({ value, label }: { value: number; label: string }) {
  const getColor = (val: number) => {
    if (val >= 90) return 'bg-emerald-500'
    if (val >= 75) return 'bg-amber-500'
    return 'bg-red-400'
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all ${getColor(value)}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

function FeatureRow({ label, values }: { label: string; values: (boolean | string)[] }) {
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${values.length}, 1fr)` }}>
      <div className="text-sm font-medium text-muted-foreground py-3">{label}</div>
      {values.map((value, i) => (
        <div key={i} className="flex items-center justify-center py-3 text-sm">
          {typeof value === 'boolean' ? (
            value ? (
              <Check className="h-5 w-5 text-emerald-500" />
            ) : (
              <X className="h-5 w-5 text-red-400" />
            )
          ) : (
            <span className="text-center">{value}</span>
          )}
        </div>
      ))}
    </div>
  )
}

function AirlineSelector({
  selectedAirlines,
  onSelect,
  onRemove,
  maxSelection = 3,
}: {
  selectedAirlines: Airline[]
  onSelect: (airline: Airline) => void
  onRemove: (id: string) => void
  maxSelection?: number
}) {
  const [isOpen, setIsOpen] = useState(false)
  const availableAirlines = airlinesData.filter(
    (a) => !selectedAirlines.find((s) => s.id === a.id)
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {selectedAirlines.map((airline) => (
          <Card key={airline.id} className="relative py-0">
            <CardContent className="flex items-center gap-3 p-3">
              <AirlineLogo code={airline.code} size="sm" />
              <div>
                <p className="font-medium text-sm">{airline.name}</p>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs text-muted-foreground">{airline.rating}</span>
                </div>
              </div>
              <button
                onClick={() => onRemove(airline.id)}
                className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-white hover:bg-destructive/90"
              >
                <X className="h-3 w-3" />
              </button>
            </CardContent>
          </Card>
        ))}

        {selectedAirlines.length < maxSelection && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-20 w-40 items-center justify-center gap-2 rounded-xl border-2 border-dashed border-muted-foreground/30 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span className="text-sm font-medium">Agregar</span>
          </button>
        )}
      </div>

      {isOpen && availableAirlines.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-3">Selecciona una aerolinea:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {availableAirlines.map((airline) => (
                <button
                  key={airline.id}
                  onClick={() => {
                    onSelect(airline)
                    setIsOpen(false)
                  }}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors text-left"
                >
                  <AirlineLogo code={airline.code} size="sm" />
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{airline.name}</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs text-muted-foreground">{airline.rating}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export function AirlineComparator() {
  const [selectedAirlines, setSelectedAirlines] = useState<Airline[]>([
    airlinesData[0],
    airlinesData[1],
  ])

  const handleSelect = (airline: Airline) => {
    if (selectedAirlines.length < 3) {
      setSelectedAirlines([...selectedAirlines, airline])
    }
  }

  const handleRemove = (id: string) => {
    setSelectedAirlines(selectedAirlines.filter((a) => a.id !== id))
  }

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
            <div>
              <h1 className="text-xl font-bold text-foreground">Comparador de Aerolineas</h1>
              <p className="text-sm text-muted-foreground">Selecciona hasta 3 aerolineas para comparar</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-6 space-y-8">
        {/* Airline Selector */}
        <section>
          <AirlineSelector
            selectedAirlines={selectedAirlines}
            onSelect={handleSelect}
            onRemove={handleRemove}
          />
        </section>

        {selectedAirlines.length >= 2 && (
          <>
            {/* Overview Cards */}
            <section>
              <h2 className="text-lg font-semibold mb-4">Resumen General</h2>
              <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${selectedAirlines.length}, 1fr)` }}>
                {selectedAirlines.map((airline) => (
                  <Card key={airline.id}>
                    <CardContent className="p-5 text-center space-y-4">
                      <div className="flex justify-center">
                        <AirlineLogo code={airline.code} size="lg" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{airline.name}</h3>
                        <p className="text-sm text-muted-foreground">{airline.country}</p>
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                        <span className="text-xl font-bold">{airline.rating}</span>
                        <span className="text-sm text-muted-foreground">/ 5</span>
                      </div>
                      <Badge variant={airline.type === 'premium' ? 'default' : airline.type === 'low-cost' ? 'secondary' : 'outline'}>
                        {airline.type === 'premium' ? 'Premium' : airline.type === 'low-cost' ? 'Low Cost' : 'Estandar'}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {airline.reviews.toLocaleString()} opiniones
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Stats Comparison */}
            <section>
              <h2 className="text-lg font-semibold mb-4">Puntuaciones por Categoria</h2>
              <Card>
                <CardContent className="p-5">
                  <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${selectedAirlines.length}, 1fr)` }}>
                    {selectedAirlines.map((airline) => (
                      <div key={airline.id} className="space-y-4">
                        <p className="font-medium text-center text-sm">{airline.name}</p>
                        <StatBar value={airline.stats.puntualidad} label="Puntualidad" />
                        <StatBar value={airline.stats.servicio} label="Servicio" />
                        <StatBar value={airline.stats.comida} label="Comida" />
                        <StatBar value={airline.stats.entretenimiento} label="Entretenimiento" />
                        <StatBar value={airline.stats.confort} label="Confort" />
                        <StatBar value={airline.stats.relacionCalidadPrecio} label="Calidad/Precio" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Features Comparison */}
            <section>
              <h2 className="text-lg font-semibold mb-4">Servicios y Caracteristicas</h2>
              <Card>
                <CardContent className="p-5 overflow-x-auto">
                  <div className="min-w-[600px]">
                    {/* Header */}
                    <div className="grid gap-4 border-b pb-3" style={{ gridTemplateColumns: `200px repeat(${selectedAirlines.length}, 1fr)` }}>
                      <div />
                      {selectedAirlines.map((airline) => (
                        <div key={airline.id} className="text-center">
                          <p className="font-medium text-sm">{airline.name}</p>
                        </div>
                      ))}
                    </div>

                    {/* Features */}
                    <div className="divide-y">
                      <FeatureRow
                        label="WiFi a bordo"
                        values={selectedAirlines.map((a) => a.features.wifi)}
                      />
                      <FeatureRow
                        label="Entretenimiento"
                        values={selectedAirlines.map((a) => a.features.entretenimiento)}
                      />
                      <FeatureRow
                        label="Comida incluida"
                        values={selectedAirlines.map((a) => a.features.comidaIncluida)}
                      />
                      <FeatureRow
                        label="Equipaje de mano"
                        values={selectedAirlines.map((a) => a.features.equipajeMano)}
                      />
                      <FeatureRow
                        label="Equipaje facturado"
                        values={selectedAirlines.map((a) => a.features.equipajeFacturado)}
                      />
                      <FeatureRow
                        label="Seleccion asiento"
                        values={selectedAirlines.map((a) =>
                          a.features.seleccionAsiento === 'gratis' ? 'Gratis' :
                          a.features.seleccionAsiento === 'pago' ? 'De pago' : 'No disponible'
                        )}
                      />
                      <FeatureRow
                        label="Cambios gratis"
                        values={selectedAirlines.map((a) => a.features.cambiosGratis)}
                      />
                      <FeatureRow
                        label="Acceso a lounge"
                        values={selectedAirlines.map((a) => a.features.loungeAccess)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Fleet & Network */}
            <section>
              <h2 className="text-lg font-semibold mb-4">Flota y Red de Destinos</h2>
              <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${selectedAirlines.length}, 1fr)` }}>
                {selectedAirlines.map((airline) => (
                  <Card key={airline.id}>
                    <CardContent className="p-5 space-y-4">
                      <p className="font-medium text-center">{airline.name}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-3 rounded-lg bg-muted">
                          <Plane className="h-5 w-5 mx-auto mb-1 text-primary" />
                          <p className="text-2xl font-bold">{airline.flota.aviones}</p>
                          <p className="text-xs text-muted-foreground">Aviones</p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted">
                          <MapPin className="h-5 w-5 mx-auto mb-1 text-primary" />
                          <p className="text-2xl font-bold">{airline.destinos}</p>
                          <p className="text-xs text-muted-foreground">Destinos</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Edad promedio flota: <span className="font-medium text-foreground">{airline.flota.edadPromedio} anos</span></p>
                        <p className="text-sm text-muted-foreground">Fundada en: <span className="font-medium text-foreground">{airline.fundacion}</span></p>
                        {airline.alliance && (
                          <p className="text-sm text-muted-foreground">Alianza: <span className="font-medium text-foreground">{airline.alliance}</span></p>
                        )}
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground mb-2">Hubs principales:</p>
                        <div className="flex flex-wrap gap-1">
                          {airline.hub.map((h) => (
                            <Badge key={h} variant="outline" className="text-xs">
                              {h}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground mb-2">Tipos de avion:</p>
                        <div className="flex flex-wrap gap-1">
                          {airline.flota.tiposAvion.slice(0, 3).map((t) => (
                            <Badge key={t} variant="secondary" className="text-xs">
                              {t}
                            </Badge>
                          ))}
                          {airline.flota.tiposAvion.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{airline.flota.tiposAvion.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </>
        )}

        {selectedAirlines.length < 2 && (
          <Card className="py-12">
            <CardContent className="text-center text-muted-foreground">
              <Plane className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Selecciona al menos 2 aerolineas</p>
              <p className="text-sm">para ver la comparacion completa</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

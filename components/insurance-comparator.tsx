'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import {
  ArrowLeft,
  Shield,
  Star,
  Check,
  X,
  Heart,
  Briefcase,
  Luggage,
  Clock,
  Users,
  Calendar,
  MapPin,
  Filter,
  SortAsc,
  Award,
} from 'lucide-react'
import { insurancePlans, destinations, tripTypes, type InsurancePlan } from '@/lib/insurance-data'

type SortOption = 'price' | 'rating' | 'coverage'

export function InsuranceComparator() {
  const [destination, setDestination] = useState('europe')
  const [tripType, setTripType] = useState('tourism')
  const [travelers, setTravelers] = useState(1)
  const [days, setDays] = useState(7)
  const [maxPrice, setMaxPrice] = useState(200)
  const [sortBy, setSortBy] = useState<SortOption>('rating')
  const [selectedPlans, setSelectedPlans] = useState<string[]>([])

  const destinationMultiplier = destinations.find(d => d.value === destination)?.multiplier || 1
  const tripMultiplier = tripTypes.find(t => t.value === tripType)?.multiplier || 1

  const calculatedPlans = useMemo(() => {
    return insurancePlans
      .map(plan => ({
        ...plan,
        calculatedPrice: Math.round(plan.pricePerDay * days * travelers * destinationMultiplier * tripMultiplier),
      }))
      .filter(plan => plan.calculatedPrice <= maxPrice)
      .sort((a, b) => {
        if (sortBy === 'price') return a.calculatedPrice - b.calculatedPrice
        if (sortBy === 'rating') return b.rating - a.rating
        if (sortBy === 'coverage') return b.coverage.medical - a.coverage.medical
        return 0
      })
  }, [days, travelers, destinationMultiplier, tripMultiplier, maxPrice, sortBy])

  const togglePlanSelection = (planId: string) => {
    setSelectedPlans(prev => {
      if (prev.includes(planId)) {
        return prev.filter(id => id !== planId)
      }
      if (prev.length < 3) {
        return [...prev, planId]
      }
      return prev
    })
  }

  const selectedPlanDetails = selectedPlans
    .map(id => calculatedPlans.find(p => p.id === id))
    .filter(Boolean) as (InsurancePlan & { calculatedPrice: number })[]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Comparador de Seguros</h1>
            </div>
          </div>
          {selectedPlans.length > 0 && (
            <Badge variant="secondary" className="gap-1">
              {selectedPlans.length}/3 seleccionados
            </Badge>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5" />
              Configura tu viaje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Destino
                </Label>
                <Select value={destination} onValueChange={setDestination}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {destinations.map(d => (
                      <SelectItem key={d.value} value={d.value}>
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Tipo de viaje
                </Label>
                <Select value={tripType} onValueChange={setTripType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tripTypes.map(t => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Viajeros
                </Label>
                <Select value={travelers.toString()} onValueChange={(v) => setTravelers(Number(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map(n => (
                      <SelectItem key={n} value={n.toString()}>
                        {n} {n === 1 ? 'persona' : 'personas'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Duracion (dias)
                </Label>
                <Input
                  type="number"
                  min={1}
                  max={365}
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value) || 1)}
                />
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between">
                <Label>Precio maximo: {formatCurrency(maxPrice)}</Label>
              </div>
              <Slider
                value={[maxPrice]}
                onValueChange={([v]) => setMaxPrice(v)}
                min={20}
                max={500}
                step={10}
                className="py-4"
              />
            </div>
          </CardContent>
        </Card>

        {/* Sorting */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {calculatedPlans.length} seguros encontrados
          </p>
          <div className="flex items-center gap-2">
            <SortAsc className="h-4 w-4 text-muted-foreground" />
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Mejor valorados</SelectItem>
                <SelectItem value="price">Precio mas bajo</SelectItem>
                <SelectItem value="coverage">Mayor cobertura</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {calculatedPlans.map(plan => (
            <Card
              key={plan.id}
              className={`relative transition-all ${
                selectedPlans.includes(plan.id)
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'hover:border-primary/50'
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-4">
                  <Badge className="gap-1 bg-primary">
                    <Award className="h-3 w-3" />
                    Recomendado
                  </Badge>
                </div>
              )}
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 font-bold text-primary">
                      {plan.logo}
                    </div>
                    <div>
                      <h3 className="font-semibold">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground">{plan.provider}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {formatCurrency(plan.calculatedPrice)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatCurrency(plan.pricePerDay)}/dia/persona
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{plan.rating}</span>
                    <span className="text-xs text-muted-foreground">({plan.reviews})</span>
                  </div>
                </div>

                {/* Coverage */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-muted/50 p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Heart className="h-3.5 w-3.5" />
                      Medico
                    </div>
                    <div className="font-semibold">{formatCurrency(plan.coverage.medical)}</div>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <X className="h-3.5 w-3.5" />
                      Cancelacion
                    </div>
                    <div className="font-semibold">{formatCurrency(plan.coverage.cancellation)}</div>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Luggage className="h-3.5 w-3.5" />
                      Equipaje
                    </div>
                    <div className="font-semibold">{formatCurrency(plan.coverage.baggage)}</div>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      Demora
                    </div>
                    <div className="font-semibold">{formatCurrency(plan.coverage.delay)}</div>
                  </div>
                </div>

                {/* Features */}
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {plan.features.slice(0, 4).map((feature, i) => (
                      <Badge key={i} variant="secondary" className="gap-1 text-xs">
                        <Check className="h-3 w-3 text-green-600" />
                        {feature}
                      </Badge>
                    ))}
                    {plan.features.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{plan.features.length - 4} mas
                      </Badge>
                    )}
                  </div>
                </div>

                <Button
                  className="mt-4 w-full"
                  variant={selectedPlans.includes(plan.id) ? 'default' : 'outline'}
                  onClick={() => togglePlanSelection(plan.id)}
                  disabled={!selectedPlans.includes(plan.id) && selectedPlans.length >= 3}
                >
                  {selectedPlans.includes(plan.id) ? 'Seleccionado' : 'Comparar'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Comparison Table */}
        {selectedPlanDetails.length >= 2 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Comparacion detallada</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 text-left font-medium">Caracteristica</th>
                      {selectedPlanDetails.map(plan => (
                        <th key={plan.id} className="py-3 text-center font-medium">
                          <div>{plan.name}</div>
                          <div className="text-xs font-normal text-muted-foreground">{plan.provider}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-3">Precio total</td>
                      {selectedPlanDetails.map(plan => (
                        <td key={plan.id} className="py-3 text-center font-semibold text-primary">
                          {formatCurrency(plan.calculatedPrice)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3">Cobertura medica</td>
                      {selectedPlanDetails.map(plan => (
                        <td key={plan.id} className="py-3 text-center">
                          {formatCurrency(plan.coverage.medical)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3">Cancelacion</td>
                      {selectedPlanDetails.map(plan => (
                        <td key={plan.id} className="py-3 text-center">
                          {formatCurrency(plan.coverage.cancellation)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3">Equipaje</td>
                      {selectedPlanDetails.map(plan => (
                        <td key={plan.id} className="py-3 text-center">
                          {formatCurrency(plan.coverage.baggage)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3">Demora vuelo</td>
                      {selectedPlanDetails.map(plan => (
                        <td key={plan.id} className="py-3 text-center">
                          {formatCurrency(plan.coverage.delay)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3">Valoracion</td>
                      {selectedPlanDetails.map(plan => (
                        <td key={plan.id} className="py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            {plan.rating}
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-center">
                <Button size="lg" className="gap-2">
                  <Shield className="h-5 w-5" />
                  Contratar seguro seleccionado
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

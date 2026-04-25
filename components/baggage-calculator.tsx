'use client'

import { useState, useMemo } from 'react'
import {
  ArrowLeft,
  Luggage,
  Briefcase,
  Check,
  X,
  AlertTriangle,
  Info,
  Scale,
  Ruler,
  ChevronDown,
} from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { airlinesData } from '@/lib/airlines-data'

interface BaggagePolicy {
  airlineId: string
  airlineName: string
  airlineCode: string
  cabinBag: {
    maxWeight: number // kg
    dimensions: { width: number; height: number; depth: number } // cm
    personalItem: boolean
    personalItemDimensions?: { width: number; height: number; depth: number }
  }
  checkedBag: {
    included: boolean
    maxWeight: number // kg
    maxPieces: number
    overweightFee: number // EUR per kg
    extraBagFee: number // EUR
  }
  notes: string[]
}

const baggagePolicies: BaggagePolicy[] = [
  {
    airlineId: 'singapore-airlines',
    airlineName: 'Singapore Airlines',
    airlineCode: 'SQ',
    cabinBag: {
      maxWeight: 7,
      dimensions: { width: 36, height: 56, depth: 23 },
      personalItem: true,
      personalItemDimensions: { width: 30, height: 40, depth: 10 },
    },
    checkedBag: {
      included: true,
      maxWeight: 30,
      maxPieces: 2,
      overweightFee: 25,
      extraBagFee: 100,
    },
    notes: ['Equipaje generoso en todas las clases', 'Peso extra permitido en Business y First'],
  },
  {
    airlineId: 'emirates',
    airlineName: 'Emirates',
    airlineCode: 'EK',
    cabinBag: {
      maxWeight: 7,
      dimensions: { width: 38, height: 55, depth: 20 },
      personalItem: true,
      personalItemDimensions: { width: 25, height: 45, depth: 15 },
    },
    checkedBag: {
      included: true,
      maxWeight: 30,
      maxPieces: 2,
      overweightFee: 20,
      extraBagFee: 80,
    },
    notes: ['Sistema de franquicia por peso, no por piezas', 'Business: hasta 40 kg incluidos'],
  },
  {
    airlineId: 'qatar-airways',
    airlineName: 'Qatar Airways',
    airlineCode: 'QR',
    cabinBag: {
      maxWeight: 7,
      dimensions: { width: 37, height: 50, depth: 25 },
      personalItem: true,
      personalItemDimensions: { width: 30, height: 40, depth: 15 },
    },
    checkedBag: {
      included: true,
      maxWeight: 30,
      maxPieces: 2,
      overweightFee: 30,
      extraBagFee: 90,
    },
    notes: ['Primera Clase: 50 kg incluidos', 'Estudiantes con 10 kg extra gratis'],
  },
  {
    airlineId: 'ryanair',
    airlineName: 'Ryanair',
    airlineCode: 'FR',
    cabinBag: {
      maxWeight: 10,
      dimensions: { width: 20, height: 40, depth: 25 },
      personalItem: false,
    },
    checkedBag: {
      included: false,
      maxWeight: 20,
      maxPieces: 3,
      overweightFee: 11,
      extraBagFee: 40,
    },
    notes: ['Maleta de mano solo con Priority', 'Bolsa personal pequena gratis (40x20x25 cm)'],
  },
  {
    airlineId: 'easyjet',
    airlineName: 'easyJet',
    airlineCode: 'U2',
    cabinBag: {
      maxWeight: 15,
      dimensions: { width: 20, height: 45, depth: 36 },
      personalItem: false,
    },
    checkedBag: {
      included: false,
      maxWeight: 23,
      maxPieces: 3,
      overweightFee: 14,
      extraBagFee: 35,
    },
    notes: ['Maleta de cabina grande con tarifas Flexi o Plus', 'Equipaje facturado desde 15 kg'],
  },
  {
    airlineId: 'iberia',
    airlineName: 'Iberia',
    airlineCode: 'IB',
    cabinBag: {
      maxWeight: 10,
      dimensions: { width: 40, height: 56, depth: 25 },
      personalItem: true,
      personalItemDimensions: { width: 30, height: 40, depth: 15 },
    },
    checkedBag: {
      included: true,
      maxWeight: 23,
      maxPieces: 1,
      overweightFee: 15,
      extraBagFee: 70,
    },
    notes: ['Basic: solo equipaje de mano', 'Business: 2 maletas de 32 kg cada una'],
  },
  {
    airlineId: 'latam',
    airlineName: 'LATAM Airlines',
    airlineCode: 'LA',
    cabinBag: {
      maxWeight: 10,
      dimensions: { width: 35, height: 55, depth: 25 },
      personalItem: true,
      personalItemDimensions: { width: 35, height: 45, depth: 20 },
    },
    checkedBag: {
      included: true,
      maxWeight: 23,
      maxPieces: 1,
      overweightFee: 12,
      extraBagFee: 60,
    },
    notes: ['Light: solo equipaje de mano', 'Premium Economy: 2 maletas incluidas'],
  },
  {
    airlineId: 'lufthansa',
    airlineName: 'Lufthansa',
    airlineCode: 'LH',
    cabinBag: {
      maxWeight: 8,
      dimensions: { width: 40, height: 55, depth: 23 },
      personalItem: true,
      personalItemDimensions: { width: 30, height: 40, depth: 10 },
    },
    checkedBag: {
      included: true,
      maxWeight: 23,
      maxPieces: 1,
      overweightFee: 20,
      extraBagFee: 75,
    },
    notes: ['Economy Light: sin equipaje facturado', 'Business: 2 maletas de 32 kg'],
  },
]

type BagType = 'cabin' | 'checked'

export function BaggageCalculator() {
  const [selectedAirline, setSelectedAirline] = useState<string>('')
  const [bagType, setBagType] = useState<BagType>('cabin')
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, depth: 0 })
  const [weight, setWeight] = useState(0)
  const [showResults, setShowResults] = useState(false)

  const selectedPolicy = useMemo(() => {
    return baggagePolicies.find((p) => p.airlineId === selectedAirline)
  }, [selectedAirline])

  const checkResult = useMemo(() => {
    if (!selectedPolicy || !showResults) return null

    if (bagType === 'cabin') {
      const policy = selectedPolicy.cabinBag
      const weightOk = weight <= policy.maxWeight
      const dimensionsOk =
        dimensions.width <= policy.dimensions.width &&
        dimensions.height <= policy.dimensions.height &&
        dimensions.depth <= policy.dimensions.depth

      const totalDimensions = dimensions.width + dimensions.height + dimensions.depth
      const maxTotalDimensions = policy.dimensions.width + policy.dimensions.height + policy.dimensions.depth

      return {
        passed: weightOk && dimensionsOk,
        weightOk,
        dimensionsOk,
        weightDiff: weight - policy.maxWeight,
        totalDimensions,
        maxTotalDimensions,
        policy,
      }
    } else {
      const policy = selectedPolicy.checkedBag
      const weightOk = weight <= policy.maxWeight

      return {
        passed: weightOk,
        weightOk,
        dimensionsOk: true, // Usually more flexible for checked bags
        weightDiff: weight - policy.maxWeight,
        overweightCost: weight > policy.maxWeight ? (weight - policy.maxWeight) * policy.overweightFee : 0,
        policy,
      }
    }
  }, [selectedPolicy, bagType, dimensions, weight, showResults])

  const handleCheck = () => {
    if (selectedAirline && (weight > 0 || dimensions.width > 0)) {
      setShowResults(true)
    }
  }

  const handleReset = () => {
    setDimensions({ width: 0, height: 0, depth: 0 })
    setWeight(0)
    setShowResults(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Luggage className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Calculadora de Equipaje</h1>
                <p className="text-sm text-muted-foreground">Verifica si tu maleta cumple las politicas</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Calculator Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Datos de tu equipaje</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Airline Selection */}
            <div>
              <Label className="text-sm">Aerolinea</Label>
              <select
                value={selectedAirline}
                onChange={(e) => {
                  setSelectedAirline(e.target.value)
                  setShowResults(false)
                }}
                className="w-full mt-1.5 p-3 rounded-lg border bg-background"
              >
                <option value="">Selecciona una aerolinea</option>
                {baggagePolicies.map((policy) => (
                  <option key={policy.airlineId} value={policy.airlineId}>
                    {policy.airlineName} ({policy.airlineCode})
                  </option>
                ))}
              </select>
            </div>

            {/* Bag Type */}
            <div>
              <Label className="text-sm mb-2 block">Tipo de equipaje</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setBagType('cabin')
                    setShowResults(false)
                  }}
                  className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                    bagType === 'cabin'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-muted hover:border-primary/50'
                  }`}
                >
                  <Briefcase className="h-5 w-5" />
                  <span className="font-medium">Equipaje de mano</span>
                </button>
                <button
                  onClick={() => {
                    setBagType('checked')
                    setShowResults(false)
                  }}
                  className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                    bagType === 'checked'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-muted hover:border-primary/50'
                  }`}
                >
                  <Luggage className="h-5 w-5" />
                  <span className="font-medium">Equipaje facturado</span>
                </button>
              </div>
            </div>

            {/* Dimensions */}
            {bagType === 'cabin' && (
              <div>
                <Label className="text-sm mb-2 flex items-center gap-2">
                  <Ruler className="h-4 w-4" />
                  Dimensiones (cm)
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Ancho</Label>
                    <Input
                      type="number"
                      min={0}
                      value={dimensions.width || ''}
                      onChange={(e) => {
                        setDimensions({ ...dimensions, width: Number(e.target.value) })
                        setShowResults(false)
                      }}
                      placeholder="cm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Alto</Label>
                    <Input
                      type="number"
                      min={0}
                      value={dimensions.height || ''}
                      onChange={(e) => {
                        setDimensions({ ...dimensions, height: Number(e.target.value) })
                        setShowResults(false)
                      }}
                      placeholder="cm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Profundidad</Label>
                    <Input
                      type="number"
                      min={0}
                      value={dimensions.depth || ''}
                      onChange={(e) => {
                        setDimensions({ ...dimensions, depth: Number(e.target.value) })
                        setShowResults(false)
                      }}
                      placeholder="cm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Weight */}
            <div>
              <Label className="text-sm mb-2 flex items-center gap-2">
                <Scale className="h-4 w-4" />
                Peso (kg)
              </Label>
              <Input
                type="number"
                min={0}
                step={0.1}
                value={weight || ''}
                onChange={(e) => {
                  setWeight(Number(e.target.value))
                  setShowResults(false)
                }}
                placeholder="kg"
                className="max-w-xs"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button onClick={handleCheck} disabled={!selectedAirline} className="flex-1 sm:flex-none">
                Verificar equipaje
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Limpiar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {showResults && checkResult && selectedPolicy && (
          <Card className={checkResult.passed ? 'border-emerald-300' : 'border-red-300'}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${
                    checkResult.passed ? 'bg-emerald-100' : 'bg-red-100'
                  }`}
                >
                  {checkResult.passed ? (
                    <Check className="h-6 w-6 text-emerald-600" />
                  ) : (
                    <X className="h-6 w-6 text-red-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold ${checkResult.passed ? 'text-emerald-700' : 'text-red-700'}`}>
                    {checkResult.passed
                      ? 'Tu equipaje cumple las politicas'
                      : 'Tu equipaje excede los limites'}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedPolicy.airlineName} - {bagType === 'cabin' ? 'Equipaje de mano' : 'Equipaje facturado'}
                  </p>

                  <div className="mt-4 space-y-3">
                    {/* Weight Check */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        <Scale className="h-4 w-4 text-muted-foreground" />
                        <span>Peso</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{weight} kg</span>
                        <span className="text-muted-foreground">/</span>
                        <span className="text-muted-foreground">
                          {bagType === 'cabin'
                            ? selectedPolicy.cabinBag.maxWeight
                            : selectedPolicy.checkedBag.maxWeight}{' '}
                          kg
                        </span>
                        {checkResult.weightOk ? (
                          <Check className="h-5 w-5 text-emerald-500" />
                        ) : (
                          <X className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </div>

                    {/* Dimensions Check (for cabin) */}
                    {bagType === 'cabin' && (
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2">
                          <Ruler className="h-4 w-4 text-muted-foreground" />
                          <span>Dimensiones</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {dimensions.width}x{dimensions.height}x{dimensions.depth} cm
                          </span>
                          <span className="text-muted-foreground">/</span>
                          <span className="text-muted-foreground">
                            {selectedPolicy.cabinBag.dimensions.width}x{selectedPolicy.cabinBag.dimensions.height}x
                            {selectedPolicy.cabinBag.dimensions.depth} cm
                          </span>
                          {checkResult.dimensionsOk ? (
                            <Check className="h-5 w-5 text-emerald-500" />
                          ) : (
                            <X className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </div>
                    )}

                    {/* Overweight Cost */}
                    {!checkResult.weightOk && bagType === 'checked' && 'overweightCost' in checkResult && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 text-amber-800">
                        <AlertTriangle className="h-5 w-5" />
                        <span>
                          Exceso de peso: {checkResult.weightDiff.toFixed(1)} kg - Coste adicional estimado:{' '}
                          <strong>{checkResult.overweightCost.toFixed(2)} EUR</strong>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Policy Details */}
        {selectedPolicy && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="h-5 w-5" />
                Politica de {selectedPolicy.airlineName}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Cabin Bag */}
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">Equipaje de mano</h4>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Peso maximo:</span>
                      <span className="font-medium">{selectedPolicy.cabinBag.maxWeight} kg</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Dimensiones:</span>
                      <span className="font-medium">
                        {selectedPolicy.cabinBag.dimensions.width}x{selectedPolicy.cabinBag.dimensions.height}x
                        {selectedPolicy.cabinBag.dimensions.depth} cm
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Articulo personal:</span>
                      <span className="font-medium">{selectedPolicy.cabinBag.personalItem ? 'Si' : 'No'}</span>
                    </li>
                  </ul>
                </div>

                {/* Checked Bag */}
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Luggage className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">Equipaje facturado</h4>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Incluido:</span>
                      <Badge variant={selectedPolicy.checkedBag.included ? 'default' : 'secondary'}>
                        {selectedPolicy.checkedBag.included ? 'Si' : 'No'}
                      </Badge>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Peso maximo:</span>
                      <span className="font-medium">{selectedPolicy.checkedBag.maxWeight} kg</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Maleta extra:</span>
                      <span className="font-medium">{selectedPolicy.checkedBag.extraBagFee} EUR</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Exceso peso:</span>
                      <span className="font-medium">{selectedPolicy.checkedBag.overweightFee} EUR/kg</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Notes */}
              {selectedPolicy.notes.length > 0 && (
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Notas importantes:</p>
                  <ul className="space-y-1">
                    {selectedPolicy.notes.map((note, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* All Policies Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Comparativa rapida de equipaje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium">Aerolinea</th>
                    <th className="text-center py-3 px-2 font-medium">Mano (kg)</th>
                    <th className="text-center py-3 px-2 font-medium">Facturado</th>
                    <th className="text-center py-3 px-2 font-medium">Peso max (kg)</th>
                  </tr>
                </thead>
                <tbody>
                  {baggagePolicies.map((policy) => (
                    <tr key={policy.airlineId} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-primary font-bold text-xs">
                            {policy.airlineCode}
                          </div>
                          <span className="font-medium">{policy.airlineName}</span>
                        </div>
                      </td>
                      <td className="text-center py-3 px-2">{policy.cabinBag.maxWeight} kg</td>
                      <td className="text-center py-3 px-2">
                        <Badge variant={policy.checkedBag.included ? 'default' : 'secondary'}>
                          {policy.checkedBag.included ? 'Incluido' : 'Pago'}
                        </Badge>
                      </td>
                      <td className="text-center py-3 px-2">{policy.checkedBag.maxWeight} kg</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

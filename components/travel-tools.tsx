"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ArrowLeft,
  DollarSign,
  Plane,
  Calculator,
  ArrowRightLeft,
  Info,
  Loader2,
  RefreshCw,
} from 'lucide-react'
import { popularCurrencies } from '@/lib/currency-api'

// Airline loyalty programs
const loyaltyPrograms = [
  { name: 'Iberia Plus', airline: 'Iberia', milesPerDollar: 1, milesPerKm: 0.5 },
  { name: 'Flying Blue', airline: 'Air France/KLM', milesPerDollar: 1, milesPerKm: 0.5 },
  { name: 'AAdvantage', airline: 'American Airlines', milesPerDollar: 1, milesPerKm: 0.5 },
  { name: 'MileagePlus', airline: 'United Airlines', milesPerDollar: 1, milesPerKm: 0.5 },
  { name: 'SkyMiles', airline: 'Delta', milesPerDollar: 1, milesPerKm: 0.5 },
  { name: 'Miles & More', airline: 'Lufthansa', milesPerDollar: 1, milesPerKm: 0.5 },
  { name: 'Skywards', airline: 'Emirates', milesPerDollar: 1, milesPerKm: 0.5 },
  { name: 'Asia Miles', airline: 'Cathay Pacific', milesPerDollar: 1, milesPerKm: 0.5 },
  { name: 'KrisFlyer', airline: 'Singapore Airlines', milesPerDollar: 1, milesPerKm: 0.5 },
  { name: 'Executive Club', airline: 'British Airways', milesPerDollar: 1, milesPerKm: 0.5 },
]

// Cabin class multipliers
const cabinClasses = [
  { name: 'Economy', multiplier: 0.5 },
  { name: 'Premium Economy', multiplier: 1.0 },
  { name: 'Business', multiplier: 1.5 },
  { name: 'First Class', multiplier: 2.0 },
]

// Popular routes with distances
const popularRoutes = [
  { from: 'Madrid', to: 'New York', distance: 5768 },
  { from: 'London', to: 'Dubai', distance: 5488 },
  { from: 'Paris', to: 'Tokyo', distance: 9713 },
  { from: 'Los Angeles', to: 'Sydney', distance: 12074 },
  { from: 'Miami', to: 'Sao Paulo', distance: 6591 },
  { from: 'Frankfurt', to: 'Singapore', distance: 10288 },
  { from: 'Barcelona', to: 'Buenos Aires', distance: 10404 },
  { from: 'Mexico City', to: 'Madrid', distance: 9073 },
]

export function TravelTools() {
  // Currency converter state
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('EUR')
  const [amount, setAmount] = useState('100')
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null)
  const [exchangeRate, setExchangeRate] = useState<number | null>(null)
  const [rateDate, setRateDate] = useState<string | null>(null)
  const [isLoadingCurrency, setIsLoadingCurrency] = useState(false)

  // Miles calculator state
  const [program, setProgram] = useState(loyaltyPrograms[0].name)
  const [cabinClass, setCabinClass] = useState('Economy')
  const [distance, setDistance] = useState('')
  const [ticketPrice, setTicketPrice] = useState('')

  // Fetch real exchange rate
  const fetchExchangeRate = async () => {
    if (fromCurrency === toCurrency) {
      setConvertedAmount(parseFloat(amount) || 0)
      setExchangeRate(1)
      setRateDate(new Date().toISOString().split('T')[0])
      return
    }

    setIsLoadingCurrency(true)
    try {
      const res = await fetch(
        `/api/currency?action=convert&from=${fromCurrency}&to=${toCurrency}&amount=${amount || 1}`
      )
      const data = await res.json()
      
      if (data.result) {
        setConvertedAmount(data.result)
        setExchangeRate(data.rate)
        setRateDate(data.date)
      }
    } catch (error) {
      console.error('Error fetching exchange rate:', error)
    } finally {
      setIsLoadingCurrency(false)
    }
  }

  // Fetch rate when currencies or amount change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchExchangeRate()
    }, 500)
    
    return () => clearTimeout(timeoutId)
  }, [fromCurrency, toCurrency, amount])

  const swapCurrencies = () => {
    const temp = fromCurrency
    setFromCurrency(toCurrency)
    setToCurrency(temp)
  }

  const calculateMiles = () => {
    const selectedProgram = loyaltyPrograms.find(p => p.name === program)
    const selectedCabin = cabinClasses.find(c => c.name === cabinClass)
    
    if (!selectedProgram || !selectedCabin) return 0
    
    const dist = parseFloat(distance) || 0
    const price = parseFloat(ticketPrice) || 0
    
    const baseMiles = dist * selectedProgram.milesPerKm * selectedCabin.multiplier
    const bonusMiles = price * selectedProgram.milesPerDollar
    
    return Math.round(baseMiles + bonusMiles)
  }

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
              <h1 className="text-xl font-bold">Herramientas de Viaje</h1>
              <p className="text-sm text-muted-foreground">Utilidades para planificar tu viaje</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Tabs defaultValue="currency" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="currency" className="gap-2">
              <DollarSign className="h-4 w-4" />
              Conversor de Monedas
            </TabsTrigger>
            <TabsTrigger value="miles" className="gap-2">
              <Plane className="h-4 w-4" />
              Calculadora de Millas
            </TabsTrigger>
          </TabsList>

          {/* Currency Converter */}
          <TabsContent value="currency">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Conversor de Monedas
                  <span className="ml-auto text-xs font-normal text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                    Datos en tiempo real
                  </span>
                </CardTitle>
                <CardDescription>
                  Convierte precios entre diferentes monedas con tasas actualizadas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-[1fr,auto,1fr]">
                  {/* From Currency */}
                  <div className="space-y-2">
                    <Label>De</Label>
                    <Select value={fromCurrency} onValueChange={setFromCurrency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {popularCurrencies.map((c) => (
                          <SelectItem key={c.code} value={c.code}>
                            {c.symbol} {c.code} - {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Cantidad"
                    />
                  </div>

                  {/* Swap Button */}
                  <div className="flex items-center justify-center pt-8">
                    <Button variant="outline" size="icon" onClick={swapCurrencies}>
                      <ArrowRightLeft className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* To Currency */}
                  <div className="space-y-2">
                    <Label>A</Label>
                    <Select value={toCurrency} onValueChange={setToCurrency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {popularCurrencies.map((c) => (
                          <SelectItem key={c.code} value={c.code}>
                            {c.symbol} {c.code} - {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="h-10 px-3 py-2 border rounded-md bg-muted flex items-center justify-between">
                      {isLoadingCurrency ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <span className="text-lg font-bold">
                          {popularCurrencies.find(c => c.code === toCurrency)?.symbol}
                          {convertedAmount?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg flex items-start gap-3">
                  <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="text-sm text-muted-foreground flex-1">
                    {exchangeRate && rateDate ? (
                      <>
                        <p className="flex items-center gap-2">
                          1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={fetchExchangeRate}
                          >
                            <RefreshCw className="h-3 w-3" />
                          </Button>
                        </p>
                        <p className="mt-1 text-xs">
                          Tasa actualizada: {rateDate} | Fuente: Frankfurter API (BCE)
                        </p>
                      </>
                    ) : (
                      <p>Cargando tasas de cambio...</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Miles Calculator */}
          <TabsContent value="miles">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Calculadora de Millas
                </CardTitle>
                <CardDescription>
                  Calcula cuantas millas acumularas en tu proximo vuelo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Programa de fidelidad</Label>
                    <Select value={program} onValueChange={setProgram}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {loyaltyPrograms.map((p) => (
                          <SelectItem key={p.name} value={p.name}>
                            {p.name} ({p.airline})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Clase de cabina</Label>
                    <Select value={cabinClass} onValueChange={setCabinClass}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {cabinClasses.map((c) => (
                          <SelectItem key={c.name} value={c.name}>
                            {c.name} ({c.multiplier}x)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Distancia del vuelo (km)</Label>
                    <Input
                      type="number"
                      value={distance}
                      onChange={(e) => setDistance(e.target.value)}
                      placeholder="ej: 5000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Precio del billete (USD)</Label>
                    <Input
                      type="number"
                      value={ticketPrice}
                      onChange={(e) => setTicketPrice(e.target.value)}
                      placeholder="ej: 500"
                    />
                  </div>
                </div>

                {/* Result */}
                <div className="p-6 bg-primary/10 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-2">Millas estimadas</p>
                  <p className="text-4xl font-bold text-primary">
                    {calculateMiles().toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    millas {program}
                  </p>
                </div>

                {/* Popular Routes */}
                <div>
                  <Label className="mb-3 block">Rutas populares (haz clic para calcular)</Label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {popularRoutes.map((route) => (
                      <Button
                        key={`${route.from}-${route.to}`}
                        variant="outline"
                        className="justify-between h-auto py-3"
                        onClick={() => setDistance(route.distance.toString())}
                      >
                        <span>{route.from} - {route.to}</span>
                        <span className="text-muted-foreground">{route.distance.toLocaleString()} km</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  ArrowLeft,
  ArrowRight,
  Plane,
  User,
  Armchair,
  Luggage,
  CreditCard,
  Check,
  X,
  Info,
  Plus,
  Minus,
} from 'lucide-react'

type Step = 'flight' | 'passengers' | 'seats' | 'extras' | 'payment' | 'confirmation'

interface Passenger {
  firstName: string
  lastName: string
  email: string
  phone: string
}

interface SeatType {
  id: string
  row: number
  col: string
  type: 'standard' | 'extra' | 'premium' | 'exit'
  price: number
  available: boolean
}

const flightInfo = {
  airline: 'Iberia',
  flightNumber: 'IB3456',
  origin: 'Madrid (MAD)',
  destination: 'Barcelona (BCN)',
  departure: '10:30',
  arrival: '11:45',
  date: '15 Dic 2024',
  duration: '1h 15m',
  aircraft: 'Airbus A320',
  basePrice: 89,
}

const generateSeats = (): SeatType[][] => {
  const rows: SeatType[][] = []
  const cols = ['A', 'B', 'C', 'D', 'E', 'F']
  
  for (let row = 1; row <= 25; row++) {
    const rowSeats: SeatType[] = cols.map(col => {
      let type: SeatType['type'] = 'standard'
      let price = 0
      
      if (row <= 3) {
        type = 'premium'
        price = 35
      } else if (row === 12 || row === 13) {
        type = 'exit'
        price = 25
      } else if (col === 'A' || col === 'F') {
        type = 'extra'
        price = 15
      }
      
      const available = Math.random() > 0.3
      
      return {
        id: `${row}${col}`,
        row,
        col,
        type,
        price,
        available,
      }
    })
    rows.push(rowSeats)
  }
  return rows
}

const extras = [
  { id: 'baggage-23', name: 'Equipaje facturado 23kg', price: 25, icon: Luggage },
  { id: 'baggage-32', name: 'Equipaje facturado 32kg', price: 45, icon: Luggage },
  { id: 'priority', name: 'Embarque prioritario', price: 8, icon: Plane },
  { id: 'insurance', name: 'Seguro de viaje basico', price: 12, icon: Info },
  { id: 'meal', name: 'Menu a bordo', price: 15, icon: Plus },
]

export function BookingSystem() {
  const [step, setStep] = useState<Step>('flight')
  const [passengers, setPassengers] = useState<Passenger[]>([{
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  }])
  const [seats] = useState(generateSeats)
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])
  const [passengerCount, setPassengerCount] = useState(1)

  const steps: { key: Step; label: string; icon: React.ElementType }[] = [
    { key: 'flight', label: 'Vuelo', icon: Plane },
    { key: 'passengers', label: 'Pasajeros', icon: User },
    { key: 'seats', label: 'Asientos', icon: Armchair },
    { key: 'extras', label: 'Extras', icon: Luggage },
    { key: 'payment', label: 'Pago', icon: CreditCard },
    { key: 'confirmation', label: 'Confirmacion', icon: Check },
  ]

  const currentStepIndex = steps.findIndex(s => s.key === step)

  const toggleSeat = (seatId: string) => {
    const seat = seats.flat().find(s => s.id === seatId)
    if (!seat?.available) return

    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(id => id !== seatId)
      }
      if (prev.length < passengerCount) {
        return [...prev, seatId]
      }
      return prev
    })
  }

  const toggleExtra = (extraId: string) => {
    setSelectedExtras(prev =>
      prev.includes(extraId)
        ? prev.filter(id => id !== extraId)
        : [...prev, extraId]
    )
  }

  const updatePassengerCount = (delta: number) => {
    const newCount = Math.max(1, Math.min(6, passengerCount + delta))
    setPassengerCount(newCount)
    
    while (passengers.length < newCount) {
      setPassengers(prev => [...prev, { firstName: '', lastName: '', email: '', phone: '' }])
    }
    while (passengers.length > newCount) {
      setPassengers(prev => prev.slice(0, -1))
    }
    
    if (selectedSeats.length > newCount) {
      setSelectedSeats(prev => prev.slice(0, newCount))
    }
  }

  const updatePassenger = (index: number, field: keyof Passenger, value: string) => {
    setPassengers(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const calculateTotal = () => {
    let total = flightInfo.basePrice * passengerCount
    
    selectedSeats.forEach(seatId => {
      const seat = seats.flat().find(s => s.id === seatId)
      if (seat) total += seat.price
    })
    
    selectedExtras.forEach(extraId => {
      const extra = extras.find(e => e.id === extraId)
      if (extra) total += extra.price * passengerCount
    })
    
    return total
  }

  const getSeatColor = (seat: SeatType) => {
    if (!seat.available) return 'bg-muted text-muted-foreground cursor-not-allowed'
    if (selectedSeats.includes(seat.id)) return 'bg-primary text-primary-foreground'
    
    switch (seat.type) {
      case 'premium': return 'bg-amber-100 hover:bg-amber-200 text-amber-900 dark:bg-amber-900/30 dark:text-amber-300'
      case 'exit': return 'bg-green-100 hover:bg-green-200 text-green-900 dark:bg-green-900/30 dark:text-green-300'
      case 'extra': return 'bg-blue-100 hover:bg-blue-200 text-blue-900 dark:bg-blue-900/30 dark:text-blue-300'
      default: return 'bg-secondary hover:bg-secondary/80'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
          <Link href="/vuelos">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Reservar Vuelo</h1>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => (
              <div
                key={s.key}
                className={`flex items-center gap-2 ${
                  i <= currentStepIndex ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    i < currentStepIndex
                      ? 'bg-primary text-primary-foreground'
                      : i === currentStepIndex
                      ? 'border-2 border-primary'
                      : 'border-2 border-muted'
                  }`}
                >
                  {i < currentStepIndex ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <s.icon className="h-4 w-4" />
                  )}
                </div>
                <span className="hidden text-sm font-medium sm:block">{s.label}</span>
                {i < steps.length - 1 && (
                  <ArrowRight className="mx-2 h-4 w-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr,320px]">
          {/* Main Content */}
          <div>
            {/* Step 1: Flight */}
            {step === 'flight' && (
              <Card>
                <CardHeader>
                  <CardTitle>Detalles del vuelo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Plane className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold">{flightInfo.airline}</div>
                        <div className="text-sm text-muted-foreground">{flightInfo.flightNumber}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{flightInfo.date}</div>
                      <div className="text-sm text-muted-foreground">{flightInfo.aircraft}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{flightInfo.departure}</div>
                      <div className="text-sm text-muted-foreground">{flightInfo.origin}</div>
                    </div>
                    <div className="flex flex-1 flex-col items-center px-4">
                      <div className="text-xs text-muted-foreground">{flightInfo.duration}</div>
                      <div className="my-2 h-px w-full bg-border" />
                      <Plane className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{flightInfo.arrival}</div>
                      <div className="text-sm text-muted-foreground">{flightInfo.destination}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Numero de pasajeros</Label>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updatePassengerCount(-1)}
                        disabled={passengerCount <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-xl font-semibold">{passengerCount}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updatePassengerCount(1)}
                        disabled={passengerCount >= 6}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Button className="w-full" onClick={() => setStep('passengers')}>
                    Continuar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Passengers */}
            {step === 'passengers' && (
              <div className="space-y-6">
                {passengers.map((passenger, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">Pasajero {index + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Nombre</Label>
                        <Input
                          value={passenger.firstName}
                          onChange={(e) => updatePassenger(index, 'firstName', e.target.value)}
                          placeholder="Nombre"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Apellido</Label>
                        <Input
                          value={passenger.lastName}
                          onChange={(e) => updatePassenger(index, 'lastName', e.target.value)}
                          placeholder="Apellido"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={passenger.email}
                          onChange={(e) => updatePassenger(index, 'email', e.target.value)}
                          placeholder="correo@ejemplo.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Telefono</Label>
                        <Input
                          type="tel"
                          value={passenger.phone}
                          onChange={(e) => updatePassenger(index, 'phone', e.target.value)}
                          placeholder="+34 600 000 000"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setStep('flight')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver
                  </Button>
                  <Button className="flex-1" onClick={() => setStep('seats')}>
                    Continuar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Seats */}
            {step === 'seats' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Seleccionar asientos</span>
                    <Badge variant="secondary">
                      {selectedSeats.length}/{passengerCount} seleccionados
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Legend */}
                  <div className="mb-6 flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded bg-secondary" />
                      <span>Estandar</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded bg-blue-200 dark:bg-blue-900/50" />
                      <span>Ventana (+15 EUR)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded bg-green-200 dark:bg-green-900/50" />
                      <span>Salida (+25 EUR)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded bg-amber-200 dark:bg-amber-900/50" />
                      <span>Premium (+35 EUR)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded bg-muted" />
                      <span>Ocupado</span>
                    </div>
                  </div>

                  {/* Seat Map */}
                  <div className="mx-auto max-w-md">
                    {/* Column Headers */}
                    <div className="mb-2 flex justify-center gap-1 text-xs font-medium text-muted-foreground">
                      <span className="w-7 text-center">A</span>
                      <span className="w-7 text-center">B</span>
                      <span className="w-7 text-center">C</span>
                      <span className="w-4" />
                      <span className="w-7 text-center">D</span>
                      <span className="w-7 text-center">E</span>
                      <span className="w-7 text-center">F</span>
                    </div>

                    <div className="max-h-96 space-y-1 overflow-y-auto rounded-lg border p-4">
                      {seats.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex items-center justify-center gap-1">
                          {row.slice(0, 3).map(seat => (
                            <button
                              key={seat.id}
                              onClick={() => toggleSeat(seat.id)}
                              disabled={!seat.available}
                              className={`h-7 w-7 rounded text-xs font-medium transition-colors ${getSeatColor(seat)}`}
                            >
                              {seat.row}
                            </button>
                          ))}
                          <span className="w-4 text-center text-xs text-muted-foreground">
                            {rowIndex + 1}
                          </span>
                          {row.slice(3).map(seat => (
                            <button
                              key={seat.id}
                              onClick={() => toggleSeat(seat.id)}
                              disabled={!seat.available}
                              className={`h-7 w-7 rounded text-xs font-medium transition-colors ${getSeatColor(seat)}`}
                            >
                              {seat.row}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex gap-4">
                    <Button variant="outline" onClick={() => setStep('passengers')}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Volver
                    </Button>
                    <Button className="flex-1" onClick={() => setStep('extras')}>
                      {selectedSeats.length === 0 ? 'Omitir' : 'Continuar'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Extras */}
            {step === 'extras' && (
              <Card>
                <CardHeader>
                  <CardTitle>Servicios adicionales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {extras.map(extra => (
                    <div
                      key={extra.id}
                      className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors ${
                        selectedExtras.includes(extra.id)
                          ? 'border-primary bg-primary/5'
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => toggleExtra(extra.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox checked={selectedExtras.includes(extra.id)} />
                        <extra.icon className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">{extra.name}</span>
                      </div>
                      <span className="font-semibold">{extra.price} EUR</span>
                    </div>
                  ))}

                  <div className="flex gap-4 pt-4">
                    <Button variant="outline" onClick={() => setStep('seats')}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Volver
                    </Button>
                    <Button className="flex-1" onClick={() => setStep('payment')}>
                      Continuar al pago
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 5: Payment */}
            {step === 'payment' && (
              <Card>
                <CardHeader>
                  <CardTitle>Datos de pago</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Numero de tarjeta</Label>
                    <Input placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Fecha de expiracion</Label>
                      <Input placeholder="MM/AA" />
                    </div>
                    <div className="space-y-2">
                      <Label>CVV</Label>
                      <Input placeholder="123" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Nombre en la tarjeta</Label>
                    <Input placeholder="NOMBRE APELLIDO" />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button variant="outline" onClick={() => setStep('extras')}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Volver
                    </Button>
                    <Button className="flex-1" onClick={() => setStep('confirmation')}>
                      Pagar {calculateTotal()} EUR
                      <CreditCard className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 6: Confirmation */}
            {step === 'confirmation' && (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="mb-2 text-2xl font-bold">Reserva confirmada</h2>
                  <p className="mb-6 text-muted-foreground">
                    Tu reserva ha sido procesada exitosamente. Recibiras un email con los detalles.
                  </p>
                  <div className="mb-6 inline-flex items-center gap-2 rounded-lg bg-muted px-4 py-2">
                    <span className="text-muted-foreground">Codigo de reserva:</span>
                    <span className="font-mono font-bold">FLY{Math.random().toString(36).substring(2, 8).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-center gap-4">
                    <Link href="/">
                      <Button variant="outline">Volver al inicio</Button>
                    </Link>
                    <Link href="/dashboard">
                      <Button>Ver mis reservas</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Order Summary */}
          {step !== 'confirmation' && (
            <div className="lg:sticky lg:top-24 lg:self-start">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Resumen</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vuelo x{passengerCount}</span>
                    <span>{flightInfo.basePrice * passengerCount} EUR</span>
                  </div>

                  {selectedSeats.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Asientos ({selectedSeats.join(', ')})</span>
                      <span>
                        {selectedSeats.reduce((total, seatId) => {
                          const seat = seats.flat().find(s => s.id === seatId)
                          return total + (seat?.price || 0)
                        }, 0)} EUR
                      </span>
                    </div>
                  )}

                  {selectedExtras.map(extraId => {
                    const extra = extras.find(e => e.id === extraId)
                    if (!extra) return null
                    return (
                      <div key={extraId} className="flex justify-between">
                        <span className="text-muted-foreground">{extra.name}</span>
                        <span>{extra.price * passengerCount} EUR</span>
                      </div>
                    )
                  })}

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">{calculateTotal()} EUR</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

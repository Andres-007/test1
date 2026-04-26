'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  MapPin,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  ArrowLeftRight,
  Plane,
} from 'lucide-react'
import { cities, getTimeDifference, formatTimeDifference, type City } from '@/lib/timezone-data'

export function TimezoneCalculator() {
  const [originCity, setOriginCity] = useState<City>(cities[0])
  const [destinationCity, setDestinationCity] = useState<City>(cities[8])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedTime, setSelectedTime] = useState('12:00')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const timeDiff = getTimeDifference(originCity, destinationCity)

  const getTimeInCity = (city: City): Date => {
    const utc = currentTime.getTime() + (currentTime.getTimezoneOffset() * 60000)
    return new Date(utc + (city.offset * 3600000))
  }

  const originTime = getTimeInCity(originCity)
  const destTime = getTimeInCity(destinationCity)

  const parseSelectedTime = () => {
    const [hours, minutes] = selectedTime.split(':').map(Number)
    const date = new Date(originTime)
    date.setHours(hours, minutes, 0, 0)
    return date
  }

  const convertTime = (fromCity: City, toCity: City, time: Date): Date => {
    const diff = toCity.offset - fromCity.offset
    return new Date(time.getTime() + diff * 3600000)
  }

  const selectedOriginTime = parseSelectedTime()
  const selectedDestTime = convertTime(originCity, destinationCity, selectedOriginTime)

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
  }

  const formatTimeShort = (date: Date): string => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }

  const getTimeOfDay = (date: Date): { icon: React.ElementType; label: string; color: string } => {
    const hour = date.getHours()
    if (hour >= 6 && hour < 12) return { icon: Sunrise, label: 'Manana', color: 'text-orange-500' }
    if (hour >= 12 && hour < 18) return { icon: Sun, label: 'Tarde', color: 'text-yellow-500' }
    if (hour >= 18 && hour < 21) return { icon: Sunset, label: 'Atardecer', color: 'text-orange-600' }
    return { icon: Moon, label: 'Noche', color: 'text-blue-500' }
  }

  const swapCities = () => {
    const temp = originCity
    setOriginCity(destinationCity)
    setDestinationCity(temp)
  }

  const getDayDifference = (): string => {
    const originDay = selectedOriginTime.getDate()
    const destDay = selectedDestTime.getDate()
    if (destDay > originDay) return '(dia siguiente)'
    if (destDay < originDay) return '(dia anterior)'
    return ''
  }

  const OriginTimeOfDay = getTimeOfDay(originTime)
  const DestTimeOfDay = getTimeOfDay(destTime)

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
            <Clock className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Diferencia Horaria</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* City Selection */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid items-center gap-4 md:grid-cols-[1fr,auto,1fr]">
              {/* Origin */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  Origen
                </Label>
                <Select
                  value={originCity.code}
                  onValueChange={(code) => {
                    const city = cities.find(c => c.code === code)
                    if (city) setOriginCity(city)
                  }}
                >
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map(city => (
                      <SelectItem key={city.code} value={city.code}>
                        {city.name}, {city.country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={swapCities}
                  className="rounded-full"
                >
                  <ArrowLeftRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Destination */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-muted-foreground">
                  <Plane className="h-4 w-4" />
                  Destino
                </Label>
                <Select
                  value={destinationCity.code}
                  onValueChange={(code) => {
                    const city = cities.find(c => c.code === code)
                    if (city) setDestinationCity(city)
                  }}
                >
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map(city => (
                      <SelectItem key={city.code} value={city.code}>
                        {city.name}, {city.country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Time Difference */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="font-medium text-primary">
                  {formatTimeDifference(timeDiff)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Clocks */}
        <div className="mb-8 grid gap-6 md:grid-cols-2">
          {/* Origin Clock */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-base">
                <span>{originCity.name}</span>
                <div className={`flex items-center gap-1 text-sm ${OriginTimeOfDay.color}`}>
                  <OriginTimeOfDay.icon className="h-4 w-4" />
                  {OriginTimeOfDay.label}
                </div>
              </CardTitle>
              <p className="text-sm text-muted-foreground">{originCity.country}</p>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-5xl font-bold tabular-nums tracking-tight">
                  {formatTime(originTime)}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  UTC {originCity.offset >= 0 ? '+' : ''}{originCity.offset}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Destination Clock */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-base">
                <span>{destinationCity.name}</span>
                <div className={`flex items-center gap-1 text-sm ${DestTimeOfDay.color}`}>
                  <DestTimeOfDay.icon className="h-4 w-4" />
                  {DestTimeOfDay.label}
                </div>
              </CardTitle>
              <p className="text-sm text-muted-foreground">{destinationCity.country}</p>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-5xl font-bold tabular-nums tracking-tight">
                  {formatTime(destTime)}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  UTC {destinationCity.offset >= 0 ? '+' : ''}{destinationCity.offset}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Time Converter */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5" />
              Convertir hora especifica
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid items-end gap-6 md:grid-cols-[1fr,auto,1fr]">
              <div className="space-y-2">
                <Label>Hora en {originCity.name}</Label>
                <Input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="h-12 text-center text-lg"
                />
              </div>

              <div className="flex justify-center pb-3">
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>

              <div className="space-y-2">
                <Label>Hora en {destinationCity.name}</Label>
                <div className="flex h-12 items-center justify-center rounded-lg border bg-muted/50 text-lg font-semibold">
                  {formatTimeShort(selectedDestTime)}
                  {getDayDifference() && (
                    <span className="ml-2 text-xs font-normal text-muted-foreground">
                      {getDayDifference()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Common time conversions */}
            <div className="mt-6">
              <h4 className="mb-3 text-sm font-medium text-muted-foreground">Conversiones rapidas</h4>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {['08:00', '12:00', '18:00', '22:00'].map(time => {
                  const [h, m] = time.split(':').map(Number)
                  const date = new Date()
                  date.setHours(h, m, 0, 0)
                  const converted = convertTime(originCity, destinationCity, date)
                  return (
                    <Button
                      key={time}
                      variant="outline"
                      className="flex-col h-auto py-3"
                      onClick={() => setSelectedTime(time)}
                    >
                      <span className="text-sm">{time}</span>
                      <ArrowRight className="my-1 h-3 w-3" />
                      <span className="text-sm font-semibold">{formatTimeShort(converted)}</span>
                    </Button>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Jet Lag Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Consejos para el Jet Lag</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-muted-foreground">
              {Math.abs(timeDiff) <= 3 && (
                <p>
                  Con una diferencia de {Math.abs(timeDiff)} horas, el jet lag sera minimo. 
                  Tu cuerpo deberia adaptarse en 1-2 dias.
                </p>
              )}
              {Math.abs(timeDiff) > 3 && Math.abs(timeDiff) <= 6 && (
                <p>
                  Con una diferencia de {Math.abs(timeDiff)} horas, experimentaras jet lag moderado. 
                  Intenta ajustar tu horario de sueno unos dias antes del viaje.
                </p>
              )}
              {Math.abs(timeDiff) > 6 && (
                <div className="space-y-2">
                  <p>
                    Con una diferencia de {Math.abs(timeDiff)} horas, el jet lag puede ser significativo. 
                    Aqui algunos consejos:
                  </p>
                  <ul className="ml-4 list-disc space-y-1">
                    <li>Ajusta tu reloj al horario de destino al subir al avion</li>
                    <li>Mantente hidratado durante el vuelo</li>
                    <li>Exponerte a la luz natural al llegar</li>
                    <li>Evita dormir hasta la noche local</li>
                    <li>El cuerpo se adapta aprox. 1 hora por dia</li>
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
  FileText,
  Syringe,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Cloud,
  Thermometer,
  Droplets,
} from 'lucide-react'

interface Country {
  code: string
  name: string
  flag: string
}

interface VisaRequirement {
  required: boolean
  type: string
  duration: string
  cost: string
  processingTime: string
  notes: string[]
}

interface VaccineRequirement {
  name: string
  required: boolean
  recommended: boolean
  notes: string
}

interface TravelInfo {
  destination: Country
  visa: VisaRequirement
  vaccines: VaccineRequirement[]
  passportValidity: string
  currency: string
  language: string
  timezone: string
  weather: {
    current: string
    temperature: number
    humidity: number
    season: string
  }
}

const countries: Country[] = [
  { code: 'US', name: 'Estados Unidos', flag: '🇺🇸' },
  { code: 'GB', name: 'Reino Unido', flag: '🇬🇧' },
  { code: 'FR', name: 'Francia', flag: '🇫🇷' },
  { code: 'DE', name: 'Alemania', flag: '🇩🇪' },
  { code: 'JP', name: 'Japon', flag: '🇯🇵' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'BR', name: 'Brasil', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'TH', name: 'Tailandia', flag: '🇹🇭' },
  { code: 'AE', name: 'Emiratos Arabes Unidos', flag: '🇦🇪' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
]

const originCountries: Country[] = [
  { code: 'ES', name: 'Espana', flag: '🇪🇸' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪' },
]

// Simulated travel info based on origin and destination
const getTravelInfo = (origin: string, destination: string): TravelInfo | null => {
  const destCountry = countries.find(c => c.code === destination)
  if (!destCountry) return null

  // Simulate different requirements based on destination
  const visaRequired = ['US', 'AU', 'CN', 'IN'].includes(destination)
  
  return {
    destination: destCountry,
    visa: {
      required: visaRequired,
      type: visaRequired ? 'Visa de turista' : 'No requerida',
      duration: visaRequired ? '90 dias' : 'Hasta 90 dias sin visa',
      cost: visaRequired ? '$160 USD' : 'Gratis',
      processingTime: visaRequired ? '3-5 dias habiles' : 'N/A',
      notes: visaRequired 
        ? ['Cita previa en embajada requerida', 'Pasaporte vigente minimo 6 meses', 'Prueba de fondos economicos']
        : ['Pasaporte vigente requerido', 'Boleto de regreso puede ser solicitado'],
    },
    vaccines: [
      { 
        name: 'COVID-19', 
        required: false, 
        recommended: true, 
        notes: 'Ya no es obligatoria en la mayoria de paises' 
      },
      { 
        name: 'Fiebre Amarilla', 
        required: ['BR', 'TH'].includes(destination), 
        recommended: ['BR', 'TH', 'IN'].includes(destination),
        notes: destination === 'BR' ? 'Requerida para algunas regiones' : 'Consultar areas especificas'
      },
      { 
        name: 'Hepatitis A', 
        required: false, 
        recommended: ['TH', 'IN', 'MX', 'BR'].includes(destination),
        notes: 'Recomendada para viajeros'
      },
      { 
        name: 'Tetanos', 
        required: false, 
        recommended: true,
        notes: 'Verificar que este al dia'
      },
    ],
    passportValidity: '6 meses minimo desde la fecha de entrada',
    currency: getCurrency(destination),
    language: getLanguage(destination),
    timezone: getTimezone(destination),
    weather: getWeather(destination),
  }
}

const getCurrency = (code: string): string => {
  const currencies: Record<string, string> = {
    US: 'Dolar estadounidense (USD)',
    GB: 'Libra esterlina (GBP)',
    FR: 'Euro (EUR)',
    DE: 'Euro (EUR)',
    JP: 'Yen japones (JPY)',
    AU: 'Dolar australiano (AUD)',
    BR: 'Real brasileno (BRL)',
    MX: 'Peso mexicano (MXN)',
    TH: 'Baht tailandes (THB)',
    AE: 'Dirham (AED)',
    IN: 'Rupia india (INR)',
    CN: 'Yuan chino (CNY)',
  }
  return currencies[code] || 'Moneda local'
}

const getLanguage = (code: string): string => {
  const languages: Record<string, string> = {
    US: 'Ingles',
    GB: 'Ingles',
    FR: 'Frances',
    DE: 'Aleman',
    JP: 'Japones',
    AU: 'Ingles',
    BR: 'Portugues',
    MX: 'Espanol',
    TH: 'Tailandes',
    AE: 'Arabe (Ingles ampliamente hablado)',
    IN: 'Hindi, Ingles',
    CN: 'Mandarin',
  }
  return languages[code] || 'Idioma local'
}

const getTimezone = (code: string): string => {
  const timezones: Record<string, string> = {
    US: 'UTC-5 a UTC-10',
    GB: 'UTC+0 (GMT)',
    FR: 'UTC+1 (CET)',
    DE: 'UTC+1 (CET)',
    JP: 'UTC+9 (JST)',
    AU: 'UTC+8 a UTC+11',
    BR: 'UTC-3 a UTC-5',
    MX: 'UTC-6 a UTC-8',
    TH: 'UTC+7 (ICT)',
    AE: 'UTC+4 (GST)',
    IN: 'UTC+5:30 (IST)',
    CN: 'UTC+8 (CST)',
  }
  return timezones[code] || 'Verificar zona horaria'
}

const getWeather = (code: string) => {
  const weathers: Record<string, { current: string; temperature: number; humidity: number; season: string }> = {
    US: { current: 'Variado', temperature: 18, humidity: 60, season: 'Primavera' },
    GB: { current: 'Nublado', temperature: 12, humidity: 80, season: 'Primavera' },
    FR: { current: 'Parcialmente nublado', temperature: 15, humidity: 65, season: 'Primavera' },
    DE: { current: 'Nublado', temperature: 13, humidity: 70, season: 'Primavera' },
    JP: { current: 'Soleado', temperature: 20, humidity: 55, season: 'Primavera (Hanami)' },
    AU: { current: 'Soleado', temperature: 22, humidity: 50, season: 'Otono' },
    BR: { current: 'Caluroso', temperature: 28, humidity: 75, season: 'Otono' },
    MX: { current: 'Soleado', temperature: 25, humidity: 45, season: 'Primavera' },
    TH: { current: 'Caluroso', temperature: 32, humidity: 80, season: 'Verano' },
    AE: { current: 'Soleado', temperature: 35, humidity: 40, season: 'Primavera' },
    IN: { current: 'Caluroso', temperature: 38, humidity: 35, season: 'Verano' },
    CN: { current: 'Variado', temperature: 20, humidity: 55, season: 'Primavera' },
  }
  return weathers[code] || { current: 'Consultar', temperature: 20, humidity: 50, season: 'Variado' }
}

export function TravelRequirements() {
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [travelInfo, setTravelInfo] = useState<TravelInfo | null>(null)

  const handleSearch = () => {
    if (origin && destination) {
      const info = getTravelInfo(origin, destination)
      setTravelInfo(info)
    }
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
              <h1 className="text-xl font-bold">Requisitos de Viaje</h1>
              <p className="text-sm text-muted-foreground">Visa, vacunas y documentacion</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Consultar requisitos</CardTitle>
            <CardDescription>Selecciona tu pais de origen y destino</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-[1fr,1fr,auto]">
              <div className="space-y-2">
                <label className="text-sm font-medium">Pais de origen</label>
                <Select value={origin} onValueChange={setOrigin}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu pais" />
                  </SelectTrigger>
                  <SelectContent>
                    {originCountries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.flag} {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Pais de destino</label>
                <Select value={destination} onValueChange={setDestination}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona destino" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.flag} {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button onClick={handleSearch} disabled={!origin || !destination} className="w-full md:w-auto">
                  Consultar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {travelInfo && (
          <div className="space-y-6">
            {/* Destination Header */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{travelInfo.destination.flag}</span>
                  <div>
                    <h2 className="text-2xl font-bold">{travelInfo.destination.name}</h2>
                    <p className="text-muted-foreground">
                      {travelInfo.language} | {travelInfo.currency}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Visa Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Requisitos de Visa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
                  {travelInfo.visa.required ? (
                    <AlertTriangle className="h-6 w-6 text-yellow-500" />
                  ) : (
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  )}
                  <div>
                    <p className="font-semibold">{travelInfo.visa.type}</p>
                    <p className="text-sm text-muted-foreground">{travelInfo.visa.duration}</p>
                  </div>
                  {travelInfo.visa.required && (
                    <Badge className="ml-auto">{travelInfo.visa.cost}</Badge>
                  )}
                </div>

                {travelInfo.visa.required && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Tiempo de procesamiento: {travelInfo.visa.processingTime}
                  </div>
                )}

                <div>
                  <p className="font-medium mb-2">Notas importantes:</p>
                  <ul className="space-y-1">
                    {travelInfo.visa.notes.map((note, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-primary">•</span>
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-sm">
                  <p className="font-medium text-blue-800 dark:text-blue-200">
                    Validez del pasaporte requerida:
                  </p>
                  <p className="text-blue-600 dark:text-blue-400">{travelInfo.passportValidity}</p>
                </div>
              </CardContent>
            </Card>

            {/* Vaccines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Syringe className="h-5 w-5" />
                  Vacunas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {travelInfo.vaccines.map((vaccine) => (
                    <div key={vaccine.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {vaccine.required ? (
                          <XCircle className="h-5 w-5 text-red-500" />
                        ) : vaccine.recommended ? (
                          <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        ) : (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        )}
                        <div>
                          <p className="font-medium">{vaccine.name}</p>
                          <p className="text-sm text-muted-foreground">{vaccine.notes}</p>
                        </div>
                      </div>
                      <Badge variant={vaccine.required ? 'destructive' : vaccine.recommended ? 'secondary' : 'outline'}>
                        {vaccine.required ? 'Obligatoria' : vaccine.recommended ? 'Recomendada' : 'Opcional'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weather */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-5 w-5" />
                  Clima actual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                    <Thermometer className="h-6 w-6 text-orange-500" />
                    <div>
                      <p className="text-2xl font-bold">{travelInfo.weather.temperature}°C</p>
                      <p className="text-sm text-muted-foreground">Temperatura</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                    <Droplets className="h-6 w-6 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">{travelInfo.weather.humidity}%</p>
                      <p className="text-sm text-muted-foreground">Humedad</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                    <Cloud className="h-6 w-6 text-gray-500" />
                    <div>
                      <p className="text-lg font-bold">{travelInfo.weather.current}</p>
                      <p className="text-sm text-muted-foreground">{travelInfo.weather.season}</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Zona horaria: {travelInfo.timezone}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}

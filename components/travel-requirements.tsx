"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/theme-toggle'
import { Input } from '@/components/ui/input'
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
  Search,
  Loader2,
  Globe,
  MapPin,
  Users,
  Languages,
  Banknote,
  Car,
  ExternalLink,
} from 'lucide-react'

interface CountryInfo {
  name: string
  officialName: string
  capital: string[]
  region: string
  subregion: string
  population: number
  languages: Record<string, string>
  currencies: Record<string, { name: string; symbol: string }>
  timezones: string[]
  flag: string
  maps: {
    googleMaps: string
    openStreetMaps: string
  }
  borders: string[]
  area: number
  continents: string[]
  callingCodes: string[]
  drivingSide: string
}

interface WeatherData {
  city: string
  country: string
  temperature: number
  feelsLike: number
  humidity: number
  description: string
  icon: string
  windSpeed: number
  forecast: {
    date: string
    tempMin: number
    tempMax: number
    description: string
    icon: string
  }[]
}

interface VaccineRequirement {
  name: string
  required: boolean
  recommended: boolean
  notes: string
}

const originCountries = [
  { code: 'ES', name: 'Espana' },
  { code: 'MX', name: 'Mexico' },
  { code: 'AR', name: 'Argentina' },
  { code: 'CO', name: 'Colombia' },
  { code: 'CL', name: 'Chile' },
  { code: 'PE', name: 'Peru' },
  { code: 'US', name: 'Estados Unidos' },
  { code: 'BR', name: 'Brasil' },
]

// Simulated visa requirements (in production, use a visa API)
const getVisaInfo = (origin: string, destination: string) => {
  const visaFreeForEU = ['FR', 'DE', 'IT', 'NL', 'BE', 'PT', 'AT', 'CH']
  const visaRequired = ['US', 'AU', 'CN', 'IN', 'RU', 'SA']
  
  const isVisaFree = visaFreeForEU.includes(destination) && ['ES', 'MX', 'AR', 'CO', 'CL', 'PE'].includes(origin)
  const needsVisa = visaRequired.includes(destination)
  
  return {
    required: needsVisa,
    type: needsVisa ? 'Visa de turista' : isVisaFree ? 'Libre de visa (Schengen)' : 'No requerida',
    duration: needsVisa ? '90 dias' : 'Hasta 90 dias sin visa',
    cost: needsVisa ? '$160 USD aprox.' : 'Gratis',
    processingTime: needsVisa ? '3-10 dias habiles' : 'N/A',
    notes: needsVisa 
      ? ['Cita previa en embajada requerida', 'Pasaporte vigente minimo 6 meses', 'Prueba de fondos economicos']
      : ['Pasaporte vigente requerido', 'Boleto de regreso puede ser solicitado'],
  }
}

// Common vaccines for travel
const getVaccineRequirements = (destination: string): VaccineRequirement[] => {
  const tropicalCountries = ['BR', 'TH', 'IN', 'CO', 'PE', 'KE', 'NG']
  const isTropical = tropicalCountries.includes(destination)
  
  return [
    { 
      name: 'COVID-19', 
      required: false, 
      recommended: true, 
      notes: 'Ya no es obligatoria en la mayoria de paises' 
    },
    { 
      name: 'Fiebre Amarilla', 
      required: isTropical, 
      recommended: isTropical,
      notes: isTropical ? 'Requerida para algunas regiones' : 'No necesaria para este destino'
    },
    { 
      name: 'Hepatitis A', 
      required: false, 
      recommended: isTropical,
      notes: 'Recomendada para viajeros a zonas tropicales'
    },
    { 
      name: 'Tetanos', 
      required: false, 
      recommended: true,
      notes: 'Verificar que este al dia'
    },
    { 
      name: 'Fiebre Tifoidea', 
      required: false, 
      recommended: isTropical,
      notes: isTropical ? 'Recomendada en zonas con agua no potable' : 'Generalmente no necesaria'
    },
  ]
}

export function TravelRequirements() {
  const [origin, setOrigin] = useState('')
  const [destinationSearch, setDestinationSearch] = useState('')
  const [countryInfo, setCountryInfo] = useState<CountryInfo | null>(null)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [isLoadingCountry, setIsLoadingCountry] = useState(false)
  const [isLoadingWeather, setIsLoadingWeather] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchCountry = async () => {
    if (!destinationSearch.trim()) return
    
    setIsLoadingCountry(true)
    setError(null)
    setCountryInfo(null)
    setWeather(null)
    
    try {
      const res = await fetch(`/api/countries?name=${encodeURIComponent(destinationSearch)}`)
      
      if (!res.ok) {
        throw new Error('Pais no encontrado')
      }
      
      const data = await res.json()
      setCountryInfo(data)
      
      // Fetch weather for capital
      if (data.capital && data.capital.length > 0) {
        fetchWeather(data.capital[0])
      }
    } catch (err) {
      setError('No se pudo encontrar el pais. Intenta con otro nombre.')
    } finally {
      setIsLoadingCountry(false)
    }
  }

  const fetchWeather = async (city: string) => {
    setIsLoadingWeather(true)
    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`)
      if (res.ok) {
        const data = await res.json()
        setWeather(data)
      }
    } catch (err) {
      console.error('Error fetching weather:', err)
    } finally {
      setIsLoadingWeather(false)
    }
  }

  const formatPopulation = (pop: number) => {
    if (pop >= 1000000000) return `${(pop / 1000000000).toFixed(1)}B`
    if (pop >= 1000000) return `${(pop / 1000000).toFixed(1)}M`
    if (pop >= 1000) return `${(pop / 1000).toFixed(1)}K`
    return pop.toString()
  }

  const visaInfo = countryInfo ? getVisaInfo(origin, countryInfo.name) : null
  const vaccines = countryInfo ? getVaccineRequirements(countryInfo.name) : []

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
              <p className="text-sm text-muted-foreground">Informacion de paises en tiempo real</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Consultar requisitos
              <span className="ml-auto text-xs font-normal text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                Datos en tiempo real
              </span>
            </CardTitle>
            <CardDescription>Selecciona tu pais de origen y busca el destino</CardDescription>
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
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Pais de destino</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={destinationSearch}
                    onChange={(e) => setDestinationSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && searchCountry()}
                    placeholder="Ej: Japon, Francia, Brasil..."
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex items-end">
                <Button onClick={searchCountry} disabled={!destinationSearch.trim() || isLoadingCountry} className="w-full md:w-auto gap-2">
                  {isLoadingCountry ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  Buscar
                </Button>
              </div>
            </div>
            
            {error && (
              <p className="text-sm text-red-500 mt-3">{error}</p>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {countryInfo && (
          <div className="space-y-6">
            {/* Country Header */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  {countryInfo.flag && (
                    <img 
                      src={countryInfo.flag} 
                      alt={`Bandera de ${countryInfo.name}`}
                      className="w-20 h-14 object-cover rounded shadow"
                    />
                  )}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">{countryInfo.name}</h2>
                    <p className="text-muted-foreground">{countryInfo.officialName}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="secondary">{countryInfo.region}</Badge>
                      {countryInfo.subregion && <Badge variant="outline">{countryInfo.subregion}</Badge>}
                    </div>
                  </div>
                  {countryInfo.maps.googleMaps && (
                    <a href={countryInfo.maps.googleMaps} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Ver mapa
                      </Button>
                    </a>
                  )}
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Capital</p>
                      <p className="text-sm font-medium">{countryInfo.capital?.join(', ') || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Poblacion</p>
                      <p className="text-sm font-medium">{formatPopulation(countryInfo.population)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Languages className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Idiomas</p>
                      <p className="text-sm font-medium">{Object.values(countryInfo.languages || {}).slice(0, 2).join(', ') || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Banknote className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Moneda</p>
                      <p className="text-sm font-medium">
                        {Object.entries(countryInfo.currencies || {}).map(([code, curr]) => `${curr.symbol} ${code}`).join(', ') || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Zona horaria</p>
                      <p className="text-sm font-medium">{countryInfo.timezones?.[0] || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Conduccion</p>
                      <p className="text-sm font-medium">{countryInfo.drivingSide === 'right' ? 'Derecha' : 'Izquierda'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Codigo telefonico</p>
                      <p className="text-sm font-medium">{countryInfo.callingCodes?.[0] || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Visa Requirements */}
            {origin && visaInfo && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Requisitos de Visa
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
                    {visaInfo.required ? (
                      <AlertTriangle className="h-6 w-6 text-yellow-500" />
                    ) : (
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    )}
                    <div>
                      <p className="font-semibold">{visaInfo.type}</p>
                      <p className="text-sm text-muted-foreground">{visaInfo.duration}</p>
                    </div>
                    {visaInfo.required && (
                      <Badge className="ml-auto">{visaInfo.cost}</Badge>
                    )}
                  </div>

                  {visaInfo.required && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Tiempo de procesamiento: {visaInfo.processingTime}
                    </div>
                  )}

                  <div>
                    <p className="font-medium mb-2">Notas importantes:</p>
                    <ul className="space-y-1">
                      {visaInfo.notes.map((note, index) => (
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
                    <p className="text-blue-600 dark:text-blue-400">6 meses minimo desde la fecha de entrada</p>
                  </div>
                </CardContent>
              </Card>
            )}

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
                  {vaccines.map((vaccine) => (
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
                  Clima actual en {countryInfo.capital?.[0] || countryInfo.name}
                  <span className="ml-auto text-xs font-normal text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                    En vivo
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingWeather ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : weather ? (
                  <>
                    <div className="grid gap-4 sm:grid-cols-4">
                      <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                        <img 
                          src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                          alt={weather.description}
                          className="w-12 h-12"
                        />
                        <div>
                          <p className="text-2xl font-bold">{weather.temperature}°C</p>
                          <p className="text-sm text-muted-foreground capitalize">{weather.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                        <Thermometer className="h-6 w-6 text-orange-500" />
                        <div>
                          <p className="text-2xl font-bold">{weather.feelsLike}°C</p>
                          <p className="text-sm text-muted-foreground">Sensacion termica</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                        <Droplets className="h-6 w-6 text-blue-500" />
                        <div>
                          <p className="text-2xl font-bold">{weather.humidity}%</p>
                          <p className="text-sm text-muted-foreground">Humedad</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                        <Cloud className="h-6 w-6 text-gray-500" />
                        <div>
                          <p className="text-2xl font-bold">{weather.windSpeed} km/h</p>
                          <p className="text-sm text-muted-foreground">Viento</p>
                        </div>
                      </div>
                    </div>

                    {/* 5-day forecast */}
                    {weather.forecast && weather.forecast.length > 0 && (
                      <div className="mt-6">
                        <p className="text-sm font-medium mb-3">Pronostico proximos dias</p>
                        <div className="grid grid-cols-5 gap-2">
                          {weather.forecast.map((day, index) => (
                            <div key={index} className="text-center p-2 bg-muted rounded-lg">
                              <p className="text-xs text-muted-foreground">
                                {new Date(day.date).toLocaleDateString('es', { weekday: 'short' })}
                              </p>
                              <img 
                                src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                                alt={day.description}
                                className="w-8 h-8 mx-auto"
                              />
                              <p className="text-sm font-medium">{day.tempMax}°</p>
                              <p className="text-xs text-muted-foreground">{day.tempMin}°</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No se pudo cargar el clima. Intenta de nuevo.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}

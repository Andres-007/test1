"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, 
  Navigation, 
  Loader2, 
  Plane, 
  AlertCircle,
  RefreshCw,
  ArrowRight
} from 'lucide-react'
import { useLocation } from '@/lib/location-context'

export function NearbyAirports() {
  const { location, loading, error, requestLocation } = useLocation()

  const formatDistance = (km: number): string => {
    if (km < 1) {
      return `${Math.round(km * 1000)} m`
    }
    return `${Math.round(km)} km`
  }

  const getRegionColor = (region: string): string => {
    const colors: Record<string, string> = {
      'Europa': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Norteamerica': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      'Centroamerica': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'Caribe': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
      'Sudamerica': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Asia': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'Africa': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'Oceania': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
    }
    return colors[region] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }

  if (!location && !loading && !error) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Navigation className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Encuentra aeropuertos cercanos</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Permite el acceso a tu ubicacion para ver los aeropuertos mas cercanos a ti
              </p>
            </div>
            <Button onClick={requestLocation} className="gap-2">
              <MapPin className="h-4 w-4" />
              Usar mi ubicacion
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Obteniendo tu ubicacion...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <AlertCircle className="h-8 w-8 mx-auto text-destructive" />
            <div>
              <p className="text-destructive font-medium">{error}</p>
              <p className="text-muted-foreground text-sm mt-1">
                Verifica los permisos de tu navegador e intenta de nuevo
              </p>
            </div>
            <Button onClick={requestLocation} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!location) return null

  return (
    <div className="space-y-6">
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Tu ubicacion actual</p>
                <p className="text-sm text-muted-foreground">
                  {location.city}, {location.country}
                </p>
              </div>
            </div>
            <Button onClick={requestLocation} variant="ghost" size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Actualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Plane className="h-5 w-5" />
          Aeropuertos cercanos a ti
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {location.nearbyAirports.map((airport, index) => (
            <Card 
              key={airport.code} 
              className={`transition-all hover:shadow-md ${index === 0 ? 'border-primary ring-1 ring-primary/20' : ''}`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {index === 0 && (
                      <Badge variant="default" className="text-xs">Mas cercano</Badge>
                    )}
                    <Badge variant="outline" className="font-mono text-sm">
                      {airport.code}
                    </Badge>
                  </div>
                  <Badge className={`text-xs ${getRegionColor(airport.region)}`}>
                    {airport.region}
                  </Badge>
                </div>
                <CardTitle className="text-base mt-2">{airport.name}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {airport.city}, {airport.country}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Navigation className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{formatDistance(airport.distance)}</span>
                    <span className="text-muted-foreground">de distancia</span>
                  </div>
                  <Link href={`/vuelos?origin=${airport.code}`}>
                    <Button size="sm" variant="ghost" className="gap-1">
                      Vuelos
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

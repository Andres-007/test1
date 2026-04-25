'use client'

import {
  ArrowLeft,
  Star,
  Plane,
  MapPin,
  Calendar,
  Users,
  Globe,
  Phone,
  ExternalLink,
  Wifi,
  Tv,
  Utensils,
  Luggage,
  Armchair,
  Clock,
  Shield,
  Award,
  TrendingUp,
} from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { type Airline } from '@/lib/airlines-data'
import { getReviewsByAirline, type Review } from '@/lib/reviews-data'

function AirlineLogo({ code }: { code: string }) {
  return (
    <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-3xl">
      {code}
    </div>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 ${
            star <= Math.floor(rating)
              ? 'fill-amber-400 text-amber-400'
              : star - 0.5 <= rating
                ? 'fill-amber-400/50 text-amber-400'
                : 'fill-muted text-muted'
          }`}
        />
      ))}
    </div>
  )
}

function StatCard({ icon: Icon, label, value, subtext }: { icon: any; label: string; value: string | number; subtext?: string }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
        {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
      </div>
    </div>
  )
}

function ProgressBar({ value, label }: { value: number; label: string }) {
  const getColor = (val: number) => {
    if (val >= 90) return 'bg-emerald-500'
    if (val >= 75) return 'bg-amber-500'
    return 'bg-red-400'
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all ${getColor(value)}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

function ReviewPreview({ review }: { review: Review }) {
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
              {review.author.name.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-sm">{review.author.name}</p>
              <p className="text-xs text-muted-foreground">{review.author.country}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-medium">{review.ratings.overall}</span>
          </div>
        </div>
        <p className="font-medium text-sm">{review.title}</p>
        <p className="text-sm text-muted-foreground line-clamp-2">{review.content}</p>
        <p className="text-xs text-muted-foreground">
          {review.route.origin} → {review.route.destination}
        </p>
      </CardContent>
    </Card>
  )
}

export function AirlineDetail({ airline }: { airline: Airline }) {
  const reviews = getReviewsByAirline(airline.id)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-gradient-to-b from-primary/5 to-background">
        <div className="container max-w-5xl mx-auto px-4 py-6">
          <Link
            href="/ranking"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al ranking
          </Link>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <AirlineLogo code={airline.code} />
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold">{airline.name}</h1>
                <Badge variant={airline.type === 'premium' ? 'default' : airline.type === 'low-cost' ? 'secondary' : 'outline'}>
                  {airline.type === 'premium' ? 'Premium' : airline.type === 'low-cost' ? 'Low Cost' : 'Estandar'}
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <StarRating rating={airline.rating} />
                <span className="text-xl font-bold">{airline.rating}</span>
                <span className="text-muted-foreground">({airline.reviews.toLocaleString()} opiniones)</span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {airline.country}
                </span>
                {airline.alliance && (
                  <span className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    {airline.alliance}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Fundada en {airline.fundacion}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button asChild>
                <a href={`https://${airline.contacto.web}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visitar web
                </a>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/comparador?airline=${airline.id}`}>
                  Comparar
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-md">
            <TabsTrigger value="overview">General</TabsTrigger>
            <TabsTrigger value="services">Servicios</TabsTrigger>
            <TabsTrigger value="fleet">Flota</TabsTrigger>
            <TabsTrigger value="reviews">Resenas</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={Plane} label="Aviones" value={airline.flota.aviones} />
              <StatCard icon={MapPin} label="Destinos" value={airline.destinos} />
              <StatCard icon={Clock} label="Edad flota" value={`${airline.flota.edadPromedio} anos`} />
              <StatCard icon={Award} label="Categoria" value={airline.category} />
            </div>

            {/* Highlights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Puntos Destacados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {airline.highlights.map((highlight, i) => (
                    <Badge key={i} variant="secondary" className="text-sm py-1.5">
                      {highlight}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ratings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Puntuaciones por Categoria
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ProgressBar value={airline.stats.puntualidad} label="Puntualidad" />
                <ProgressBar value={airline.stats.servicio} label="Servicio" />
                <ProgressBar value={airline.stats.comida} label="Comida y bebida" />
                <ProgressBar value={airline.stats.entretenimiento} label="Entretenimiento" />
                <ProgressBar value={airline.stats.confort} label="Confort" />
                <ProgressBar value={airline.stats.relacionCalidadPrecio} label="Relacion calidad-precio" />
              </CardContent>
            </Card>

            {/* Hubs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Hubs Principales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {airline.hub.map((hub) => (
                    <Badge key={hub} variant="outline" className="text-sm">
                      {hub}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Servicios a Bordo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className={`flex flex-col items-center gap-2 p-4 rounded-xl ${airline.features.wifi ? 'bg-emerald-50 text-emerald-700' : 'bg-muted text-muted-foreground'}`}>
                    <Wifi className="h-6 w-6" />
                    <span className="text-sm font-medium">WiFi</span>
                    <span className="text-xs">{airline.features.wifi ? 'Disponible' : 'No disponible'}</span>
                  </div>
                  <div className={`flex flex-col items-center gap-2 p-4 rounded-xl ${airline.features.entretenimiento ? 'bg-emerald-50 text-emerald-700' : 'bg-muted text-muted-foreground'}`}>
                    <Tv className="h-6 w-6" />
                    <span className="text-sm font-medium">Entretenimiento</span>
                    <span className="text-xs">{airline.features.entretenimiento ? 'Pantalla personal' : 'No disponible'}</span>
                  </div>
                  <div className={`flex flex-col items-center gap-2 p-4 rounded-xl ${airline.features.comidaIncluida ? 'bg-emerald-50 text-emerald-700' : 'bg-muted text-muted-foreground'}`}>
                    <Utensils className="h-6 w-6" />
                    <span className="text-sm font-medium">Comida</span>
                    <span className="text-xs">{airline.features.comidaIncluida ? 'Incluida' : 'De pago'}</span>
                  </div>
                  <div className={`flex flex-col items-center gap-2 p-4 rounded-xl ${airline.features.loungeAccess ? 'bg-emerald-50 text-emerald-700' : 'bg-muted text-muted-foreground'}`}>
                    <Armchair className="h-6 w-6" />
                    <span className="text-sm font-medium">Lounge</span>
                    <span className="text-xs">{airline.features.loungeAccess ? 'Disponible' : 'No disponible'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Equipaje</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Luggage className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Equipaje de mano</p>
                      <p className="text-sm text-muted-foreground">Incluido en todas las tarifas</p>
                    </div>
                  </div>
                  <Badge>{airline.features.equipajeMano}</Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Luggage className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Equipaje facturado</p>
                      <p className="text-sm text-muted-foreground">Segun tarifa</p>
                    </div>
                  </div>
                  <Badge variant="outline">{airline.features.equipajeFacturado}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Politicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Seleccion de asiento</span>
                  <Badge variant={airline.features.seleccionAsiento === 'gratis' ? 'default' : 'secondary'}>
                    {airline.features.seleccionAsiento === 'gratis' ? 'Gratis' : airline.features.seleccionAsiento === 'pago' ? 'De pago' : 'No disponible'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Cambios sin cargo</span>
                  <Badge variant={airline.features.cambiosGratis ? 'default' : 'secondary'}>
                    {airline.features.cambiosGratis ? 'Si' : 'No'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fleet Tab */}
          <TabsContent value="fleet" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <StatCard icon={Plane} label="Total aviones" value={airline.flota.aviones} />
              <StatCard icon={Clock} label="Edad promedio" value={`${airline.flota.edadPromedio} anos`} />
              <StatCard icon={Shield} label="Tipos de avion" value={airline.flota.tiposAvion.length} />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tipos de Avion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {airline.flota.tiposAvion.map((tipo) => (
                    <div key={tipo} className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                      <Plane className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">{tipo}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            {reviews.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">{reviews.length} resenas de viajeros</p>
                  <Button variant="outline" asChild>
                    <Link href="/resenas">Ver todas las resenas</Link>
                  </Button>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {reviews.map((review) => (
                    <ReviewPreview key={review.id} review={review} />
                  ))}
                </div>
              </>
            ) : (
              <Card className="py-12">
                <CardContent className="text-center text-muted-foreground">
                  <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Sin resenas todavia</p>
                  <p className="text-sm mb-4">Se el primero en compartir tu experiencia</p>
                  <Button asChild>
                    <Link href="/resenas">Escribir resena</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Contact */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold mb-1">Contacto</h3>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    {airline.contacto.web}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {airline.contacto.telefono}
                  </span>
                </div>
              </div>
              <Button asChild>
                <a href={`https://${airline.contacto.web}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ir a la web oficial
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

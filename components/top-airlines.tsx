import { Star, Plane, Shield, Trophy, ArrowLeft } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

interface Airline {
  id: string
  name: string
  logo: string
  rating: number
  reviews: number
  highlights: string[]
  category: string
}

const topAirlines: Airline[] = [
  {
    id: '1',
    name: 'Singapore Airlines',
    logo: 'SQ',
    rating: 4.9,
    reviews: 12847,
    highlights: ['Mejor servicio a bordo', 'Asientos premium', 'Entretenimiento 5 estrellas'],
    category: 'Mejor Overall',
  },
  {
    id: '2',
    name: 'Qatar Airways',
    logo: 'QR',
    rating: 4.8,
    reviews: 10234,
    highlights: ['Clase business excepcional', 'Lounge VIP', 'Gastronomia gourmet'],
    category: 'Mejor Business',
  },
  {
    id: '3',
    name: 'Emirates',
    logo: 'EK',
    rating: 4.8,
    reviews: 15672,
    highlights: ['Suite privada', 'Bar a bordo', 'Conectividad WiFi'],
    category: 'Mejor Lujo',
  },
  {
    id: '4',
    name: 'ANA All Nippon',
    logo: 'NH',
    rating: 4.7,
    reviews: 8934,
    highlights: ['Puntualidad impecable', 'Servicio japones', 'Limpieza excepcional'],
    category: 'Mejor Puntualidad',
  },
  {
    id: '5',
    name: 'Cathay Pacific',
    logo: 'CX',
    rating: 4.7,
    reviews: 7823,
    highlights: ['Hub en Hong Kong', 'Asientos comodos', 'Tripulacion profesional'],
    category: 'Mejor Asia-Pacifico',
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= Math.floor(rating)
              ? 'fill-amber-400 text-amber-400'
              : star - 0.5 <= rating
                ? 'fill-amber-400/50 text-amber-400'
                : 'fill-muted text-muted'
          }`}
        />
      ))}
      <span className="ml-1 text-base font-semibold text-foreground">{rating}</span>
    </div>
  )
}

function RankBadge({ rank }: { rank: number }) {
  const colors = {
    1: 'bg-amber-400 text-amber-900',
    2: 'bg-slate-300 text-slate-700',
    3: 'bg-orange-400 text-orange-900',
  }
  return (
    <div
      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${colors[rank as keyof typeof colors] || 'bg-muted text-muted-foreground'}`}
    >
      {rank}
    </div>
  )
}

function AirlineLogo({ code }: { code: string }) {
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-base">
      {code}
    </div>
  )
}

export function TopAirlines() {
  return (
    <div className="min-h-screen">
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
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                <Trophy className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Top Aerolineas</h1>
                <p className="text-sm text-muted-foreground">Ranking mundial 2024</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container max-w-4xl mx-auto px-4 py-6">
        <p className="text-muted-foreground mb-6">
          Las aerolineas mejor valoradas segun miles de opiniones de viajeros reales.
        </p>

        {/* Airlines Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {topAirlines.map((airline, index) => (
            <Card
              key={airline.id}
              className={`transition-all hover:shadow-lg hover:border-primary/30 cursor-pointer ${
                index === 0 ? 'border-amber-300 bg-amber-50/30 sm:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start gap-4">
                  <RankBadge rank={index + 1} />
                  <AirlineLogo code={airline.logo} />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h2 className="font-semibold text-foreground text-lg">{airline.name}</h2>
                      <Badge variant="secondary" className="text-xs">
                        {airline.category}
                      </Badge>
                    </div>
                    <StarRating rating={airline.rating} />
                    <p className="text-sm text-muted-foreground mt-1">
                      {airline.reviews.toLocaleString()} opiniones verificadas
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                    Puntos destacados
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {airline.highlights.map((highlight, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        {i === 0 && <Shield className="h-4 w-4 text-primary flex-shrink-0" />}
                        {i === 1 && <Plane className="h-4 w-4 text-primary flex-shrink-0" />}
                        {i === 2 && <Star className="h-4 w-4 text-primary flex-shrink-0" />}
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center border-t pt-6">
          <p className="text-sm text-muted-foreground">
            Datos actualizados semanalmente basados en opiniones de viajeros verificados.
          </p>
        </div>
      </main>
    </div>
  )
}

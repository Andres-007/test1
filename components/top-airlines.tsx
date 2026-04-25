import { Star, Plane, Shield, Clock, Award, Trophy } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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
          className={`h-3.5 w-3.5 ${
            star <= Math.floor(rating)
              ? 'fill-amber-400 text-amber-400'
              : star - 0.5 <= rating
                ? 'fill-amber-400/50 text-amber-400'
                : 'fill-muted text-muted'
          }`}
        />
      ))}
      <span className="ml-1 text-sm font-semibold text-foreground">{rating}</span>
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
      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${colors[rank as keyof typeof colors] || 'bg-muted text-muted-foreground'}`}
    >
      {rank}
    </div>
  )
}

function AirlineLogo({ code }: { code: string }) {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
      {code}
    </div>
  )
}

export function TopAirlines() {
  return (
    <div className="h-full p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
            <Trophy className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Top Aerolineas</h2>
            <p className="text-xs text-muted-foreground">Ranking mundial 2024</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Las aerolineas mejor valoradas segun miles de opiniones de viajeros.
        </p>
      </div>

      {/* Airlines List */}
      <div className="space-y-3">
        {topAirlines.map((airline, index) => (
          <Card
            key={airline.id}
            className={`transition-all hover:shadow-md hover:border-primary/30 cursor-pointer ${
              index === 0 ? 'border-amber-300 bg-amber-50/50' : ''
            }`}
          >
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <RankBadge rank={index + 1} />
                <AirlineLogo code={airline.logo} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-semibold text-foreground text-sm truncate">{airline.name}</h3>
                  </div>
                  <StarRating rating={airline.rating} />
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {airline.reviews.toLocaleString()} opiniones
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t">
                <Badge variant="secondary" className="mb-2 text-xs">
                  {airline.category}
                </Badge>
                <div className="grid grid-cols-1 gap-1">
                  {airline.highlights.slice(0, 2).map((highlight, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                      {i === 0 && <Shield className="h-3 w-3 text-primary flex-shrink-0" />}
                      {i === 1 && <Plane className="h-3 w-3 text-primary flex-shrink-0" />}
                      <span className="truncate">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground">
          Datos actualizados semanalmente
        </p>
      </div>
    </div>
  )
}

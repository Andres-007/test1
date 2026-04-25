import { Star, Plane, Shield, Clock, Award } from 'lucide-react'
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
          className={`h-4 w-4 ${
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

function AirlineLogo({ code }: { code: string }) {
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-lg">
      {code}
    </div>
  )
}

export function TopAirlines() {
  return (
    <section className="py-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20">
            <Award className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Aerolineas Mejor Valoradas</h2>
            <p className="text-sm text-muted-foreground">Basado en miles de opiniones de viajeros</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
        {topAirlines.map((airline, index) => (
          <Card
            key={airline.id}
            className="min-w-[280px] flex-shrink-0 transition-all hover:shadow-md hover:border-primary/30 cursor-pointer"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <AirlineLogo code={airline.logo} />
                    {index === 0 && (
                      <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[10px] font-bold text-amber-900">
                        1
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{airline.name}</h3>
                    <p className="text-xs text-muted-foreground">{airline.reviews.toLocaleString()} opiniones</p>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <StarRating rating={airline.rating} />
              </div>

              <Badge variant="secondary" className="mb-3 text-xs">
                {airline.category}
              </Badge>

              <div className="space-y-1.5">
                {airline.highlights.map((highlight, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                    {i === 0 && <Shield className="h-3 w-3 text-primary" />}
                    {i === 1 && <Plane className="h-3 w-3 text-primary" />}
                    {i === 2 && <Clock className="h-3 w-3 text-primary" />}
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Desliza para ver mas aerolineas destacadas
      </p>
    </section>
  )
}

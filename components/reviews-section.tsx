'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  Star,
  ThumbsUp,
  MessageSquare,
  Check,
  Filter,
  Plus,
  User,
  Plane,
  Calendar,
  ChevronDown,
} from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { sampleReviews, type Review } from '@/lib/reviews-data'
import { airlinesData } from '@/lib/airlines-data'

function StarRating({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizes[size]} ${star <= rating
              ? 'fill-amber-400 text-amber-400'
              : 'fill-muted text-muted'
            }`}
        />
      ))}
    </div>
  )
}

function InteractiveStarRating({
  value,
  onChange,
  label,
}: {
  value: number
  onChange: (value: number) => void
  label: string
}) {
  const [hover, setHover] = useState(0)

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(star)}
            className="p-0.5"
          >
            <Star
              className={`h-5 w-5 transition-colors ${star <= (hover || value)
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-muted text-muted hover:text-amber-300'
                }`}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

function ReviewCard({ review }: { review: Review }) {
  const [helpfulCount, setHelpfulCount] = useState(review.helpful)
  const [hasVoted, setHasVoted] = useState(false)

  const handleHelpful = () => {
    if (!hasVoted) {
      setHelpfulCount((prev) => prev + 1)
      setHasVoted(true)
    }
  }

  const travelerTypeLabels = {
    business: 'Viajero de negocios',
    leisure: 'Viajero de ocio',
    solo: 'Viajero solo',
    family: 'Viajero en familia',
  }

  const cabinLabels = {
    economy: 'Turista',
    'premium-economy': 'Turista Premium',
    business: 'Business',
    first: 'Primera Clase',
  }

  return (
    <Card>
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
              {review.author.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">{review.author.name}</p>
                {review.verified && (
                  <Badge variant="secondary" className="gap-1 text-xs">
                    <Check className="h-3 w-3" /> Verificado
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {review.author.country} - {travelerTypeLabels[review.author.travelerType]}
              </p>
            </div>
          </div>
          <div className="text-right">
            <StarRating rating={review.ratings.overall} />
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(review.date).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
              })}
            </p>
          </div>
        </div>

        {/* Route Info */}
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Badge variant="outline" className="gap-1">
            <Plane className="h-3 w-3" />
            {review.airlineName}
          </Badge>
          <span className="text-muted-foreground">
            {review.route.origin} → {review.route.destination}
          </span>
          <Badge variant="secondary">{cabinLabels[review.cabinClass]}</Badge>
        </div>

        {/* Content */}
        <div>
          <h3 className="font-semibold mb-2">{review.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{review.content}</p>
        </div>

        {/* Pros & Cons */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-xs font-medium text-emerald-600">Puntos positivos</p>
            <ul className="space-y-1">
              {review.pros.map((pro, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  {pro}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-red-500">Puntos a mejorar</p>
            <ul className="space-y-1">
              {review.cons.map((con, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-red-400 flex-shrink-0">-</span>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Ratings Detail */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 pt-3 border-t">
          {[
            { label: 'Asiento', value: review.ratings.seatComfort },
            { label: 'Servicio', value: review.ratings.service },
            { label: 'Comida', value: review.ratings.food },
            { label: 'Entretenimiento', value: review.ratings.entertainment },
            { label: 'Calidad/Precio', value: review.ratings.valueForMoney },
            { label: 'General', value: review.ratings.overall },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-lg font-bold">{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-2">
            {review.wouldRecommend ? (
              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                Recomienda esta aerolinea
              </Badge>
            ) : (
              <Badge variant="secondary">No recomienda</Badge>
            )}
          </div>
          <Button
            variant={hasVoted ? 'secondary' : 'outline'}
            size="sm"
            onClick={handleHelpful}
            disabled={hasVoted}
            className="gap-1"
          >
            <ThumbsUp className="h-4 w-4" />
            Util ({helpfulCount})
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function WriteReviewForm({ onClose }: { onClose: () => void }) {
  const [selectedAirline, setSelectedAirline] = useState('')
  const [ratings, setRatings] = useState({
    overall: 0,
    seatComfort: 0,
    service: 0,
    food: 0,
    entertainment: 0,
    valueForMoney: 0,
  })

  return (
    <Card>
      <CardContent className="p-5 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Escribe tu resena</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancelar
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm">Aerolinea</Label>
            <select
              value={selectedAirline}
              onChange={(e) => setSelectedAirline(e.target.value)}
              className="w-full mt-1.5 p-2 rounded-lg border bg-background"
            >
              <option value="">Selecciona una aerolinea</option>
              {airlinesData.map((airline) => (
                <option key={airline.id} value={airline.id}>
                  {airline.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label className="text-sm">Clase de cabina</Label>
            <select className="w-full mt-1.5 p-2 rounded-lg border bg-background">
              <option value="economy">Turista</option>
              <option value="premium-economy">Turista Premium</option>
              <option value="business">Business</option>
              <option value="first">Primera Clase</option>
            </select>
          </div>
          <div>
            <Label className="text-sm">Origen</Label>
            <Input placeholder="Ciudad de salida" className="mt-1.5" />
          </div>
          <div>
            <Label className="text-sm">Destino</Label>
            <Input placeholder="Ciudad de llegada" className="mt-1.5" />
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm">Puntuaciones</Label>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
            <InteractiveStarRating
              label="General"
              value={ratings.overall}
              onChange={(v) => setRatings({ ...ratings, overall: v })}
            />
            <InteractiveStarRating
              label="Asiento"
              value={ratings.seatComfort}
              onChange={(v) => setRatings({ ...ratings, seatComfort: v })}
            />
            <InteractiveStarRating
              label="Servicio"
              value={ratings.service}
              onChange={(v) => setRatings({ ...ratings, service: v })}
            />
            <InteractiveStarRating
              label="Comida"
              value={ratings.food}
              onChange={(v) => setRatings({ ...ratings, food: v })}
            />
            <InteractiveStarRating
              label="Entretenimiento"
              value={ratings.entertainment}
              onChange={(v) => setRatings({ ...ratings, entertainment: v })}
            />
            <InteractiveStarRating
              label="Calidad/Precio"
              value={ratings.valueForMoney}
              onChange={(v) => setRatings({ ...ratings, valueForMoney: v })}
            />
          </div>
        </div>

        <div>
          <Label className="text-sm">Titulo de tu resena</Label>
          <Input placeholder="Resume tu experiencia en una frase" className="mt-1.5" />
        </div>

        <div>
          <Label className="text-sm">Tu experiencia</Label>
          <Textarea
            placeholder="Cuenta tu experiencia con esta aerolinea. Que te gusto? Que podrian mejorar?"
            className="mt-1.5 min-h-32"
          />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="recommend" className="rounded" />
          <Label htmlFor="recommend" className="text-sm">
            Recomendaria esta aerolinea a otros viajeros
          </Label>
        </div>

        <div className="flex gap-3">
          <Button className="flex-1">Publicar resena</Button>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function ReviewsSection() {
  const [showWriteReview, setShowWriteReview] = useState(false)
  const [filterAirline, setFilterAirline] = useState('')
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating'>('recent')

  const filteredReviews = sampleReviews
    .filter((review) => !filterAirline || review.airlineId === filterAirline)
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      }
      if (sortBy === 'helpful') {
        return b.helpful - a.helpful
      }
      return b.ratings.overall - a.ratings.overall
    })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-foreground">Reñenas de Viajeros</h1>
                <p className="text-sm text-muted-foreground">
                  {sampleReviews.length} opiniones verificadas
                </p>
              </div>
            </div>
            <Button onClick={() => setShowWriteReview(true)} className="gap-1">
              <Plus className="h-4 w-4" />
              Escribir resena
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Write Review Form */}
        {showWriteReview && (
          <WriteReviewForm onClose={() => setShowWriteReview(false)} />
        )}

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filtrar:</span>
              </div>
              <select
                value={filterAirline}
                onChange={(e) => setFilterAirline(e.target.value)}
                className="p-2 text-sm rounded-lg border bg-background"
              >
                <option value="">Todas las aerolineas</option>
                {airlinesData.map((airline) => (
                  <option key={airline.id} value={airline.id}>
                    {airline.name}
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="p-2 text-sm rounded-lg border bg-background"
              >
                <option value="recent">Mas recientes</option>
                <option value="helpful">Mas utiles</option>
                <option value="rating">Mejor valoradas</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <Card className="py-12">
            <CardContent className="text-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No hay reseñas</p>
              <p className="text-sm">Se el primero en compartir tu experiencia</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

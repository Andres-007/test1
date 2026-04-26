'use client'

import type { Flight } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plane, Clock, Star, ExternalLink, CheckCircle } from 'lucide-react'

interface FlightCardProps {
  flight: Flight
  index: number
}

export function FlightCard({ flight, index }: FlightCardProps) {
  return (
    <Card
      className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          {/* Header - Aerolínea */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-xl">
                {flight.airline.logo}
              </div>
              <div>
                <p className="font-semibold text-foreground">{flight.airline.name}</p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{flight.airline.rating}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {flight.isReal && (
                <Badge variant="outline" className="border-green-500/50 text-green-600 dark:text-green-400 gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Vuelo real
                </Badge>
              )}
              {flight.stops === 0 && (
                <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
                  Directo
                </Badge>
              )}
            </div>
          </div>

          {/* Ruta del vuelo */}
          <div className="flex items-center justify-between gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{flight.departureTime}</p>
              <p className="text-sm font-medium text-muted-foreground">{flight.originCode}</p>
            </div>

            <div className="flex flex-1 flex-col items-center gap-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {flight.duration}
              </div>
              <div className="relative flex w-full items-center">
                <div className="h-px flex-1 bg-border" />
                <Plane className="mx-2 h-4 w-4 text-primary" />
                <div className="h-px flex-1 bg-border" />
              </div>
              {flight.stops > 0 && (
                <p className="text-xs text-muted-foreground">
                  {flight.stops} escala{flight.stops > 1 ? 's' : ''}
                </p>
              )}
            </div>

            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{flight.arrivalTime}</p>
              <p className="text-sm font-medium text-muted-foreground">{flight.destinationCode}</p>
            </div>
          </div>

          {/* Precio y acción */}
          <div className="flex items-center justify-between border-t pt-4">
            <div>
              <p className="text-sm text-muted-foreground">Precio por persona</p>
              <p className="text-2xl font-bold text-primary">
                ${flight.price.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">USD</span>
              </p>
            </div>
            {flight.deepLink ? (
              <Button 
                className="bg-primary hover:bg-primary/90 gap-2"
                asChild
              >
                <a href={flight.deepLink} target="_blank" rel="noopener noreferrer">
                  Reservar
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            ) : (
              <Button className="bg-primary hover:bg-primary/90">
                Seleccionar
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

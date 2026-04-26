'use client'

import * as React from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from '@/components/ui/carousel'
import {
  Map,
  Building2,
  FileCheck,
  Luggage,
  ClipboardList,
  Wrench,
  MessageSquare,
  Bell,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const featureCards = [
  {
    icon: Map,
    title: 'Roadmap',
    description: 'Planifica tu ruta de viaje con mapas interactivos y sugerencias personalizadas',
    href: '/mapa',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: Building2,
    title: 'Guia de Aeropuertos',
    description: 'Info de lounges, WiFi, servicios y como moverte en cada aeropuerto',
    href: '/aeropuertos',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },
  {
    icon: FileCheck,
    title: 'Requisitos de Viaje',
    description: 'Visa, vacunas y documentos necesarios para tu destino',
    href: '/requisitos',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
  {
    icon: Luggage,
    title: 'Calculadora de Equipaje',
    description: 'Verifica si tu maleta cumple las politicas de la aerolinea',
    href: '/equipaje',
    color: 'text-rose-500',
    bgColor: 'bg-rose-500/10',
  },
  {
    icon: ClipboardList,
    title: 'Travel Checklist',
    description: 'Lista interactiva para no olvidar nada en tu viaje',
    href: '/checklist',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10',
  },
  {
    icon: Wrench,
    title: 'Tools',
    description: 'Conversor de monedas, calculadora de millas y mas herramientas',
    href: '/herramientas',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
  },
  {
    icon: MessageSquare,
    title: 'Reviews',
    description: 'Lee y comparte experiencias de vuelo con otros viajeros',
    href: '/resenas',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: Bell,
    title: 'Price Alerts',
    description: 'Recibe avisos cuando baje el precio de tu vuelo favorito',
    href: '/alertas',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
]

export function FeaturesCarousel() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  const scrollTo = React.useCallback(
    (index: number) => {
      api?.scrollTo(index)
    },
    [api]
  )

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 flex flex-col items-center justify-between gap-4 md:mb-12 md:flex-row">
          <div className="text-center md:text-left">
            <h2 className="mb-3 text-2xl font-bold md:text-3xl lg:text-4xl text-balance">
              Todo lo que necesitas para viajar
            </h2>
            <p className="max-w-2xl text-muted-foreground">
              Herramientas completas para planificar, comparar y disfrutar tus viajes
            </p>
          </div>
          {/* Desktop navigation arrows */}
          <div className="hidden items-center gap-2 md:flex">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={() => api?.scrollPrev()}
              disabled={!api?.canScrollPrev()}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Previous</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={() => api?.scrollNext()}
              disabled={!api?.canScrollNext()}
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        </div>

        <Carousel
          setApi={setApi}
          opts={{
            align: 'start',
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-3 md:-ml-4">
            {featureCards.map((feature, index) => (
              <CarouselItem
                key={feature.href}
                className="pl-3 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
              >
                <Link href={feature.href} className="block h-full">
                  <Card className="group h-full cursor-pointer border-2 transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/5">
                    <CardContent className="flex h-full flex-col p-5 md:p-6">
                      <div
                        className={cn(
                          'mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110',
                          feature.bgColor
                        )}
                      >
                        <feature.icon className={cn('h-6 w-6', feature.color)} />
                      </div>
                      <h3 className="mb-2 text-lg font-semibold group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Indicator dots with mobile arrows */}
        <div className="mt-6 flex items-center justify-center gap-3 md:mt-8">
          {/* Mobile previous arrow */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full md:hidden"
            onClick={() => api?.scrollPrev()}
            disabled={!api?.canScrollPrev()}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous</span>
          </Button>

          {/* Dots */}
          <div className="flex items-center gap-2">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  current === index
                    ? 'w-6 bg-primary'
                    : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Mobile next arrow */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full md:hidden"
            onClick={() => api?.scrollNext()}
            disabled={!api?.canScrollNext()}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next</span>
          </Button>
        </div>
      </div>
    </section>
  )
}

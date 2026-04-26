'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Building2,
  FileCheck,
  Luggage,
  ClipboardList,
  Wrench,
  MessageSquare,
  Bell,
  Map,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

const carouselFeatures = [
  {
    icon: Map,
    title: 'Hoja de Ruta',
    description: 'Planifica tu itinerario completo paso a paso con rutas optimizadas',
    href: '/mapa',
    color: 'from-blue-500/10 to-blue-600/5',
    iconBg: 'bg-blue-500/10 text-blue-600',
    iconBgHover: 'group-hover:bg-blue-500 group-hover:text-white',
  },
  {
    icon: Building2,
    title: 'Guia de Aeropuertos',
    description: 'Info de lounges, WiFi, transporte y servicios en cada terminal',
    href: '/aeropuertos',
    color: 'from-sky-500/10 to-sky-600/5',
    iconBg: 'bg-sky-500/10 text-sky-600',
    iconBgHover: 'group-hover:bg-sky-500 group-hover:text-white',
  },
  {
    icon: FileCheck,
    title: 'Requisitos de Viaje',
    description: 'Visa, vacunas y documentos necesarios por destino',
    href: '/requisitos',
    color: 'from-emerald-500/10 to-emerald-600/5',
    iconBg: 'bg-emerald-500/10 text-emerald-600',
    iconBgHover: 'group-hover:bg-emerald-500 group-hover:text-white',
  },
  {
    icon: Luggage,
    title: 'Calculadora de Equipaje',
    description: 'Verifica si tu maleta cumple las politicas de cada aerolinea',
    href: '/equipaje',
    color: 'from-amber-500/10 to-amber-600/5',
    iconBg: 'bg-amber-500/10 text-amber-600',
    iconBgHover: 'group-hover:bg-amber-500 group-hover:text-white',
  },
  {
    icon: ClipboardList,
    title: 'Checklist de Viaje',
    description: 'Lista interactiva para preparar tu viaje sin olvidar nada',
    href: '/checklist',
    color: 'from-violet-500/10 to-violet-600/5',
    iconBg: 'bg-violet-500/10 text-violet-600',
    iconBgHover: 'group-hover:bg-violet-500 group-hover:text-white',
  },
  {
    icon: Wrench,
    title: 'Herramientas',
    description: 'Conversor de monedas, zonas horarias y calculadora de millas',
    href: '/herramientas',
    color: 'from-orange-500/10 to-orange-600/5',
    iconBg: 'bg-orange-500/10 text-orange-600',
    iconBgHover: 'group-hover:bg-orange-500 group-hover:text-white',
  },
  {
    icon: MessageSquare,
    title: 'Resenas',
    description: 'Lee y comparte experiencias reales de vuelo con otros viajeros',
    href: '/resenas',
    color: 'from-pink-500/10 to-pink-600/5',
    iconBg: 'bg-pink-500/10 text-pink-600',
    iconBgHover: 'group-hover:bg-pink-500 group-hover:text-white',
  },
  {
    icon: Bell,
    title: 'Alertas de Precios',
    description: 'Recibe avisos cuando baje el precio de tu vuelo favorito',
    href: '/alertas',
    color: 'from-teal-500/10 to-teal-600/5',
    iconBg: 'bg-teal-500/10 text-teal-600',
    iconBgHover: 'group-hover:bg-teal-500 group-hover:text-white',
  },
]

export function FeaturesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Visible cards: 1 mobile, 2 tablet, 3 desktop
  // We track by index of the leftmost card
  const totalCards = carouselFeatures.length

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalCards) % totalCards)
  }, [totalCards])

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalCards)
  }, [totalCards])

  const goTo = (index: number) => setCurrentIndex(index)

  // Build ordered list starting from currentIndex for smooth rendering
  const orderedFeatures = [
    ...carouselFeatures.slice(currentIndex),
    ...carouselFeatures.slice(0, currentIndex),
  ]

  return (
    <section className="py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-10 flex flex-col items-center text-center gap-4 sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="text-3xl font-bold md:text-4xl text-balance">
              Herramientas para cada etapa de tu viaje
            </h2>
            <p className="mt-2 text-muted-foreground max-w-xl text-pretty">
              Todo lo que necesitas para planificar, preparar y disfrutar tus vuelos
            </p>
          </div>
          {/* Desktop arrows */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              aria-label="Anterior"
              className="h-10 w-10 rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={next}
              aria-label="Siguiente"
              className="h-10 w-10 rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Cards track */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {orderedFeatures.slice(0, 3).map((feature, i) => (
            <Link key={`${feature.href}-${currentIndex}-${i}`} href={feature.href} className="group">
              <Card
                className={`h-full cursor-pointer transition-all duration-300 hover:border-primary hover:shadow-xl bg-gradient-to-br ${feature.color} border`}
              >
                <CardContent className="p-6 flex flex-col gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-300 ${feature.iconBg} ${feature.iconBgHover}`}
                  >
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1 text-balance">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
                      {feature.description}
                    </p>
                  </div>
                  <div className="mt-auto flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    Explorar
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Bottom controls */}
        <div className="mt-8 flex items-center justify-center gap-4">
          {/* Mobile arrows */}
          <Button
            variant="outline"
            size="icon"
            onClick={prev}
            aria-label="Anterior"
            className="h-9 w-9 rounded-full sm:hidden"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Dot indicators */}
          <div className="flex items-center gap-2" role="tablist" aria-label="Navegacion del carrusel">
            {carouselFeatures.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === currentIndex}
                aria-label={`Ir a la tarjeta ${i + 1}`}
                onClick={() => goTo(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === currentIndex
                    ? 'bg-primary w-6 h-2.5'
                    : 'bg-border hover:bg-muted-foreground w-2.5 h-2.5'
                }`}
              />
            ))}
          </div>

          {/* Mobile arrows */}
          <Button
            variant="outline"
            size="icon"
            onClick={next}
            aria-label="Siguiente"
            className="h-9 w-9 rounded-full sm:hidden"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}

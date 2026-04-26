'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme-toggle'
import { AuthModal } from '@/components/auth-modal'
import { useUser } from '@/lib/user-context'
import {
  Plane,
  Trophy,
  Search,
  GitCompare,
  Map,
  Luggage,
  MessageSquare,
  Bell,
  Radar,
  Building2,
  FileCheck,
  ClipboardList,
  Wrench,
  BookOpen,
  Star,
  Shield,
  Zap,
  Globe,
  Users,
  ArrowRight,
  CheckCircle2,
  LayoutDashboard,
} from 'lucide-react'

const features = [
  {
    icon: Trophy,
    title: 'Ranking de Aerolineas',
    description: 'Descubre las mejores aerolineas valoradas por miles de viajeros',
    href: '/ranking',
  },
  {
    icon: Search,
    title: 'Buscador de Vuelos',
    description: 'Encuentra los mejores vuelos al mejor precio',
    href: '/vuelos',
  },
  {
    icon: GitCompare,
    title: 'Comparador',
    description: 'Compara hasta 3 aerolineas lado a lado',
    href: '/comparador',
  },
  {
    icon: Radar,
    title: 'Rastreo en Tiempo Real',
    description: 'Sigue tu vuelo en vivo con actualizaciones',
    href: '/seguimiento',
  },
  {
    icon: Map,
    title: 'Mapa de Rutas',
    description: 'Explora rutas mundiales de cada aerolinea',
    href: '/mapa',
  },
  {
    icon: Building2,
    title: 'Guia de Aeropuertos',
    description: 'Info de lounges, WiFi y servicios',
    href: '/aeropuertos',
  },
  {
    icon: FileCheck,
    title: 'Requisitos de Viaje',
    description: 'Visa, vacunas y documentos necesarios',
    href: '/requisitos',
  },
  {
    icon: Luggage,
    title: 'Calculadora de Equipaje',
    description: 'Verifica si tu maleta cumple las politicas',
    href: '/equipaje',
  },
  {
    icon: ClipboardList,
    title: 'Checklist de Viaje',
    description: 'Lista interactiva para preparar tu viaje',
    href: '/checklist',
  },
  {
    icon: Wrench,
    title: 'Herramientas',
    description: 'Conversor de monedas y calculadora de millas',
    href: '/herramientas',
  },
  {
    icon: MessageSquare,
    title: 'Resenas',
    description: 'Lee y comparte experiencias de vuelo',
    href: '/resenas',
  },
  {
    icon: Bell,
    title: 'Alertas de Precios',
    description: 'Recibe avisos cuando baje el precio',
    href: '/alertas',
  },
]

const stats = [
  { value: '500+', label: 'Aerolineas' },
  { value: '10K+', label: 'Rutas' },
  { value: '50K+', label: 'Resenas' },
  { value: '98%', label: 'Satisfaccion' },
]

const testimonials = [
  {
    name: 'Maria Garcia',
    role: 'Viajera frecuente',
    content: 'Gracias a FlyBot encontre el vuelo perfecto y ahorre mas de $200. La calculadora de equipaje me salvo de pagar exceso.',
    rating: 5,
  },
  {
    name: 'Carlos Rodriguez',
    role: 'Empresario',
    content: 'El comparador de aerolineas es increible. Ahora siempre se cual tiene mejor servicio antes de reservar.',
    rating: 5,
  },
  {
    name: 'Ana Martinez',
    role: 'Blogger de viajes',
    content: 'El mapa de rutas y la guia de aeropuertos son herramientas indispensables para planificar mis viajes.',
    rating: 5,
  },
]

export function LandingPage() {
  const { user, isLoggedIn } = useUser()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Plane className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">FlyBot</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/ranking" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Ranking
            </Link>
            <Link href="/vuelos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Vuelos
            </Link>
            <Link href="/comparador" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Comparador
            </Link>
            <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Blog
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  {user?.name}
                </Button>
              </Link>
            ) : (
              <AuthModal />
            )}
            <Link href="/chat">
              <Button size="sm" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Chatbot
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="mx-auto max-w-7xl px-4 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm">
              <Zap className="h-4 w-4 text-primary" />
              <span>Tu asistente de vuelos con IA</span>
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-balance md:text-6xl lg:text-7xl">
              Encuentra el vuelo perfecto con{' '}
              <span className="text-primary">FlyBot</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground text-balance md:text-xl">
              Compara aerolineas, rastrea vuelos, calcula equipaje y mucho mas. 
              Todo lo que necesitas para viajar inteligente en un solo lugar.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/chat">
                <Button size="lg" className="gap-2 text-base">
                  <MessageSquare className="h-5 w-5" />
                  Hablar con FlyBot
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/vuelos">
                <Button size="lg" variant="outline" className="gap-2 text-base">
                  <Search className="h-5 w-5" />
                  Buscar Vuelos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-muted/30 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary md:text-4xl">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Todo lo que necesitas para viajar</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Herramientas completas para planificar, comparar y disfrutar tus viajes
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {features.map((feature) => (
              <Link key={feature.href} href={feature.href}>
                <Card className="group h-full cursor-pointer transition-all hover:border-primary hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why FlyBot */}
      <section className="border-y bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold md:text-4xl">Por que elegir FlyBot?</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold">Cobertura Global</h3>
                    <p className="text-sm text-muted-foreground">
                      Informacion de mas de 500 aerolineas y 10,000 rutas en todo el mundo
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold">Asistente IA</h3>
                    <p className="text-sm text-muted-foreground">
                      Resuelve tus dudas al instante con nuestro chatbot inteligente
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold">Informacion Verificada</h3>
                    <p className="text-sm text-muted-foreground">
                      Datos actualizados de fuentes oficiales y resenas reales
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold">Comunidad Activa</h3>
                    <p className="text-sm text-muted-foreground">
                      Miles de viajeros compartiendo experiencias y consejos
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/5 to-accent/5 p-8">
                <div className="grid h-full grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="rounded-xl border bg-card p-4 shadow-sm">
                      <div className="mb-2 text-xs text-muted-foreground">Vuelo rastreado</div>
                      <div className="flex items-center gap-2">
                        <Plane className="h-4 w-4 text-primary" />
                        <span className="font-semibold">IB3456</span>
                      </div>
                      <div className="mt-2 text-xs text-green-600">En horario</div>
                    </div>
                    <div className="rounded-xl border bg-card p-4 shadow-sm">
                      <div className="mb-2 text-xs text-muted-foreground">Mejor precio</div>
                      <div className="text-2xl font-bold text-primary">$299</div>
                      <div className="text-xs text-muted-foreground">MAD - BCN</div>
                    </div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="rounded-xl border bg-card p-4 shadow-sm">
                      <div className="mb-2 text-xs text-muted-foreground">Equipaje</div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Cumple politicas</span>
                      </div>
                    </div>
                    <div className="rounded-xl border bg-card p-4 shadow-sm">
                      <div className="mb-2 text-xs text-muted-foreground">Rating</div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">4.8/5 (2,340)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Lo que dicen nuestros usuarios</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Miles de viajeros confian en FlyBot para planificar sus vuelos
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="h-full">
                <CardContent className="p-6">
                  <div className="mb-4 flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= testimonial.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mb-4 text-muted-foreground">{`"${testimonial.content}"`}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-primary py-16 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Listo para viajar inteligente?</h2>
          <p className="mx-auto mb-8 max-w-xl opacity-90">
            Unete a miles de viajeros que ya usan FlyBot para encontrar los mejores vuelos
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/chat">
              <Button size="lg" variant="secondary" className="gap-2 text-base">
                <MessageSquare className="h-5 w-5" />
                Comenzar Ahora
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Plane className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-bold">FlyBot</span>
              </Link>
              <p className="mt-4 text-sm text-muted-foreground">
                Tu asistente de vuelos con IA para viajar inteligente
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Herramientas</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/vuelos" className="hover:text-foreground">Buscar Vuelos</Link></li>
                <li><Link href="/comparador" className="hover:text-foreground">Comparador</Link></li>
                <li><Link href="/seguimiento" className="hover:text-foreground">Rastreo</Link></li>
                <li><Link href="/equipaje" className="hover:text-foreground">Equipaje</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Informacion</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/ranking" className="hover:text-foreground">Ranking</Link></li>
                <li><Link href="/aeropuertos" className="hover:text-foreground">Aeropuertos</Link></li>
                <li><Link href="/blog" className="hover:text-foreground">Blog</Link></li>
                <li><Link href="/resenas" className="hover:text-foreground">Resenas</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Planificacion</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/requisitos" className="hover:text-foreground">Requisitos</Link></li>
                <li><Link href="/checklist" className="hover:text-foreground">Checklist</Link></li>
                <li><Link href="/herramientas" className="hover:text-foreground">Herramientas</Link></li>
                <li><Link href="/alertas" className="hover:text-foreground">Alertas</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>2024 FlyBot. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

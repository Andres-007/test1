"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/theme-toggle'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft,
  Search,
  Wifi,
  Coffee,
  ShoppingBag,
  Car,
  Train,
  Clock,
  MapPin,
  Star,
  Users,
  Utensils,
  Briefcase,
  Navigation,
} from 'lucide-react'
import { NearbyAirports } from './nearby-airports'

interface Airport {
  code: string
  name: string
  city: string
  country: string
  terminals: number
  rating: number
  services: {
    wifi: { free: boolean; quality: string }
    lounges: { count: number; bestLounge: string }
    shopping: { stores: number; highlight: string }
    dining: { restaurants: number; highlight: string }
    transport: { options: string[] }
  }
  minConnectionTime: number
  tips: string[]
}

const airports: Airport[] = [
  {
    code: 'MAD',
    name: 'Adolfo Suarez Madrid-Barajas',
    city: 'Madrid',
    country: 'Espana',
    terminals: 4,
    rating: 4.2,
    services: {
      wifi: { free: true, quality: 'Excelente' },
      lounges: { count: 12, bestLounge: 'Iberia Premium Lounge' },
      shopping: { stores: 150, highlight: 'Duty Free World' },
      dining: { restaurants: 80, highlight: 'Mercado de San Miguel' },
      transport: { options: ['Metro', 'Bus', 'Taxi', 'Tren Cercanias'] },
    },
    minConnectionTime: 60,
    tips: [
      'La T4 y T4S estan conectadas por un tren automatico',
      'El metro llega directamente a T1, T2 y T4',
      'Conexiones minimas de 60 min entre terminales',
    ],
  },
  {
    code: 'BCN',
    name: 'Josep Tarradellas Barcelona-El Prat',
    city: 'Barcelona',
    country: 'Espana',
    terminals: 2,
    rating: 4.0,
    services: {
      wifi: { free: true, quality: 'Buena' },
      lounges: { count: 8, bestLounge: 'Sala VIP Pau Casals' },
      shopping: { stores: 100, highlight: 'World Duty Free' },
      dining: { restaurants: 50, highlight: 'La Boqueria Express' },
      transport: { options: ['Metro', 'Aerobus', 'Taxi', 'Tren'] },
    },
    minConnectionTime: 45,
    tips: [
      'T1 y T2 estan separadas, usa el bus shuttle gratuito',
      'El Aerobus es la forma mas rapida al centro',
      'Vueling opera desde T1',
    ],
  },
  {
    code: 'JFK',
    name: 'John F. Kennedy International',
    city: 'New York',
    country: 'Estados Unidos',
    terminals: 6,
    rating: 3.8,
    services: {
      wifi: { free: true, quality: 'Buena' },
      lounges: { count: 20, bestLounge: 'TWA Hotel Lobby' },
      shopping: { stores: 200, highlight: 'Duty Free Americas' },
      dining: { restaurants: 100, highlight: 'Shake Shack' },
      transport: { options: ['AirTrain', 'Bus', 'Taxi', 'Uber/Lyft'] },
    },
    minConnectionTime: 90,
    tips: [
      'Las terminales NO estan conectadas por dentro',
      'Usa el AirTrain gratuito entre terminales',
      'Reserva al menos 2 horas para conexiones',
    ],
  },
  {
    code: 'LHR',
    name: 'London Heathrow',
    city: 'Londres',
    country: 'Reino Unido',
    terminals: 4,
    rating: 4.1,
    services: {
      wifi: { free: true, quality: 'Excelente' },
      lounges: { count: 25, bestLounge: 'Concorde Room' },
      shopping: { stores: 300, highlight: 'Harrods' },
      dining: { restaurants: 120, highlight: 'Gordon Ramsay Plane Food' },
      transport: { options: ['Heathrow Express', 'Tube', 'Bus', 'Taxi'] },
    },
    minConnectionTime: 75,
    tips: [
      'T5 es exclusiva de British Airways',
      'Heathrow Express llega a Paddington en 15 min',
      'T2 y T5 tienen las mejores lounges',
    ],
  },
  {
    code: 'DXB',
    name: 'Dubai International',
    city: 'Dubai',
    country: 'Emiratos Arabes Unidos',
    terminals: 3,
    rating: 4.5,
    services: {
      wifi: { free: true, quality: 'Excelente' },
      lounges: { count: 15, bestLounge: 'Emirates First Class Lounge' },
      shopping: { stores: 400, highlight: 'Dubai Duty Free' },
      dining: { restaurants: 150, highlight: 'Five Guys' },
      transport: { options: ['Metro', 'Bus', 'Taxi'] },
    },
    minConnectionTime: 90,
    tips: [
      'T3 es exclusiva de Emirates',
      'El metro conecta T1 y T3',
      'Hay duchas gratuitas en algunas lounges',
    ],
  },
  {
    code: 'SIN',
    name: 'Singapore Changi',
    city: 'Singapur',
    country: 'Singapur',
    terminals: 4,
    rating: 4.9,
    services: {
      wifi: { free: true, quality: 'Excelente' },
      lounges: { count: 20, bestLounge: 'The Private Room' },
      shopping: { stores: 500, highlight: 'Jewel Changi' },
      dining: { restaurants: 200, highlight: 'A Noodle Story' },
      transport: { options: ['MRT', 'Bus', 'Taxi', 'Grab'] },
    },
    minConnectionTime: 45,
    tips: [
      'Jewel tiene una cascada interior de 40m',
      'Hay cines, piscinas y jardines en el aeropuerto',
      'Mejor aeropuerto del mundo segun Skytrax',
    ],
  },
]

export function AirportsGuide() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null)

  const filteredAirports = airports.filter(
    (airport) =>
      airport.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      airport.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      airport.city.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">Guia de Aeropuertos</h1>
              <p className="text-sm text-muted-foreground">Informacion util para tu viaje</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Nearby Airports */}
        <div className="mb-8">
          <NearbyAirports />
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar aeropuerto por codigo, nombre o ciudad..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-lg"
          />
        </div>

        {selectedAirport ? (
          /* Airport Detail */
          <div className="space-y-6">
            <Button variant="ghost" onClick={() => setSelectedAirport(null)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a la lista
            </Button>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-lg px-3 py-1">
                        {selectedAirport.code}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{selectedAirport.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="text-2xl">{selectedAirport.name}</CardTitle>
                    <CardDescription className="text-lg">
                      {selectedAirport.city}, {selectedAirport.country}
                    </CardDescription>
                  </div>
                  <Badge>{selectedAirport.terminals} terminales</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="services" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="services">Servicios</TabsTrigger>
                    <TabsTrigger value="transport">Transporte</TabsTrigger>
                    <TabsTrigger value="connections">Conexiones</TabsTrigger>
                    <TabsTrigger value="tips">Consejos</TabsTrigger>
                  </TabsList>

                  <TabsContent value="services" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      {/* WiFi */}
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                              <Wifi className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <p className="font-semibold">WiFi</p>
                              <p className="text-sm text-muted-foreground">
                                {selectedAirport.services.wifi.free ? 'Gratuito' : 'De pago'}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm">Calidad: {selectedAirport.services.wifi.quality}</p>
                        </CardContent>
                      </Card>

                      {/* Lounges */}
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                              <Briefcase className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <p className="font-semibold">Salas VIP</p>
                              <p className="text-sm text-muted-foreground">
                                {selectedAirport.services.lounges.count} lounges
                              </p>
                            </div>
                          </div>
                          <p className="text-sm">Mejor: {selectedAirport.services.lounges.bestLounge}</p>
                        </CardContent>
                      </Card>

                      {/* Shopping */}
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="h-10 w-10 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center">
                              <ShoppingBag className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                            </div>
                            <div>
                              <p className="font-semibold">Compras</p>
                              <p className="text-sm text-muted-foreground">
                                {selectedAirport.services.shopping.stores} tiendas
                              </p>
                            </div>
                          </div>
                          <p className="text-sm">Destacado: {selectedAirport.services.shopping.highlight}</p>
                        </CardContent>
                      </Card>

                      {/* Dining */}
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="h-10 w-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                              <Utensils className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                              <p className="font-semibold">Restaurantes</p>
                              <p className="text-sm text-muted-foreground">
                                {selectedAirport.services.dining.restaurants} opciones
                              </p>
                            </div>
                          </div>
                          <p className="text-sm">Destacado: {selectedAirport.services.dining.highlight}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="transport">
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                          <Car className="h-5 w-5" />
                          Opciones de transporte
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedAirport.services.transport.options.map((option) => (
                            <Badge key={option} variant="secondary" className="text-sm py-1 px-3">
                              {option === 'Metro' || option === 'MRT' || option === 'Tube' ? (
                                <Train className="h-3 w-3 mr-1" />
                              ) : option === 'Taxi' || option.includes('Uber') ? (
                                <Car className="h-3 w-3 mr-1" />
                              ) : null}
                              {option}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="connections">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                          <Clock className="h-8 w-8 text-primary" />
                          <div>
                            <p className="text-2xl font-bold">{selectedAirport.minConnectionTime} min</p>
                            <p className="text-muted-foreground">Tiempo minimo de conexion recomendado</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="tips">
                    <Card>
                      <CardContent className="pt-6">
                        <ul className="space-y-3">
                          {selectedAirport.tips.map((tip, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">
                                {index + 1}
                              </span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Airport List */
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAirports.map((airport) => (
              <Card
                key={airport.code}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => setSelectedAirport(airport)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-lg px-3 py-1">
                      {airport.code}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{airport.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg mt-2">{airport.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {airport.city}, {airport.country}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {airport.terminals} terminales
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {airport.minConnectionTime} min conexion
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {airport.services.wifi.free && (
                      <Badge variant="secondary" className="text-xs">
                        <Wifi className="h-3 w-3 mr-1" />
                        WiFi gratis
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-xs">
                      <Coffee className="h-3 w-3 mr-1" />
                      {airport.services.lounges.count} lounges
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

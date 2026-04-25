'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  ArrowLeft,
  Bell,
  BellRing,
  Plane,
  Plus,
  Trash2,
  TrendingDown,
  Mail,
  ArrowRight,
  Check,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { airports } from '@/lib/flights-data'

interface PriceAlert {
  id: string
  origin: string
  destination: string
  maxPrice: number
  currentPrice: number
  enabled: boolean
  createdAt: Date
  lastNotified?: Date
}

const mockAlerts: PriceAlert[] = [
  {
    id: '1',
    origin: 'SAL',
    destination: 'MIA',
    maxPrice: 350,
    currentPrice: 289,
    enabled: true,
    createdAt: new Date('2024-01-10'),
    lastNotified: new Date('2024-01-20'),
  },
  {
    id: '2',
    origin: 'SAL',
    destination: 'MEX',
    maxPrice: 200,
    currentPrice: 245,
    enabled: true,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '3',
    origin: 'SAL',
    destination: 'MAD',
    maxPrice: 600,
    currentPrice: 720,
    enabled: false,
    createdAt: new Date('2024-01-05'),
  },
]

export function PriceAlerts() {
  const [alerts, setAlerts] = useState<PriceAlert[]>(mockAlerts)
  const [showNewAlert, setShowNewAlert] = useState(false)
  const [email, setEmail] = useState('')
  const [emailSaved, setEmailSaved] = useState(false)
  const [newAlert, setNewAlert] = useState({
    origin: '',
    destination: '',
    maxPrice: '',
  })

  const handleToggleAlert = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, enabled: !alert.enabled } : alert
    ))
  }

  const handleDeleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id))
  }

  const handleCreateAlert = () => {
    if (!newAlert.origin || !newAlert.destination || !newAlert.maxPrice) return

    const alert: PriceAlert = {
      id: Date.now().toString(),
      origin: newAlert.origin,
      destination: newAlert.destination,
      maxPrice: parseInt(newAlert.maxPrice),
      currentPrice: Math.floor(Math.random() * 500) + 200,
      enabled: true,
      createdAt: new Date(),
    }

    setAlerts([alert, ...alerts])
    setNewAlert({ origin: '', destination: '', maxPrice: '' })
    setShowNewAlert(false)
  }

  const handleSaveEmail = () => {
    if (email) {
      setEmailSaved(true)
      setTimeout(() => setEmailSaved(false), 3000)
    }
  }

  const getAirportName = (code: string) => {
    const airport = airports.find(a => a.code === code)
    return airport ? airport.city : code
  }

  const activeAlerts = alerts.filter(a => a.enabled).length
  const triggeredAlerts = alerts.filter(a => a.enabled && a.currentPrice <= a.maxPrice).length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Bell className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Alertas de Precios</h1>
            </div>
          </div>
          <Button onClick={() => setShowNewAlert(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nueva Alerta</span>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Bell className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{alerts.length}</p>
                  <p className="text-sm text-muted-foreground">Alertas totales</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-green-500/10">
                  <BellRing className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeAlerts}</p>
                  <p className="text-sm text-muted-foreground">Alertas activas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-amber-500/10">
                  <TrendingDown className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{triggeredAlerts}</p>
                  <p className="text-sm text-muted-foreground">Precios alcanzados</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Alerts List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold">Mis Alertas</h2>
            
            {/* New Alert Form */}
            {showNewAlert && (
              <Card className="border-primary">
                <CardHeader>
                  <CardTitle className="text-base">Nueva Alerta de Precio</CardTitle>
                  <CardDescription>
                    Te notificaremos cuando el precio baje de tu objetivo
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Origen</Label>
                      <Select
                        value={newAlert.origin}
                        onValueChange={(value) => setNewAlert({ ...newAlert, origin: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona origen" />
                        </SelectTrigger>
                        <SelectContent>
                          {airports.map((airport) => (
                            <SelectItem key={airport.code} value={airport.code}>
                              {airport.city} ({airport.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Destino</Label>
                      <Select
                        value={newAlert.destination}
                        onValueChange={(value) => setNewAlert({ ...newAlert, destination: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona destino" />
                        </SelectTrigger>
                        <SelectContent>
                          {airports.filter(a => a.code !== newAlert.origin).map((airport) => (
                            <SelectItem key={airport.code} value={airport.code}>
                              {airport.city} ({airport.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Precio máximo (USD)</Label>
                    <Input
                      type="number"
                      placeholder="Ej: 300"
                      value={newAlert.maxPrice}
                      onChange={(e) => setNewAlert({ ...newAlert, maxPrice: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setShowNewAlert(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateAlert}>
                      Crear Alerta
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Alerts */}
            {alerts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No tienes alertas configuradas
                  </p>
                  <Button 
                    className="mt-4" 
                    onClick={() => setShowNewAlert(true)}
                  >
                    Crear primera alerta
                  </Button>
                </CardContent>
              </Card>
            ) : (
              alerts.map((alert) => {
                const priceReached = alert.currentPrice <= alert.maxPrice
                return (
                  <Card 
                    key={alert.id} 
                    className={`transition-all ${!alert.enabled && 'opacity-60'} ${priceReached && alert.enabled && 'border-green-500'}`}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-full ${priceReached && alert.enabled ? 'bg-green-500/10' : 'bg-primary/10'}`}>
                            <Plane className={`h-5 w-5 ${priceReached && alert.enabled ? 'text-green-500' : 'text-primary'}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 font-semibold">
                              <span>{getAirportName(alert.origin)}</span>
                              <ArrowRight className="h-4 w-4 text-muted-foreground" />
                              <span>{getAirportName(alert.destination)}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                              <span>{alert.origin}</span>
                              <span>-</span>
                              <span>{alert.destination}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={alert.enabled}
                            onCheckedChange={() => handleToggleAlert(alert.id)}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteAlert(alert.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Precio objetivo</p>
                          <p className="text-lg font-bold">${alert.maxPrice}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Precio actual</p>
                          <div className="flex items-center gap-2">
                            <p className={`text-lg font-bold ${priceReached ? 'text-green-500' : ''}`}>
                              ${alert.currentPrice}
                            </p>
                            {priceReached && alert.enabled && (
                              <Badge className="bg-green-500">
                                <TrendingDown className="h-3 w-3 mr-1" />
                                Disponible
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {alert.lastNotified && (
                        <p className="mt-3 text-xs text-muted-foreground">
                          Última notificación: {alert.lastNotified.toLocaleDateString('es-ES')}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>

          {/* Email Settings */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Configuración</h2>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Notificaciones por Email
                </CardTitle>
                <CardDescription>
                  Recibe alertas cuando los precios bajen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button 
                  className="w-full gap-2" 
                  onClick={handleSaveEmail}
                  disabled={!email}
                >
                  {emailSaved ? (
                    <>
                      <Check className="h-4 w-4" />
                      Guardado
                    </>
                  ) : (
                    'Guardar Email'
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Los mejores precios suelen aparecer entre martes y jueves.
                </p>
                <p>
                  Reserva con 2-3 meses de anticipación para mejores tarifas.
                </p>
                <p>
                  Los vuelos matutinos suelen ser más económicos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

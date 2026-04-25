"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUser } from '@/lib/user-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  Plane,
  Heart,
  Bell,
  History,
  Settings,
  LogOut,
  ArrowLeft,
  Trash2,
  DollarSign,
  Globe,
  Star,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const currencies = [
  { code: 'USD', name: 'Dolar estadounidense', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'Libra esterlina', symbol: '£' },
  { code: 'MXN', name: 'Peso mexicano', symbol: '$' },
  { code: 'ARS', name: 'Peso argentino', symbol: '$' },
  { code: 'COP', name: 'Peso colombiano', symbol: '$' },
  { code: 'BRL', name: 'Real brasileno', symbol: 'R$' },
]

const languages = [
  { code: 'es', name: 'Espanol' },
  { code: 'en', name: 'English' },
  { code: 'pt', name: 'Portugues' },
]

export function UserDashboard() {
  const router = useRouter()
  const {
    user,
    isLoggedIn,
    logout,
    savedFlights,
    favoriteAirlines,
    priceAlerts,
    searchHistory,
    preferredCurrency,
    preferredLanguage,
    removeSavedFlight,
    removeFavoriteAirline,
    removePriceAlert,
    togglePriceAlert,
    clearSearchHistory,
    setPreferredCurrency,
    setPreferredLanguage,
  } = useUser()

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/')
    }
  }, [isLoggedIn, router])

  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Redirigiendo...</p>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

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
              <h1 className="text-xl font-bold">Mi Dashboard</h1>
              <p className="text-sm text-muted-foreground">Bienvenido, {user.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Vuelos Guardados</CardTitle>
              <Plane className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{savedFlights.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Aerolineas Favoritas</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{favoriteAirlines.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Alertas Activas</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{priceAlerts.filter(a => a.active).length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Busquedas</CardTitle>
              <History className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{searchHistory.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="flights" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="flights">Vuelos</TabsTrigger>
            <TabsTrigger value="airlines">Aerolineas</TabsTrigger>
            <TabsTrigger value="alerts">Alertas</TabsTrigger>
            <TabsTrigger value="history">Historial</TabsTrigger>
            <TabsTrigger value="settings">Ajustes</TabsTrigger>
          </TabsList>

          {/* Saved Flights */}
          <TabsContent value="flights">
            <Card>
              <CardHeader>
                <CardTitle>Vuelos Guardados</CardTitle>
                <CardDescription>Tus vuelos favoritos para comprar despues</CardDescription>
              </CardHeader>
              <CardContent>
                {savedFlights.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Plane className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No tienes vuelos guardados</p>
                    <Link href="/vuelos">
                      <Button variant="link">Buscar vuelos</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedFlights.map((flight) => (
                      <div key={flight.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Plane className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{flight.origin} → {flight.destination}</p>
                            <p className="text-sm text-muted-foreground">
                              {flight.airline} • {formatDate(flight.date)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-lg">${flight.price}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSavedFlight(flight.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Favorite Airlines */}
          <TabsContent value="airlines">
            <Card>
              <CardHeader>
                <CardTitle>Aerolineas Favoritas</CardTitle>
                <CardDescription>Las aerolineas que mas te gustan</CardDescription>
              </CardHeader>
              <CardContent>
                {favoriteAirlines.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Heart className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No tienes aerolineas favoritas</p>
                    <Link href="/ranking">
                      <Button variant="link">Ver ranking de aerolineas</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {favoriteAirlines.map((airlineId) => (
                      <div key={airlineId} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Star className="h-5 w-5 text-primary" />
                          </div>
                          <span className="font-medium">{airlineId}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFavoriteAirline(airlineId)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Price Alerts */}
          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle>Alertas de Precios</CardTitle>
                <CardDescription>Recibe notificaciones cuando bajen los precios</CardDescription>
              </CardHeader>
              <CardContent>
                {priceAlerts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No tienes alertas configuradas</p>
                    <Link href="/alertas">
                      <Button variant="link">Crear alerta</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {priceAlerts.map((alert) => (
                      <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            alert.active ? 'bg-green-100 dark:bg-green-900' : 'bg-muted'
                          }`}>
                            <Bell className={`h-5 w-5 ${
                              alert.active ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
                            }`} />
                          </div>
                          <div>
                            <p className="font-medium">{alert.origin} → {alert.destination}</p>
                            <p className="text-sm text-muted-foreground">
                              Precio maximo: ${alert.maxPrice}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={alert.active ? 'default' : 'secondary'}>
                            {alert.active ? 'Activa' : 'Pausada'}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePriceAlert(alert.id)}
                          >
                            {alert.active ? 'Pausar' : 'Activar'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removePriceAlert(alert.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Search History */}
          <TabsContent value="history">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Historial de Busquedas</CardTitle>
                  <CardDescription>Tus busquedas recientes</CardDescription>
                </div>
                {searchHistory.length > 0 && (
                  <Button variant="outline" size="sm" onClick={clearSearchHistory}>
                    Limpiar historial
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {searchHistory.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <History className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No tienes busquedas recientes</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {searchHistory.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <span>{item.query}</span>
                        <span className="text-sm text-muted-foreground">{formatDate(item.date)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Ajustes</CardTitle>
                <CardDescription>Personaliza tu experiencia</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Tema</p>
                      <p className="text-sm text-muted-foreground">Claro, oscuro o sistema</p>
                    </div>
                  </div>
                  <ThemeToggle />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Moneda preferida</p>
                      <p className="text-sm text-muted-foreground">Para mostrar precios</p>
                    </div>
                  </div>
                  <Select value={preferredCurrency} onValueChange={setPreferredCurrency}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.code} ({currency.symbol})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Idioma</p>
                      <p className="text-sm text-muted-foreground">Idioma de la aplicacion</p>
                    </div>
                  </div>
                  <Select value={preferredLanguage} onValueChange={setPreferredLanguage}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Cuenta</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <Button variant="destructive" onClick={logout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Cerrar Sesion
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

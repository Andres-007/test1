'use client'

import { useState, useRef, useEffect } from 'react'
import type { Message } from '@/lib/types'
import { processUserMessage } from '@/lib/mock-data'
import { ChatMessage } from './chat-message'
import { ChatInput } from './chat-input'
import { Plane, Loader2, Trophy, Search, MessageSquare, Map, Luggage, GitCompare, Menu, X, Bell, BookOpen, Radar, Wrench, Building2, FileCheck, ClipboardList, User, LayoutDashboard, MapPin, Navigation } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { AuthModal } from '@/components/auth-modal'
import { useUser } from '@/lib/user-context'
import { useLocation } from '@/lib/location-context'

const welcomeMessage: Message = {
  id: 'welcome',
  role: 'assistant',
  content: `Bienvenido a **Vola SV**!\n\nSoy tu asistente inteligente para encontrar los mejores vuelos. Puedo ayudarte a:\n\n- Buscar vuelos desde tu ubicacion actual\n- Comparar precios de diferentes aerolineas\n- Encontrar aeropuertos cercanos\n\n**Tip**: Activa tu ubicacion para que pueda buscar vuelos automaticamente desde el aeropuerto mas cercano.\n\n**A donde quieres viajar hoy?**`,
  timestamp: new Date(),
}

const navigationLinks = [
  { href: '/ranking', icon: Trophy, label: 'Ranking' },
  { href: '/vuelos', icon: Search, label: 'Vuelos' },
  { href: '/comparador', icon: GitCompare, label: 'Comparador' },
  { href: '/seguimiento', icon: Radar, label: 'Rastrear' },
  { href: '/mapa', icon: Map, label: 'Mapa' },
  { href: '/aeropuertos', icon: Building2, label: 'Aeropuertos' },
  { href: '/requisitos', icon: FileCheck, label: 'Requisitos' },
  { href: '/checklist', icon: ClipboardList, label: 'Checklist' },
  { href: '/herramientas', icon: Wrench, label: 'Herramientas' },
  { href: '/equipaje', icon: Luggage, label: 'Equipaje' },
  { href: '/resenas', icon: MessageSquare, label: 'Resenas' },
  { href: '/blog', icon: BookOpen, label: 'Blog' },
  { href: '/alertas', icon: Bell, label: 'Alertas' },
]

export function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([welcomeMessage])
  const [isLoading, setIsLoading] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [hasShownLocationWelcome, setHasShownLocationWelcome] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user, isLoggedIn, logout } = useUser()
  const { location, loading: locationLoading, requestLocation } = useLocation()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Show location-aware welcome when location becomes available
  useEffect(() => {
    if (location && !hasShownLocationWelcome && messages.length === 1) {
      setHasShownLocationWelcome(true)
      const locationWelcome: Message = {
        id: `location-welcome-${Date.now()}`,
        role: 'assistant',
        content: `He detectado tu ubicacion: **${location.city}, ${location.country}**\n\nTu aeropuerto mas cercano es **${location.nearestAirport.name}** (${location.nearestAirport.code}) a ${Math.round(location.nearestAirport.distance)} km.\n\nAhora cuando me digas a donde quieres viajar, buscare vuelos automaticamente desde ${location.nearestAirport.code}. Solo dime tu destino!`,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, locationWelcome])
    }
  }, [location, hasShownLocationWelcome, messages.length])

  const handleSend = async (content: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      // First process with mock data to get the response structure
      const mockResult = processUserMessage(content, location)
      
      // If mock data found flights, try to get real flights
      if (mockResult.flights && mockResult.flights.length > 0) {
        const originCode = mockResult.flights[0].originCode
        const destCode = mockResult.flights[0].destinationCode
        
        // Try to fetch real flights from API
        try {
          const response = await fetch('/api/flights/real', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              origin: originCode,
              destination: destCode,
              departureDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week from now
              adults: 1
            })
          })
          
          const data = await response.json()
          
          if (data.flights && data.flights.length > 0) {
            // Real flights found!
            const assistantMessage: Message = {
              id: `assistant-${Date.now()}`,
              role: 'assistant',
              content: mockResult.response,
              flights: data.flights,
              flightsMeta: {
                isReal: true,
                source: data.source,
                message: `Vuelos reales de ${data.source} - Puedes reservar directamente`
              },
              timestamp: new Date(),
            }
            setMessages((prev) => [...prev, assistantMessage])
            setIsLoading(false)
            return
          }
        } catch {
          // Real flight API failed, continue with mock data
          console.log('[v0] Real flight API unavailable, using mock data')
        }
      }
      
      // Fall back to mock data
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: mockResult.response,
        flights: mockResult.flights,
        flightsMeta: mockResult.flights?.length ? {
          isReal: false,
          source: 'mock',
          message: 'Vuelos de ejemplo - Configura las API keys para vuelos reales'
        } : undefined,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch {
      // Handle any errors
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Lo siento, hubo un error al procesar tu solicitud. Por favor intenta de nuevo.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    }
    
    setIsLoading(false)
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b bg-card px-2 sm:px-4 py-2 sm:py-3 shadow-sm">
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Plane className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="hidden xs:block">
            <h1 className="text-base sm:text-lg font-bold text-foreground">Vola SV</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">Comparador inteligente</p>
          </div>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="hidden lg:flex items-center gap-1">
            {navigationLinks.slice(0, 6).map((link) => (
              <Link key={link.href} href={link.href}>
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs px-2">
                  <link.icon className="h-4 w-4" />
                  <span className="hidden xl:inline">{link.label}</span>
                </Button>
              </Link>
            ))}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8 sm:h-9 sm:w-9"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
          </Button>
          <ThemeToggle />
          {isLoggedIn ? (
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-1 sm:gap-2 px-2 sm:px-3 h-8 sm:h-9">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline text-xs">{user?.name}</span>
              </Button>
            </Link>
          ) : (
            <div className="hidden sm:block">
              <AuthModal />
            </div>
          )}
          {/* Location indicator/button */}
          {location ? (
            <div className="hidden sm:flex items-center gap-2 px-2 py-1 rounded-lg bg-green-500/10 border border-green-500/20">
              <MapPin className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
              <span className="text-xs text-green-700 dark:text-green-300 font-medium truncate max-w-24">
                {location.nearestAirport.code}
              </span>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={requestLocation}
              disabled={locationLoading}
              className="hidden sm:flex gap-1.5 text-xs h-8"
            >
              {locationLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Navigation className="h-3.5 w-3.5" />
              )}
              <span className="hidden md:inline">Ubicacion</span>
            </Button>
          )}
          <div className="hidden sm:flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-green-500" />
            <span className="text-xs text-muted-foreground">En linea</span>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {menuOpen && (
        <nav className="lg:hidden border-b bg-card px-2 sm:px-4 py-2 shadow-sm animate-in slide-in-from-top max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-1 sm:gap-2">
            {navigationLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full gap-1 sm:gap-2 justify-start text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9">
                  <link.icon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">{link.label}</span>
                </Button>
              </Link>
            ))}
          </div>
          {!isLoggedIn && (
            <div className="mt-2 pt-2 border-t sm:hidden">
              <AuthModal />
            </div>
          )}
        </nav>
      )}

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-4xl space-y-6">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3 animate-in fade-in">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-card px-4 py-3 shadow-sm border">
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Buscando vuelos...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input */}
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </div>
  )
}

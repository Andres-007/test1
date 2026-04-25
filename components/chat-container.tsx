'use client'

import { useState, useRef, useEffect } from 'react'
import type { Message } from '@/lib/types'
import { processUserMessage } from '@/lib/mock-data'
import { ChatMessage } from './chat-message'
import { ChatInput } from './chat-input'
import { Plane, Loader2, Trophy, Search, MessageSquare, Map, Luggage, GitCompare, Menu, X, Bell, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const welcomeMessage: Message = {
  id: 'welcome',
  role: 'assistant',
  content: `¡Bienvenido a **Vola SV **! ✈️\n\nSoy tu asistente inteligente para encontrar los mejores vuelos. Puedo ayudarte a:\n\n• 🔍 Buscar vuelos entre cualquier ciudad\n• 💰 Comparar precios de diferentes aerolíneas\n• ⭐ Evaluar opciones según rating y escalas\n\n**¿A dónde quieres viajar hoy?**`,
  timestamp: new Date(),
}

const navigationLinks = [
  { href: '/ranking', icon: Trophy, label: 'Ranking' },
  { href: '/vuelos', icon: Search, label: 'Vuelos' },
  { href: '/comparador', icon: GitCompare, label: 'Comparador' },
  { href: '/resenas', icon: MessageSquare, label: 'Reseñas' },
  { href: '/mapa', icon: Map, label: 'Mapa' },
  { href: '/equipaje', icon: Luggage, label: 'Equipaje' },
  { href: '/blog', icon: BookOpen, label: 'Blog' },
  { href: '/alertas', icon: Bell, label: 'Alertas' },
]

export function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([welcomeMessage])
  const [isLoading, setIsLoading] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (content: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    // Simular delay de respuesta
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 500))

    const { response, flights } = processUserMessage(content)

    const assistantMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: response,
      flights,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, assistantMessage])
    setIsLoading(false)
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b bg-card px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Plane className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Vola SV</h1>
            <p className="text-xs text-muted-foreground">Comparador inteligente de aerolíneas</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1">
            {navigationLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                  <link.icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{link.label}</span>
                </Button>
              </Link>
            ))}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-green-500" />
            <span className="text-xs text-muted-foreground">En línea</span>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {menuOpen && (
        <nav className="md:hidden border-b bg-card px-4 py-2 shadow-sm animate-in slide-in-from-top">
          <div className="grid grid-cols-2 gap-2">
            {navigationLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full gap-2 justify-start">
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>
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

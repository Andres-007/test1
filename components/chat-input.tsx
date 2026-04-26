'use client'

import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Send, Sparkles, MapPin, Navigation, Loader2, Plane } from 'lucide-react'
import { useLocation } from '@/lib/location-context'

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading: boolean
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('')
  const { location, loading: locationLoading, requestLocation } = useLocation()

  // Dynamic suggestions based on location
  const suggestions = location
    ? [
        `Vuelos a Miami`,
        `Quiero ir a Madrid`,
        `Aeropuertos cercanos`,
        `Vuelos baratos a Cancun`,
      ]
    : [
        'Vuelos de Bogota a Miami',
        'Quiero ir a Cancun',
        'Vuelos baratos a Madrid',
        'De Lima a Buenos Aires',
      ]

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      onSend(input.trim())
      setInput('')
    }
  }

  const handleSuggestion = (suggestion: string) => {
    if (!isLoading) {
      onSend(suggestion)
    }
  }

  return (
    <div className="border-t bg-card/80 backdrop-blur-sm p-4">
      {/* Location status bar */}
      {location && (
        <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20">
            <MapPin className="h-3 w-3 text-green-600 dark:text-green-400" />
            <span className="text-green-700 dark:text-green-300 font-medium">
              Saliendo desde {location.nearestAirport.code}
            </span>
          </div>
          <span className="text-muted-foreground/70">
            ({location.city}, {location.country})
          </span>
        </div>
      )}

      {/* Sugerencias */}
      <div className="mb-3 flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => handleSuggestion(suggestion)}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80 disabled:opacity-50"
          >
            <Sparkles className="h-3 w-3" />
            {suggestion}
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        {/* Location button for mobile or when no location */}
        {!location && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={requestLocation}
            disabled={locationLoading}
            className="shrink-0 rounded-xl h-12 w-12"
            title="Usar mi ubicacion"
          >
            {locationLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Navigation className="h-5 w-5" />
            )}
          </Button>
        )}
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              location
                ? `Buscar vuelos desde ${location.nearestAirport.code}...`
                : 'Escribe tu busqueda de vuelos...'
            }
            disabled={isLoading}
            className="w-full rounded-xl border bg-background px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
          />
          {location && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Plane className="h-4 w-4 text-muted-foreground/50" />
            </div>
          )}
        </div>
        <Button
          type="submit"
          disabled={!input.trim() || isLoading}
          size="lg"
          className="rounded-xl px-4"
        >
          <Send className="h-5 w-5" />
          <span className="sr-only">Enviar</span>
        </Button>
      </form>
    </div>
  )
}

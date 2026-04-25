'use client'

import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Send, Sparkles } from 'lucide-react'

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading: boolean
}

const suggestions = [
  'Vuelos de Bogotá a Miami',
  'Quiero ir a Cancún',
  'Vuelos baratos a Madrid',
  'De Lima a Buenos Aires',
]

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('')

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
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu búsqueda de vuelos..."
            disabled={isLoading}
            className="w-full rounded-xl border bg-background px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
          />
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

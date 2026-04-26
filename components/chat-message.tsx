'use client'

import type { Message } from '@/lib/types'
import { FlightCard } from './flight-card'
import { Bot, User, Info, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant'

  return (
    <div
      className={cn(
        'flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300',
        isAssistant ? 'flex-row' : 'flex-row-reverse'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
          isAssistant ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
        )}
      >
        {isAssistant ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
      </div>

      {/* Contenido */}
      <div className={cn('flex max-w-[85%] flex-col gap-3', !isAssistant && 'items-end')}>
        <div
          className={cn(
            'rounded-2xl px-4 py-3',
            isAssistant
              ? 'bg-card text-card-foreground shadow-sm border'
              : 'bg-primary text-primary-foreground'
          )}
        >
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {message.content.split('\n').map((line, i) => (
              <p key={i} className="mb-1 last:mb-0">
                {line.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/).map((part, j) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={j}>{part.slice(2, -2)}</strong>
                  }
                  if (part.startsWith('*') && part.endsWith('*')) {
                    return <em key={j}>{part.slice(1, -1)}</em>
                  }
                  return part
                })}
              </p>
            ))}
          </div>
        </div>

        {/* Tarjetas de vuelos */}
        {message.flights && message.flights.length > 0 && (
          <>
            {/* Flight source indicator */}
            {message.flightsMeta && (
              <div className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm",
                message.flightsMeta.isReal 
                  ? "bg-green-500/10 text-green-700 dark:text-green-300 border border-green-500/20"
                  : "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20"
              )}>
                {message.flightsMeta.isReal ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                ) : (
                  <Info className="h-4 w-4 shrink-0" />
                )}
                <span>{message.flightsMeta.message || (message.flightsMeta.isReal ? 'Vuelos reales' : 'Vuelos de ejemplo')}</span>
              </div>
            )}
            <div className="grid w-full gap-3 sm:grid-cols-1 lg:grid-cols-2">
              {message.flights.map((flight, index) => (
                <FlightCard key={flight.id} flight={flight} index={index} />
              ))}
            </div>
          </>
        )}

        {/* Timestamp */}
        <p className="text-xs text-muted-foreground">
          {message.timestamp.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  )
}

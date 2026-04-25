import type { Airline, Flight } from './types'

export const airlines: Airline[] = [
  { id: '1', name: 'Aeroméxico', logo: '🇲🇽', rating: 4.2 },
  { id: '2', name: 'LATAM Airlines', logo: '🌎', rating: 4.0 },
  { id: '3', name: 'Avianca', logo: '🦅', rating: 3.9 },
  { id: '4', name: 'Copa Airlines', logo: '✈️', rating: 4.1 },
  { id: '5', name: 'Volaris', logo: '💚', rating: 3.7 },
  { id: '6', name: 'Interjet', logo: '🔴', rating: 3.5 },
  { id: '7', name: 'VivaAerobus', logo: '🟡', rating: 3.6 },
  { id: '8', name: 'American Airlines', logo: '🦅', rating: 4.3 },
]

export const destinations = [
  { city: 'Ciudad de México', code: 'MEX', country: 'México' },
  { city: 'Bogotá', code: 'BOG', country: 'Colombia' },
  { city: 'Lima', code: 'LIM', country: 'Perú' },
  { city: 'Buenos Aires', code: 'EZE', country: 'Argentina' },
  { city: 'Santiago', code: 'SCL', country: 'Chile' },
  { city: 'Cancún', code: 'CUN', country: 'México' },
  { city: 'Miami', code: 'MIA', country: 'Estados Unidos' },
  { city: 'Madrid', code: 'MAD', country: 'España' },
  { city: 'São Paulo', code: 'GRU', country: 'Brasil' },
  { city: 'Panamá', code: 'PTY', country: 'Panamá' },
]

export function generateFlights(origin: string, destination: string): Flight[] {
  const originData = destinations.find(d => 
    d.city.toLowerCase().includes(origin.toLowerCase()) || 
    d.code.toLowerCase() === origin.toLowerCase()
  ) || destinations[0]
  
  const destData = destinations.find(d => 
    d.city.toLowerCase().includes(destination.toLowerCase()) || 
    d.code.toLowerCase() === destination.toLowerCase()
  ) || destinations[1]

  const selectedAirlines = airlines.sort(() => Math.random() - 0.5).slice(0, 5)
  
  return selectedAirlines.map((airline, index) => {
    const basePrice = Math.floor(Math.random() * 500) + 200
    const hours = Math.floor(Math.random() * 8) + 2
    const minutes = Math.floor(Math.random() * 60)
    const stops = Math.floor(Math.random() * 3)
    
    const departureHour = 6 + index * 3
    const arrivalHour = (departureHour + hours) % 24
    
    return {
      id: `flight-${index}-${Date.now()}`,
      airline,
      origin: originData.city,
      originCode: originData.code,
      destination: destData.city,
      destinationCode: destData.code,
      departureTime: `${departureHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
      arrivalTime: `${arrivalHour.toString().padStart(2, '0')}:${(minutes + 30) % 60}`.padStart(5, '0'),
      duration: `${hours}h ${minutes}m`,
      price: basePrice + (stops === 0 ? 100 : 0),
      stops,
      class: 'economy' as const,
    }
  }).sort((a, b) => a.price - b.price)
}

export function processUserMessage(message: string): { response: string; flights?: Flight[] } {
  const lowerMessage = message.toLowerCase()
  
  // Detectar origen y destino
  const fromMatch = lowerMessage.match(/(?:de|desde|from)\s+(\w+(?:\s+\w+)?)/i)
  const toMatch = lowerMessage.match(/(?:a|hacia|to|para)\s+(\w+(?:\s+\w+)?)/i)
  
  if (fromMatch && toMatch) {
    const origin = fromMatch[1]
    const destination = toMatch[1]
    const flights = generateFlights(origin, destination)
    
    return {
      response: `¡Excelente! He encontrado ${flights.length} opciones de vuelo de **${flights[0].origin}** a **${flights[0].destination}**. Aquí están las mejores opciones ordenadas por precio:`,
      flights,
    }
  }
  
  // Detectar solo destino
  const destinationOnly = destinations.find(d => 
    lowerMessage.includes(d.city.toLowerCase()) || 
    lowerMessage.includes(d.code.toLowerCase())
  )
  
  if (destinationOnly) {
    const flights = generateFlights('Ciudad de México', destinationOnly.city)
    return {
      response: `He encontrado vuelos a **${destinationOnly.city}, ${destinationOnly.country}**. Asumí que sales desde Ciudad de México. ¿Es correcto? Aquí están las opciones:`,
      flights,
    }
  }
  
  // Palabras clave de búsqueda
  if (lowerMessage.includes('vuelo') || lowerMessage.includes('viajar') || lowerMessage.includes('buscar') || lowerMessage.includes('precio')) {
    return {
      response: `¡Hola! Soy tu asistente de vuelos ✈️ Para ayudarte a encontrar las mejores opciones, necesito saber:\n\n• **¿Desde dónde sales?** (ej: Ciudad de México, Bogotá)\n• **¿A dónde quieres ir?** (ej: Cancún, Miami)\n\nPuedes escribirme algo como: *"Quiero un vuelo de Bogotá a Miami"*`,
    }
  }
  
  // Saludo inicial
  if (lowerMessage.includes('hola') || lowerMessage.includes('buenos') || lowerMessage.includes('hey') || message.length < 10) {
    return {
      response: `¡Hola! 👋 Soy **SkyCompare**, tu asistente inteligente para comparar vuelos.\n\nPuedo ayudarte a:\n• 🔍 Buscar vuelos entre ciudades\n• 💰 Comparar precios de diferentes aerolíneas\n• ⭐ Mostrarte las mejores opciones según tus necesidades\n\n**¿A dónde te gustaría viajar?** Solo dime tu origen y destino.`,
    }
  }
  
  // Respuesta por defecto
  return {
    response: `Entiendo que buscas información sobre vuelos. Para darte las mejores opciones, por favor indícame tu **ciudad de origen** y **destino**.\n\nPor ejemplo: *"Busco un vuelo de Lima a Buenos Aires"*`,
  }
}

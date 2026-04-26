import type { Airline, Flight } from './types'
import { popularAirports } from './flights-data'

export const airlines: Airline[] = [
  { id: '1', name: 'Aeromexico', logo: 'AM', rating: 4.2 },
  { id: '2', name: 'LATAM Airlines', logo: 'LA', rating: 4.0 },
  { id: '3', name: 'Avianca', logo: 'AV', rating: 3.9 },
  { id: '4', name: 'Copa Airlines', logo: 'CM', rating: 4.1 },
  { id: '5', name: 'Volaris', logo: 'Y4', rating: 3.7 },
  { id: '6', name: 'Spirit Airlines', logo: 'NK', rating: 3.5 },
  { id: '7', name: 'JetBlue', logo: 'B6', rating: 4.0 },
  { id: '8', name: 'American Airlines', logo: 'AA', rating: 4.3 },
  { id: '9', name: 'United Airlines', logo: 'UA', rating: 4.1 },
  { id: '10', name: 'Delta Air Lines', logo: 'DL', rating: 4.4 },
  { id: '11', name: 'Air France', logo: 'AF', rating: 4.2 },
  { id: '12', name: 'Lufthansa', logo: 'LH', rating: 4.3 },
  { id: '13', name: 'Iberia', logo: 'IB', rating: 4.0 },
  { id: '14', name: 'Emirates', logo: 'EK', rating: 4.7 },
  { id: '15', name: 'Qatar Airways', logo: 'QR', rating: 4.6 },
  { id: '16', name: 'Turkish Airlines', logo: 'TK', rating: 4.3 },
  { id: '17', name: 'British Airways', logo: 'BA', rating: 4.1 },
  { id: '18', name: 'KLM', logo: 'KL', rating: 4.2 },
  { id: '19', name: 'Singapore Airlines', logo: 'SQ', rating: 4.8 },
  { id: '20', name: 'Cathay Pacific', logo: 'CX', rating: 4.5 },
]

// Funcion para buscar aeropuerto por nombre, ciudad o codigo
function findAirport(query: string): { code: string; city: string; country: string } | null {
  const normalizedQuery = query.toLowerCase().trim()
  
  // Buscar por codigo exacto
  const byCode = popularAirports.find(a => a.code.toLowerCase() === normalizedQuery)
  if (byCode) return { code: byCode.code, city: byCode.city, country: byCode.country }
  
  // Buscar por ciudad
  const byCity = popularAirports.find(a => 
    a.city.toLowerCase().includes(normalizedQuery) ||
    normalizedQuery.includes(a.city.toLowerCase())
  )
  if (byCity) return { code: byCity.code, city: byCity.city, country: byCity.country }
  
  // Buscar por nombre de aeropuerto
  const byName = popularAirports.find(a => 
    a.name.toLowerCase().includes(normalizedQuery)
  )
  if (byName) return { code: byName.code, city: byName.city, country: byName.country }
  
  // Buscar por pais
  const byCountry = popularAirports.find(a => 
    a.country.toLowerCase().includes(normalizedQuery) ||
    normalizedQuery.includes(a.country.toLowerCase())
  )
  if (byCountry) return { code: byCountry.code, city: byCountry.city, country: byCountry.country }
  
  return null
}

// Extraer ciudades del mensaje
function extractLocations(message: string): { origin: string | null; destination: string | null } {
  const lowerMessage = message.toLowerCase()
  
  // Patrones para origen
  const originPatterns = [
    /(?:de|desde|from|saliendo de|salir de|sale de|partir de)\s+([a-záéíóúñü\s]+?)(?:\s+(?:a|hacia|to|para|hasta)|$|,|\.|!|\?)/i,
    /(?:origen|origin)[\s:]+([a-záéíóúñü\s]+?)(?:\s+(?:a|hacia|to|para|hasta)|$|,|\.|!|\?)/i,
  ]
  
  // Patrones para destino
  const destinationPatterns = [
    /(?:a|hacia|to|para|hasta|ir a|viajar a|llegar a|destino)\s+([a-záéíóúñü\s]+?)(?:$|,|\.|!|\?|\s+(?:de|desde|from))/i,
    /(?:destino|destination)[\s:]+([a-záéíóúñü\s]+?)(?:$|,|\.|!|\?)/i,
  ]
  
  let origin: string | null = null
  let destination: string | null = null
  
  for (const pattern of originPatterns) {
    const match = lowerMessage.match(pattern)
    if (match && match[1]) {
      origin = match[1].trim()
      break
    }
  }
  
  for (const pattern of destinationPatterns) {
    const match = lowerMessage.match(pattern)
    if (match && match[1]) {
      destination = match[1].trim()
      break
    }
  }
  
  // Si no encontramos con patrones, buscar ciudades directamente en el mensaje
  if (!origin || !destination) {
    const words = lowerMessage.split(/\s+/)
    const foundCities: { code: string; city: string; country: string; index: number }[] = []
    
    for (let i = 0; i < words.length; i++) {
      // Buscar combinaciones de 1, 2 y 3 palabras
      for (let len = 3; len >= 1; len--) {
        if (i + len <= words.length) {
          const phrase = words.slice(i, i + len).join(' ')
          const airport = findAirport(phrase)
          if (airport && !foundCities.some(c => c.code === airport.code)) {
            foundCities.push({ ...airport, index: i })
            break
          }
        }
      }
    }
    
    if (foundCities.length >= 2) {
      // Ordenar por posicion en el mensaje
      foundCities.sort((a, b) => a.index - b.index)
      if (!origin) origin = foundCities[0].city
      if (!destination) destination = foundCities[1].city
    } else if (foundCities.length === 1) {
      if (!destination) destination = foundCities[0].city
    }
  }
  
  return { origin, destination }
}

export function generateFlights(origin: string, destination: string): Flight[] {
  const originAirport = findAirport(origin)
  const destAirport = findAirport(destination)
  
  if (!originAirport || !destAirport) {
    return []
  }

  const selectedAirlines = airlines.sort(() => Math.random() - 0.5).slice(0, 6)
  
  return selectedAirlines.map((airline, index) => {
    const basePrice = Math.floor(Math.random() * 800) + 150
    const hours = Math.floor(Math.random() * 12) + 2
    const minutes = Math.floor(Math.random() * 60)
    const stops = Math.floor(Math.random() * 3)
    
    const departureHour = 6 + index * 3
    const arrivalHour = (departureHour + hours) % 24
    
    return {
      id: `flight-${index}-${Date.now()}`,
      airline,
      origin: originAirport.city,
      originCode: originAirport.code,
      destination: destAirport.city,
      destinationCode: destAirport.code,
      departureTime: `${departureHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
      arrivalTime: `${arrivalHour.toString().padStart(2, '0')}:${(minutes + 30) % 60}`.padStart(5, '0').slice(-5),
      duration: `${hours}h ${minutes}m`,
      price: basePrice + (stops === 0 ? 100 : 0),
      stops,
      class: 'economy' as const,
    }
  }).sort((a, b) => a.price - b.price)
}

export function processUserMessage(message: string): { response: string; flights?: Flight[] } {
  const lowerMessage = message.toLowerCase()
  
  // Extraer origen y destino del mensaje
  const { origin, destination } = extractLocations(message)
  
  // Si tenemos origen y destino
  if (origin && destination) {
    const originAirport = findAirport(origin)
    const destAirport = findAirport(destination)
    
    if (originAirport && destAirport) {
      const flights = generateFlights(origin, destination)
      
      if (flights.length > 0) {
        return {
          response: `He encontrado **${flights.length} vuelos** de **${originAirport.city}, ${originAirport.country}** (${originAirport.code}) a **${destAirport.city}, ${destAirport.country}** (${destAirport.code}).\n\nAqui estan las mejores opciones ordenadas por precio:`,
          flights,
        }
      }
    } else if (!originAirport && destAirport) {
      return {
        response: `No encontre el aeropuerto de origen "${origin}". Por favor verifica el nombre de la ciudad o usa el codigo del aeropuerto (ej: MAD, JFK, MEX).\n\nDestino detectado: **${destAirport.city}** (${destAirport.code})`,
      }
    } else if (originAirport && !destAirport) {
      return {
        response: `No encontre el aeropuerto de destino "${destination}". Por favor verifica el nombre de la ciudad o usa el codigo del aeropuerto (ej: MAD, JFK, MEX).\n\nOrigen detectado: **${originAirport.city}** (${originAirport.code})`,
      }
    }
  }
  
  // Si solo tenemos destino
  if (destination && !origin) {
    const destAirport = findAirport(destination)
    if (destAirport) {
      return {
        response: `Quieres viajar a **${destAirport.city}, ${destAirport.country}** (${destAirport.code}).\n\nPara buscar vuelos, necesito saber desde donde sales. Por ejemplo:\n*"Vuelo desde San Salvador a ${destAirport.city}"*`,
      }
    }
  }
  
  // Detectar si menciona alguna ciudad conocida
  const mentionedAirport = popularAirports.find(a => 
    lowerMessage.includes(a.city.toLowerCase()) ||
    lowerMessage.includes(a.code.toLowerCase()) ||
    lowerMessage.includes(a.country.toLowerCase())
  )
  
  if (mentionedAirport) {
    return {
      response: `Detecte que mencionas **${mentionedAirport.city}, ${mentionedAirport.country}** (${mentionedAirport.code}).\n\nPara buscar vuelos, dime el origen y destino. Por ejemplo:\n*"Busco vuelo de Miami a ${mentionedAirport.city}"*\no\n*"Vuelo desde ${mentionedAirport.city} a Nueva York"*`,
    }
  }
  
  // Palabras clave de busqueda
  if (lowerMessage.includes('vuelo') || lowerMessage.includes('viajar') || lowerMessage.includes('buscar') || lowerMessage.includes('precio') || lowerMessage.includes('pasaje')) {
    return {
      response: `Para buscar vuelos, necesito saber:\n\n• **Origen**: Desde donde sales\n• **Destino**: A donde quieres ir\n\nPuedes escribirme algo como:\n*"Vuelo de San Salvador a Miami"*\n*"Busco pasaje desde Mexico a Madrid"*\n*"De Bogota a Buenos Aires"*\n\nTengo informacion de mas de **120 aeropuertos** en todo el mundo.`,
    }
  }
  
  // Saludo inicial
  if (lowerMessage.includes('hola') || lowerMessage.includes('buenos') || lowerMessage.includes('hey') || lowerMessage.includes('hi') || message.length < 10) {
    return {
      response: `Hola! Soy **Vola SV**, tu asistente de vuelos.\n\nPuedo ayudarte a:\n• Buscar vuelos entre mas de **120 aeropuertos** del mundo\n• Comparar precios de diferentes aerolineas\n• Mostrarte las mejores opciones\n\n**Ejemplo**: *"Quiero un vuelo de San Salvador a Nueva York"*\n\nA donde te gustaria viajar?`,
    }
  }
  
  // Preguntas de ayuda
  if (lowerMessage.includes('ayuda') || lowerMessage.includes('help') || lowerMessage.includes('como funciona') || lowerMessage.includes('que puedes')) {
    return {
      response: `**Como usar Vola SV:**\n\n1. Escribeme tu origen y destino\n   Ejemplo: *"De Lima a Santiago"*\n\n2. Te mostrare las mejores opciones de vuelo\n\n3. Puedes comparar precios, escalas y aerolineas\n\n**Destinos disponibles:**\nEuropa, Norteamerica, Centroamerica, Sudamerica, Asia, Africa y Oceania.\n\n**Codigos de aeropuertos comunes:**\n• SAL - San Salvador\n• MEX - Ciudad de Mexico\n• MIA - Miami\n• JFK - Nueva York\n• MAD - Madrid\n• BOG - Bogota`,
    }
  }
  
  // Respuesta por defecto
  return {
    response: `No entendi bien tu solicitud. Para buscar vuelos, escribeme algo como:\n\n*"Vuelo de San Salvador a Miami"*\n*"De Mexico a Madrid"*\n*"Busco pasaje desde Bogota a Lima"*\n\nO escribe **"ayuda"** para mas informacion.`,
  }
}

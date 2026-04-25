export interface Review {
  id: string
  airlineId: string
  airlineName: string
  airlineCode: string
  author: {
    name: string
    avatar?: string
    country: string
    travelerType: 'business' | 'leisure' | 'solo' | 'family'
  }
  date: string
  route: {
    origin: string
    destination: string
  }
  cabinClass: 'economy' | 'premium-economy' | 'business' | 'first'
  verified: boolean
  ratings: {
    overall: number
    seatComfort: number
    service: number
    food: number
    entertainment: number
    valueForMoney: number
  }
  title: string
  content: string
  pros: string[]
  cons: string[]
  wouldRecommend: boolean
  helpful: number
}

export const sampleReviews: Review[] = [
  {
    id: '1',
    airlineId: 'singapore-airlines',
    airlineName: 'Singapore Airlines',
    airlineCode: 'SQ',
    author: {
      name: 'Carlos M.',
      country: 'Espana',
      travelerType: 'business',
    },
    date: '2024-01-15',
    route: {
      origin: 'Madrid',
      destination: 'Singapur',
    },
    cabinClass: 'business',
    verified: true,
    ratings: {
      overall: 5,
      seatComfort: 5,
      service: 5,
      food: 5,
      entertainment: 5,
      valueForMoney: 4,
    },
    title: 'La mejor experiencia de vuelo de mi vida',
    content: 'Increible experiencia en clase business. El asiento se convierte en una cama completamente plana, la comida es de restaurante con estrella Michelin y el servicio es impecable. La tripulacion siempre atenta pero sin ser invasiva. El sistema de entretenimiento tiene una seleccion enorme de peliculas y series.',
    pros: ['Asiento-cama increible', 'Comida gourmet', 'Servicio excepcional'],
    cons: ['Precio elevado'],
    wouldRecommend: true,
    helpful: 127,
  },
  {
    id: '2',
    airlineId: 'ryanair',
    airlineName: 'Ryanair',
    airlineCode: 'FR',
    author: {
      name: 'Maria L.',
      country: 'Espana',
      travelerType: 'leisure',
    },
    date: '2024-02-20',
    route: {
      origin: 'Barcelona',
      destination: 'Roma',
    },
    cabinClass: 'economy',
    verified: true,
    ratings: {
      overall: 3,
      seatComfort: 2,
      service: 2,
      food: 1,
      entertainment: 1,
      valueForMoney: 5,
    },
    title: 'Cumple su funcion: llevarte de A a B barato',
    content: 'Es lo que es: una aerolinea low cost. El vuelo fue puntual, que es lo mas importante. Los asientos son estrechos pero para un vuelo de 2 horas es soportable. No esperes servicios extras porque todo es de pago. Pero si buscas precio, es imbatible.',
    pros: ['Precio muy bajo', 'Vuelo puntual', 'Muchas frecuencias'],
    cons: ['Asientos incomodos', 'Todo extra es de pago', 'Equipaje limitado'],
    wouldRecommend: true,
    helpful: 89,
  },
  {
    id: '3',
    airlineId: 'emirates',
    airlineName: 'Emirates',
    airlineCode: 'EK',
    author: {
      name: 'Juan P.',
      country: 'Mexico',
      travelerType: 'family',
    },
    date: '2024-01-28',
    route: {
      origin: 'Ciudad de Mexico',
      destination: 'Dubai',
    },
    cabinClass: 'economy',
    verified: true,
    ratings: {
      overall: 4,
      seatComfort: 4,
      service: 5,
      food: 4,
      entertainment: 5,
      valueForMoney: 4,
    },
    title: 'Excelente servicio incluso en clase turista',
    content: 'Viaje familiar a Dubai y la experiencia fue muy buena. El A380 es impresionante, los asientos de economia son mas amplios que otras aerolineas. El sistema ICE de entretenimiento es el mejor que he visto, con miles de opciones. La comida decente y el servicio muy profesional.',
    pros: ['Entretenimiento ICE increible', 'A380 espacioso', 'Servicio profesional'],
    cons: ['Escala larga en Dubai', 'WiFi caro'],
    wouldRecommend: true,
    helpful: 156,
  },
  {
    id: '4',
    airlineId: 'iberia',
    airlineName: 'Iberia',
    airlineCode: 'IB',
    author: {
      name: 'Ana G.',
      country: 'Argentina',
      travelerType: 'solo',
    },
    date: '2024-02-10',
    route: {
      origin: 'Buenos Aires',
      destination: 'Madrid',
    },
    cabinClass: 'premium-economy',
    verified: true,
    ratings: {
      overall: 4,
      seatComfort: 4,
      service: 4,
      food: 3,
      entertainment: 4,
      valueForMoney: 4,
    },
    title: 'Buena opcion para vuelos a Espana',
    content: 'La clase turista premium vale la pena en vuelos largos. Mas espacio para las piernas, asiento mas ancho y mejor comida. La tripulacion hispanohablante es un plus cuando viajas sola. El entretenimiento esta bien aunque la seleccion de peliculas podria ser mejor.',
    pros: ['Conexion directa', 'Tripulacion amable', 'Buen espacio en premium'],
    cons: ['Comida mejorable', 'Aviones algo antiguos'],
    wouldRecommend: true,
    helpful: 73,
  },
  {
    id: '5',
    airlineId: 'qatar-airways',
    airlineName: 'Qatar Airways',
    airlineCode: 'QR',
    author: {
      name: 'Pedro S.',
      country: 'Chile',
      travelerType: 'business',
    },
    date: '2024-02-05',
    route: {
      origin: 'Santiago',
      destination: 'Bangkok',
    },
    cabinClass: 'business',
    verified: true,
    ratings: {
      overall: 5,
      seatComfort: 5,
      service: 5,
      food: 5,
      entertainment: 5,
      valueForMoney: 4,
    },
    title: 'Qsuite: lo mejor del cielo',
    content: 'El producto Qsuite es simplemente espectacular. Una suite privada con puerta, cama totalmente plana y la opcion de crear un espacio compartido si viajas con alguien. El lounge en Doha es de otro nivel. La comida a la carta exquisita y el servicio qatari impecable.',
    pros: ['Qsuite privada', 'Lounge Al Mourjan', 'Comida excepcional'],
    cons: ['Escala obligatoria en Doha'],
    wouldRecommend: true,
    helpful: 198,
  },
]

export function getReviewsByAirline(airlineId: string): Review[] {
  return sampleReviews.filter((review) => review.airlineId === airlineId)
}

export function getLatestReviews(limit: number = 5): Review[] {
  return [...sampleReviews]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
}

export function getAverageRating(reviews: Review[]): number {
  if (reviews.length === 0) return 0
  const sum = reviews.reduce((acc, review) => acc + review.ratings.overall, 0)
  return Math.round((sum / reviews.length) * 10) / 10
}

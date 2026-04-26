import { ItineraryExport } from '@/components/itinerary-export'

export const metadata = {
  title: 'Itinerario de Viaje - FlyBot',
  description: 'Crea y exporta tu itinerario de viaje a PDF',
}

export default function ItinerarioPage() {
  return <ItineraryExport />
}

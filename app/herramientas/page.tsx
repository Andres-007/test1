import type { Metadata } from 'next'
import { TravelTools } from '@/components/travel-tools'

export const metadata: Metadata = {
  title: 'Herramientas de Viaje - SkyCompare',
  description: 'Conversor de monedas, calculadora de millas, guia de aeropuertos y mas',
}

export default function ToolsPage() {
  return <TravelTools />
}

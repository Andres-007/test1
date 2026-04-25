import type { Metadata } from 'next'
import { AirportsGuide } from '@/components/airports-guide'

export const metadata: Metadata = {
  title: 'Guia de Aeropuertos - SkyCompare',
  description: 'Informacion detallada de aeropuertos: mapas, lounges, WiFi, transporte y tiempos de conexion',
}

export default function AirportsPage() {
  return <AirportsGuide />
}

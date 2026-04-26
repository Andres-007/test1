import type { Metadata } from 'next'
import { FlightTracker } from '@/components/flight-tracker'

export const metadata: Metadata = {
  title: 'Seguimiento de Vuelos - SkyCompare',
  description: 'Rastrea vuelos en tiempo real con informacion de estado, retrasos y puerta de embarque',
}

export default function FlightTrackerPage() {
  return <FlightTracker />
}

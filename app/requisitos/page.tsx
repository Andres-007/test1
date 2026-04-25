import type { Metadata } from 'next'
import { TravelRequirements } from '@/components/travel-requirements'

export const metadata: Metadata = {
  title: 'Requisitos de Viaje - SkyCompare',
  description: 'Verifica requisitos de visa, pasaporte y vacunas para tu destino',
}

export default function RequirementsPage() {
  return <TravelRequirements />
}

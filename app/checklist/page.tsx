import type { Metadata } from 'next'
import { TravelChecklist } from '@/components/travel-checklist'

export const metadata: Metadata = {
  title: 'Checklist de Viaje - SkyCompare',
  description: 'Lista interactiva de cosas que preparar antes de tu vuelo',
}

export default function ChecklistPage() {
  return <TravelChecklist />
}

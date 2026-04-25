import { BaggageCalculator } from '@/components/baggage-calculator'

export const metadata = {
  title: 'Calculadora de Equipaje - SkyCompare',
  description: 'Verifica si tu equipaje cumple con las politicas de cada aerolinea antes de viajar.',
}

export default function EquipajePage() {
  return <BaggageCalculator />
}

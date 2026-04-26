import { TimezoneCalculator } from '@/components/timezone-calculator'

export const metadata = {
  title: 'Calculadora de Diferencia Horaria - FlyBot',
  description: 'Calcula la diferencia horaria entre ciudades para planificar tu viaje',
}

export default function HorariosPage() {
  return <TimezoneCalculator />
}

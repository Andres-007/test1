import { AirlineComparator } from '@/components/airline-comparator'

export const metadata = {
  title: 'Comparador de Aerolineas - SkyCompare',
  description: 'Compara aerolineas lado a lado: precios, servicios, equipaje, puntualidad y mas.',
}

export default function ComparadorPage() {
  return <AirlineComparator />
}

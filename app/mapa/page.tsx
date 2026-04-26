import { RoutesMap } from '@/components/routes-map'

export const metadata = {
  title: 'Mapa de Rutas - SkyCompare',
  description: 'Explora las rutas aereas de las principales aerolineas del mundo en un mapa interactivo.',
}

export default function MapaPage() {
  return <RoutesMap />
}

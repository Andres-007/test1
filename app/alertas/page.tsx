import { Metadata } from 'next'
import { PriceAlerts } from '@/components/price-alerts'

export const metadata: Metadata = {
  title: 'Alertas de Precios | Vola SV',
  description: 'Recibe notificaciones cuando bajen los precios de tus rutas favoritas',
}

export default function AlertasPage() {
  return <PriceAlerts />
}

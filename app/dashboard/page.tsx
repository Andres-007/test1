import type { Metadata } from 'next'
import { UserDashboard } from '@/components/user-dashboard'

export const metadata: Metadata = {
  title: 'Mi Dashboard - SkyCompare',
  description: 'Tu panel personal con vuelos guardados, alertas y preferencias',
}

export default function DashboardPage() {
  return <UserDashboard />
}

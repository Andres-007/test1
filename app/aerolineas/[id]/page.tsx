import { notFound } from 'next/navigation'
import { AirlineDetail } from '@/components/airline-detail'
import { getAirlineById, airlinesData } from '@/lib/airlines-data'

export async function generateStaticParams() {
  return airlinesData.map((airline) => ({
    id: airline.id,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const airline = getAirlineById(id)

  if (!airline) {
    return {
      title: 'Aerolinea no encontrada - SkyCompare',
    }
  }

  return {
    title: `${airline.name} - Informacion y Reseñas | SkyCompare`,
    description: `Descubre todo sobre ${airline.name}: rating ${airline.rating}/5, ${airline.reviews} opiniones, flota, destinos y servicios.`,
  }
}

export default async function AirlineDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const airline = getAirlineById(id)

  if (!airline) {
    notFound()
  }

  return <AirlineDetail airline={airline} />
}

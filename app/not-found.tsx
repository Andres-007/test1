import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plane, Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="relative mb-8">
        <div className="text-[150px] font-bold leading-none text-muted-foreground/20 sm:text-[200px]">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-bounce">
            <Plane className="h-16 w-16 rotate-45 text-primary sm:h-24 sm:w-24" />
          </div>
        </div>
      </div>

      <h1 className="mb-2 text-2xl font-bold sm:text-3xl">
        Vuelo no encontrado
      </h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        Parece que este destino no existe en nuestro radar. 
        El vuelo que buscas puede haber sido cancelado o la ruta ya no esta disponible.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/">
          <Button className="gap-2">
            <Home className="h-4 w-4" />
            Volver al inicio
          </Button>
        </Link>
        <Link href="/vuelos">
          <Button variant="outline" className="gap-2">
            <Search className="h-4 w-4" />
            Buscar vuelos
          </Button>
        </Link>
      </div>

      <p className="mt-12 text-sm text-muted-foreground">
        Si crees que esto es un error, contacta con nuestro{' '}
        <Link href="/chat" className="text-primary hover:underline">
          asistente virtual
        </Link>
      </p>
    </div>
  )
}

"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useUser, ChecklistItem } from '@/lib/user-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ThemeToggle } from '@/components/theme-toggle'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft,
  Plus,
  Trash2,
  FileText,
  Briefcase,
  CheckSquare,
  Plane,
  RotateCcw,
} from 'lucide-react'

const defaultChecklists: Record<string, Omit<ChecklistItem, 'id'>[]> = {
  documents: [
    { text: 'Pasaporte vigente', completed: false, category: 'documents' },
    { text: 'Visa (si es necesaria)', completed: false, category: 'documents' },
    { text: 'Tarjeta de embarque impresa o en el movil', completed: false, category: 'documents' },
    { text: 'Reserva del hotel', completed: false, category: 'documents' },
    { text: 'Seguro de viaje', completed: false, category: 'documents' },
    { text: 'Licencia de conducir internacional (si aplica)', completed: false, category: 'documents' },
    { text: 'Tarjetas de credito/debito', completed: false, category: 'documents' },
    { text: 'Efectivo en moneda local', completed: false, category: 'documents' },
  ],
  packing: [
    { text: 'Ropa para el clima del destino', completed: false, category: 'packing' },
    { text: 'Articulos de higiene personal', completed: false, category: 'packing' },
    { text: 'Medicamentos necesarios', completed: false, category: 'packing' },
    { text: 'Cargadores y adaptadores de corriente', completed: false, category: 'packing' },
    { text: 'Auriculares', completed: false, category: 'packing' },
    { text: 'Libro o entretenimiento', completed: false, category: 'packing' },
    { text: 'Almohada de viaje', completed: false, category: 'packing' },
    { text: 'Snacks para el vuelo', completed: false, category: 'packing' },
    { text: 'Botella de agua vacia (llenar despues de seguridad)', completed: false, category: 'packing' },
  ],
  preparation: [
    { text: 'Hacer check-in online', completed: false, category: 'preparation' },
    { text: 'Verificar restricciones de equipaje', completed: false, category: 'preparation' },
    { text: 'Notificar al banco sobre el viaje', completed: false, category: 'preparation' },
    { text: 'Activar roaming o comprar SIM local', completed: false, category: 'preparation' },
    { text: 'Descargar mapas offline', completed: false, category: 'preparation' },
    { text: 'Revisar el clima del destino', completed: false, category: 'preparation' },
    { text: 'Confirmar transporte al aeropuerto', completed: false, category: 'preparation' },
    { text: 'Dejar copia de documentos a un familiar', completed: false, category: 'preparation' },
  ],
  airport: [
    { text: 'Llegar 2-3 horas antes (vuelos internacionales)', completed: false, category: 'airport' },
    { text: 'Liquidos en bolsa transparente (max 100ml)', completed: false, category: 'airport' },
    { text: 'Quitar laptop y liquidos del equipaje de mano', completed: false, category: 'airport' },
    { text: 'Verificar puerta de embarque', completed: false, category: 'airport' },
    { text: 'Cargar dispositivos electronicos', completed: false, category: 'airport' },
    { text: 'Revisar ultima llamada de embarque', completed: false, category: 'airport' },
  ],
}

const categoryConfig = {
  documents: { label: 'Documentos', icon: FileText, color: 'text-blue-500' },
  packing: { label: 'Equipaje', icon: Briefcase, color: 'text-purple-500' },
  preparation: { label: 'Preparacion', icon: CheckSquare, color: 'text-green-500' },
  airport: { label: 'En el aeropuerto', icon: Plane, color: 'text-orange-500' },
}

export function TravelChecklist() {
  const { checklist, updateChecklist, toggleChecklistItem, isLoggedIn } = useUser()
  const [newItem, setNewItem] = useState('')
  const [activeCategory, setActiveCategory] = useState<ChecklistItem['category']>('documents')
  const [localChecklist, setLocalChecklist] = useState<ChecklistItem[]>([])

  // Initialize checklist
  useEffect(() => {
    if (isLoggedIn && checklist.length > 0) {
      setLocalChecklist(checklist)
    } else if (localChecklist.length === 0) {
      // Load default checklist
      const defaultItems: ChecklistItem[] = Object.entries(defaultChecklists).flatMap(
        ([, items]) => items.map(item => ({ ...item, id: crypto.randomUUID() }))
      )
      setLocalChecklist(defaultItems)
      if (isLoggedIn) {
        updateChecklist(defaultItems)
      }
    }
  }, [isLoggedIn, checklist, updateChecklist, localChecklist.length])

  const handleToggle = (id: string) => {
    const updated = localChecklist.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    )
    setLocalChecklist(updated)
    if (isLoggedIn) {
      toggleChecklistItem(id)
    }
  }

  const handleAddItem = () => {
    if (!newItem.trim()) return
    
    const item: ChecklistItem = {
      id: crypto.randomUUID(),
      text: newItem.trim(),
      completed: false,
      category: activeCategory,
    }
    
    const updated = [...localChecklist, item]
    setLocalChecklist(updated)
    if (isLoggedIn) {
      updateChecklist(updated)
    }
    setNewItem('')
  }

  const handleRemoveItem = (id: string) => {
    const updated = localChecklist.filter(item => item.id !== id)
    setLocalChecklist(updated)
    if (isLoggedIn) {
      updateChecklist(updated)
    }
  }

  const handleReset = () => {
    const defaultItems: ChecklistItem[] = Object.entries(defaultChecklists).flatMap(
      ([, items]) => items.map(item => ({ ...item, id: crypto.randomUUID() }))
    )
    setLocalChecklist(defaultItems)
    if (isLoggedIn) {
      updateChecklist(defaultItems)
    }
  }

  const getCategoryItems = (category: ChecklistItem['category']) => 
    localChecklist.filter(item => item.category === category)

  const getCategoryProgress = (category: ChecklistItem['category']) => {
    const items = getCategoryItems(category)
    if (items.length === 0) return 0
    return (items.filter(i => i.completed).length / items.length) * 100
  }

  const totalProgress = localChecklist.length > 0
    ? (localChecklist.filter(i => i.completed).length / localChecklist.length) * 100
    : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">Checklist de Viaje</h1>
              <p className="text-sm text-muted-foreground">No olvides nada importante</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reiniciar
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Overall Progress */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-2xl font-bold">{Math.round(totalProgress)}% completado</p>
                <p className="text-sm text-muted-foreground">
                  {localChecklist.filter(i => i.completed).length} de {localChecklist.length} items
                </p>
              </div>
              {totalProgress === 100 && (
                <Badge className="bg-green-500">Listo para viajar</Badge>
              )}
            </div>
            <Progress value={totalProgress} className="h-3" />
          </CardContent>
        </Card>

        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as ChecklistItem['category'])}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            {Object.entries(categoryConfig).map(([key, config]) => {
              const Icon = config.icon
              const progress = getCategoryProgress(key as ChecklistItem['category'])
              return (
                <TabsTrigger key={key} value={key} className="relative">
                  <Icon className={`h-4 w-4 mr-2 ${config.color}`} />
                  <span className="hidden sm:inline">{config.label}</span>
                  {progress === 100 && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full" />
                  )}
                </TabsTrigger>
              )
            })}
          </TabsList>

          {Object.entries(categoryConfig).map(([key, config]) => {
            const Icon = config.icon
            const items = getCategoryItems(key as ChecklistItem['category'])
            const progress = getCategoryProgress(key as ChecklistItem['category'])

            return (
              <TabsContent key={key} value={key}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-5 w-5 ${config.color}`} />
                        <CardTitle>{config.label}</CardTitle>
                      </div>
                      <Badge variant="outline">
                        {items.filter(i => i.completed).length}/{items.length}
                      </Badge>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Add new item */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Agregar nuevo item..."
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                      />
                      <Button onClick={handleAddItem} size="icon">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Items list */}
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className={`flex items-center gap-3 p-3 border rounded-lg transition-colors ${
                            item.completed ? 'bg-muted/50' : ''
                          }`}
                        >
                          <Checkbox
                            checked={item.completed}
                            onCheckedChange={() => handleToggle(item.id)}
                          />
                          <span className={`flex-1 ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {item.text}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    {items.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        No hay items en esta categoria
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )
          })}
        </Tabs>

        {/* Tips */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Consejos para tu viaje</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Llega al aeropuerto con tiempo de sobra, especialmente en temporada alta</li>
              <li>• Guarda copias digitales de todos tus documentos importantes en la nube</li>
              <li>• Lleva los medicamentos esenciales en el equipaje de mano</li>
              <li>• Revisa las restricciones de equipaje de tu aerolinea antes de hacer la maleta</li>
              <li>• Activa las notificaciones de tu vuelo para recibir actualizaciones en tiempo real</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  ArrowLeft,
  Plane,
  Hotel,
  MapPin,
  Calendar,
  Clock,
  FileDown,
  Plus,
  Trash2,
  Edit2,
  Save,
  Car,
  Utensils,
  Camera,
} from 'lucide-react'

interface ItineraryItem {
  id: string
  type: 'flight' | 'hotel' | 'activity' | 'transport' | 'restaurant'
  title: string
  date: string
  time: string
  location: string
  details: string
  confirmationCode?: string
}

const iconMap = {
  flight: Plane,
  hotel: Hotel,
  activity: Camera,
  transport: Car,
  restaurant: Utensils,
}

const typeLabels = {
  flight: 'Vuelo',
  hotel: 'Alojamiento',
  activity: 'Actividad',
  transport: 'Transporte',
  restaurant: 'Restaurante',
}

const sampleItinerary: ItineraryItem[] = [
  {
    id: '1',
    type: 'flight',
    title: 'Vuelo Madrid - Barcelona',
    date: '2024-12-15',
    time: '10:30',
    location: 'Aeropuerto Madrid-Barajas (MAD)',
    details: 'Iberia IB3456 - Terminal 4',
    confirmationCode: 'ABC123',
  },
  {
    id: '2',
    type: 'hotel',
    title: 'Hotel Arts Barcelona',
    date: '2024-12-15',
    time: '14:00',
    location: 'Marina 19-21, Barcelona',
    details: 'Check-in: 14:00 - Check-out: 12:00\nHabitacion doble con vistas al mar',
    confirmationCode: 'HTL456',
  },
  {
    id: '3',
    type: 'activity',
    title: 'Visita Sagrada Familia',
    date: '2024-12-16',
    time: '10:00',
    location: 'C/ de Mallorca, 401, Barcelona',
    details: 'Entrada con audioguia incluida',
    confirmationCode: 'SGF789',
  },
  {
    id: '4',
    type: 'restaurant',
    title: 'Cena en Can Culleretes',
    date: '2024-12-16',
    time: '20:00',
    location: 'C/ Quintana, 5, Barcelona',
    details: 'Reserva para 2 personas',
  },
  {
    id: '5',
    type: 'flight',
    title: 'Vuelo Barcelona - Madrid',
    date: '2024-12-18',
    time: '18:30',
    location: 'Aeropuerto Barcelona-El Prat (BCN)',
    details: 'Iberia IB3459 - Terminal 1',
    confirmationCode: 'DEF456',
  },
]

export function ItineraryExport() {
  const [tripName, setTripName] = useState('Mi viaje a Barcelona')
  const [items, setItems] = useState<ItineraryItem[]>(sampleItinerary)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newItem, setNewItem] = useState<Partial<ItineraryItem>>({
    type: 'activity',
    title: '',
    date: '',
    time: '',
    location: '',
    details: '',
  })
  const printRef = useRef<HTMLDivElement>(null)

  const addItem = () => {
    if (!newItem.title || !newItem.date) return
    setItems(prev => [
      ...prev,
      {
        ...newItem,
        id: Date.now().toString(),
      } as ItineraryItem,
    ].sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime()))
    setNewItem({
      type: 'activity',
      title: '',
      date: '',
      time: '',
      location: '',
      details: '',
    })
    setShowAddForm(false)
  }

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const groupByDate = (items: ItineraryItem[]) => {
    return items.reduce((groups, item) => {
      const date = item.date
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(item)
      return groups
    }, {} as Record<string, ItineraryItem[]>)
  }

  const groupedItems = groupByDate(items)

  const exportToPDF = () => {
    const printContent = printRef.current
    if (!printContent) return

    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${tripName}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #1a1a1a; }
            h1 { font-size: 28px; margin-bottom: 8px; }
            .subtitle { color: #666; margin-bottom: 32px; }
            .day { margin-bottom: 32px; page-break-inside: avoid; }
            .day-header { font-size: 18px; font-weight: 600; color: #3b82f6; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb; }
            .item { display: flex; gap: 16px; margin-bottom: 16px; padding: 16px; background: #f9fafb; border-radius: 8px; }
            .item-icon { width: 40px; height: 40px; background: #3b82f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; flex-shrink: 0; }
            .item-content { flex: 1; }
            .item-title { font-weight: 600; margin-bottom: 4px; }
            .item-meta { font-size: 14px; color: #666; margin-bottom: 4px; }
            .item-details { font-size: 14px; color: #444; white-space: pre-line; }
            .item-code { display: inline-block; background: #e5e7eb; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-family: monospace; margin-top: 8px; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #666; text-align: center; }
            @media print { body { padding: 20px; } .day { page-break-inside: avoid; } }
          </style>
        </head>
        <body>
          <h1>${tripName}</h1>
          <p class="subtitle">Generado con FlyBot</p>
          ${Object.entries(groupedItems).map(([date, dayItems]) => `
            <div class="day">
              <div class="day-header">${formatDate(date)}</div>
              ${dayItems.map(item => `
                <div class="item">
                  <div class="item-icon">${item.type === 'flight' ? '✈' : item.type === 'hotel' ? '🏨' : item.type === 'restaurant' ? '🍽' : item.type === 'transport' ? '🚗' : '📸'}</div>
                  <div class="item-content">
                    <div class="item-title">${item.title}</div>
                    <div class="item-meta">🕐 ${item.time} · 📍 ${item.location}</div>
                    ${item.details ? `<div class="item-details">${item.details}</div>` : ''}
                    ${item.confirmationCode ? `<div class="item-code">Codigo: ${item.confirmationCode}</div>` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          `).join('')}
          <div class="footer">
            Itinerario generado el ${new Date().toLocaleDateString('es-ES')} con FlyBot - flybot.com
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
    }, 250)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card shadow-sm">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Itinerario</h1>
            </div>
          </div>
          <Button onClick={exportToPDF} className="gap-2">
            <FileDown className="h-4 w-4" />
            Exportar PDF
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* Trip Name */}
        <div className="mb-8">
          <Input
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            className="border-none bg-transparent p-0 text-3xl font-bold focus-visible:ring-0"
            placeholder="Nombre del viaje"
          />
          <p className="mt-1 text-muted-foreground">{items.length} elementos en tu itinerario</p>
        </div>

        {/* Add Item Button */}
        {!showAddForm && (
          <Button
            variant="outline"
            className="mb-8 w-full gap-2 border-dashed"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="h-4 w-4" />
            Anadir elemento
          </Button>
        )}

        {/* Add Form */}
        {showAddForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Nuevo elemento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={newItem.type}
                    onChange={(e) => setNewItem(prev => ({ ...prev, type: e.target.value as ItineraryItem['type'] }))}
                  >
                    {Object.entries(typeLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Titulo</Label>
                  <Input
                    value={newItem.title}
                    onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Ej: Visita al museo"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Fecha</Label>
                  <Input
                    type="date"
                    value={newItem.date}
                    onChange={(e) => setNewItem(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hora</Label>
                  <Input
                    type="time"
                    value={newItem.time}
                    onChange={(e) => setNewItem(prev => ({ ...prev, time: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Codigo confirmacion</Label>
                  <Input
                    value={newItem.confirmationCode || ''}
                    onChange={(e) => setNewItem(prev => ({ ...prev, confirmationCode: e.target.value }))}
                    placeholder="Opcional"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Ubicacion</Label>
                <Input
                  value={newItem.location}
                  onChange={(e) => setNewItem(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Direccion o lugar"
                />
              </div>
              <div className="space-y-2">
                <Label>Detalles</Label>
                <Textarea
                  value={newItem.details}
                  onChange={(e) => setNewItem(prev => ({ ...prev, details: e.target.value }))}
                  placeholder="Informacion adicional"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancelar</Button>
                <Button onClick={addItem}>
                  <Plus className="mr-2 h-4 w-4" />
                  Anadir
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Itinerary Items */}
        <div ref={printRef} className="space-y-8">
          {Object.entries(groupedItems).map(([date, dayItems]) => (
            <div key={date}>
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold capitalize">
                <Calendar className="h-5 w-5 text-primary" />
                {formatDate(date)}
              </h2>
              <div className="space-y-4">
                {dayItems.map(item => {
                  const Icon = iconMap[item.type]
                  return (
                    <Card key={item.id} className="overflow-hidden">
                      <CardContent className="flex gap-4 p-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold">{item.title}</h3>
                              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5" />
                                  {item.time}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3.5 w-3.5" />
                                  {item.location}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteItem(item.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                          {item.details && (
                            <p className="whitespace-pre-line text-sm text-muted-foreground">
                              {item.details}
                            </p>
                          )}
                          {item.confirmationCode && (
                            <Badge variant="secondary" className="mt-2 font-mono">
                              Codigo: {item.confirmationCode}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="py-12 text-center">
            <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="mb-2 font-semibold">Tu itinerario esta vacio</h3>
            <p className="text-sm text-muted-foreground">
              Anade vuelos, hoteles y actividades para crear tu plan de viaje
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

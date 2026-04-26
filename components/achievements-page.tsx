'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  ArrowLeft,
  Trophy,
  Star,
  Plane,
  MapPin,
  MessageSquare,
  Search,
  Heart,
  Calendar,
  Clock,
  Zap,
  Crown,
  Medal,
  Award,
  Target,
  Flame,
  Gift,
  Lock,
  CheckCircle2,
} from 'lucide-react'

interface Achievement {
  id: string
  name: string
  description: string
  icon: React.ElementType
  points: number
  progress: number
  maxProgress: number
  unlocked: boolean
  category: 'explorer' | 'social' | 'expert' | 'loyalty'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

interface UserStats {
  totalPoints: number
  level: number
  nextLevelPoints: number
  currentLevelPoints: number
  searches: number
  reviews: number
  favorites: number
  trips: number
  streak: number
}

const achievements: Achievement[] = [
  {
    id: 'first-search',
    name: 'Primer Vuelo',
    description: 'Realiza tu primera busqueda de vuelos',
    icon: Search,
    points: 50,
    progress: 1,
    maxProgress: 1,
    unlocked: true,
    category: 'explorer',
    rarity: 'common',
  },
  {
    id: 'explorer-10',
    name: 'Explorador Novato',
    description: 'Busca vuelos a 10 destinos diferentes',
    icon: MapPin,
    points: 100,
    progress: 7,
    maxProgress: 10,
    unlocked: false,
    category: 'explorer',
    rarity: 'common',
  },
  {
    id: 'explorer-50',
    name: 'Trotamundos',
    description: 'Busca vuelos a 50 destinos diferentes',
    icon: Plane,
    points: 500,
    progress: 7,
    maxProgress: 50,
    unlocked: false,
    category: 'explorer',
    rarity: 'epic',
  },
  {
    id: 'first-review',
    name: 'Voz del Viajero',
    description: 'Escribe tu primera resena',
    icon: MessageSquare,
    points: 75,
    progress: 1,
    maxProgress: 1,
    unlocked: true,
    category: 'social',
    rarity: 'common',
  },
  {
    id: 'reviewer-10',
    name: 'Critico Aficionado',
    description: 'Escribe 10 reseñas',
    icon: Star,
    points: 200,
    progress: 3,
    maxProgress: 10,
    unlocked: false,
    category: 'social',
    rarity: 'rare',
  },
  {
    id: 'reviewer-50',
    name: 'Critico Experto',
    description: 'Escribe 50 reseñas detalladas',
    icon: Award,
    points: 750,
    progress: 3,
    maxProgress: 50,
    unlocked: false,
    category: 'social',
    rarity: 'legendary',
  },
  {
    id: 'collector-5',
    name: 'Coleccionista',
    description: 'Guarda 5 destinos favoritos',
    icon: Heart,
    points: 100,
    progress: 5,
    maxProgress: 5,
    unlocked: true,
    category: 'explorer',
    rarity: 'common',
  },
  {
    id: 'planner',
    name: 'Planificador',
    description: 'Crea tu primer itinerario de viaje',
    icon: Calendar,
    points: 150,
    progress: 1,
    maxProgress: 1,
    unlocked: true,
    category: 'expert',
    rarity: 'rare',
  },
  {
    id: 'early-bird',
    name: 'Madrugador',
    description: 'Busca un vuelo antes de las 6:00 AM',
    icon: Clock,
    points: 100,
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    category: 'explorer',
    rarity: 'rare',
  },
  {
    id: 'streak-7',
    name: 'Racha Semanal',
    description: 'Usa FlyBot 7 dias seguidos',
    icon: Flame,
    points: 200,
    progress: 4,
    maxProgress: 7,
    unlocked: false,
    category: 'loyalty',
    rarity: 'rare',
  },
  {
    id: 'streak-30',
    name: 'Viajero Dedicado',
    description: 'Usa FlyBot 30 dias seguidos',
    icon: Zap,
    points: 500,
    progress: 4,
    maxProgress: 30,
    unlocked: false,
    category: 'loyalty',
    rarity: 'epic',
  },
  {
    id: 'compare-master',
    name: 'Maestro Comparador',
    description: 'Compara aerolineas 20 veces',
    icon: Target,
    points: 250,
    progress: 8,
    maxProgress: 20,
    unlocked: false,
    category: 'expert',
    rarity: 'rare',
  },
  {
    id: 'all-features',
    name: 'Explorador Completo',
    description: 'Usa todas las herramientas de FlyBot',
    icon: Crown,
    points: 1000,
    progress: 6,
    maxProgress: 12,
    unlocked: false,
    category: 'expert',
    rarity: 'legendary',
  },
  {
    id: 'first-booking',
    name: 'Primer Despegue',
    description: 'Completa tu primera reserva',
    icon: Plane,
    points: 300,
    progress: 1,
    maxProgress: 1,
    unlocked: true,
    category: 'explorer',
    rarity: 'rare',
  },
  {
    id: 'level-10',
    name: 'Viajero Veterano',
    description: 'Alcanza el nivel 10',
    icon: Medal,
    points: 500,
    progress: 5,
    maxProgress: 10,
    unlocked: false,
    category: 'loyalty',
    rarity: 'epic',
  },
]

const categoryColors = {
  explorer: 'bg-blue-500',
  social: 'bg-green-500',
  expert: 'bg-purple-500',
  loyalty: 'bg-orange-500',
}

const categoryLabels = {
  explorer: 'Explorador',
  social: 'Social',
  expert: 'Experto',
  loyalty: 'Lealtad',
}

const rarityColors = {
  common: 'border-gray-300 dark:border-gray-600',
  rare: 'border-blue-400',
  epic: 'border-purple-400',
  legendary: 'border-amber-400',
}

const rarityLabels = {
  common: 'Comun',
  rare: 'Raro',
  epic: 'Epico',
  legendary: 'Legendario',
}

export function AchievementsPage() {
  const [stats, setStats] = useState<UserStats>({
    totalPoints: 775,
    level: 5,
    nextLevelPoints: 1000,
    currentLevelPoints: 500,
    searches: 47,
    reviews: 3,
    favorites: 5,
    trips: 2,
    streak: 4,
  })

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredAchievements = selectedCategory
    ? achievements.filter(a => a.category === selectedCategory)
    : achievements

  const unlockedCount = achievements.filter(a => a.unlocked).length
  const totalPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0)
  const levelProgress = ((stats.totalPoints - stats.currentLevelPoints) / (stats.nextLevelPoints - stats.currentLevelPoints)) * 100

  const categories = ['explorer', 'social', 'expert', 'loyalty'] as const

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card shadow-sm">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-4 px-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Logros</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* User Stats Card */}
        <Card className="mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground">
            <div className="flex items-center justify-between">
              <div>
                <div className="mb-1 text-sm opacity-90">Nivel {stats.level}</div>
                <div className="text-3xl font-bold">{stats.totalPoints} pts</div>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                <Crown className="h-8 w-8" />
              </div>
            </div>
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-sm">
                <span>Progreso al nivel {stats.level + 1}</span>
                <span>{stats.totalPoints}/{stats.nextLevelPoints}</span>
              </div>
              <Progress value={levelProgress} className="h-2 bg-white/20" />
            </div>
          </div>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{unlockedCount}</div>
                <div className="text-xs text-muted-foreground">Logros</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.searches}</div>
                <div className="text-xs text-muted-foreground">Busquedas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.reviews}</div>
                <div className="text-xs text-muted-foreground">Reseñas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.trips}</div>
                <div className="text-xs text-muted-foreground">Viajes</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-2xl font-bold text-orange-500">
                  <Flame className="h-5 w-5" />
                  {stats.streak}
                </div>
                <div className="text-xs text-muted-foreground">Racha</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            Todos
          </Button>
          {categories.map(cat => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="gap-2"
            >
              <div className={`h-2 w-2 rounded-full ${categoryColors[cat]}`} />
              {categoryLabels[cat]}
            </Button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredAchievements.map(achievement => (
            <Card
              key={achievement.id}
              className={`relative overflow-hidden transition-all ${achievement.unlocked
                ? `border-2 ${rarityColors[achievement.rarity]}`
                : 'opacity-75'
                }`}
            >
              {achievement.unlocked && (
                <div className="absolute right-2 top-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </div>
              )}
              <CardContent className="flex gap-4 p-4">
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${achievement.unlocked
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground'
                    }`}
                >
                  {achievement.unlocked ? (
                    <achievement.icon className="h-7 w-7" />
                  ) : (
                    <Lock className="h-6 w-6" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="font-semibold">{achievement.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {rarityLabels[achievement.rarity]}
                    </Badge>
                  </div>
                  <p className="mb-2 text-sm text-muted-foreground">
                    {achievement.description}
                  </p>
                  {!achievement.unlocked && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>{achievement.progress}/{achievement.maxProgress}</span>
                        <span className="text-primary">+{achievement.points} pts</span>
                      </div>
                      <Progress
                        value={(achievement.progress / achievement.maxProgress) * 100}
                        className="h-1.5"
                      />
                    </div>
                  )}
                  {achievement.unlocked && (
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <Gift className="h-4 w-4" />
                      +{achievement.points} pts ganados
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

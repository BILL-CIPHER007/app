'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/loading-spinner'
import { Badge } from '@/components/ui/badge'
import { ACHIEVEMENTS } from '@/lib/gamification'
import { Trophy } from 'lucide-react'

export default function AchievementsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // se precisar buscar dados extras do servidor
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" text="Carregando conquistas..." />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-20 text-gray-500">
        Erro ao carregar conquistas
      </div>
    )
  }

  // Lista completa de conquistas disponíveis no sistema
  const allAchievements = ACHIEVEMENTS
  // IDs já conquistados pelo usuário
  const unlocked = user.medals || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Minhas Conquistas</h1>
        <p className="text-gray-600 mt-1">
          Veja todas as medalhas disponíveis e quais você já desbloqueou
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allAchievements.map((ach) => {
          const isUnlocked = unlocked.includes(ach.id)
          return (
            <Card
              key={ach.id}
              className={`relative transition-all ${
                isUnlocked ? 'hover:shadow-md' : 'opacity-60'
              }`}
            >
              <CardHeader className="flex items-center gap-3">
                <div className="text-3xl">
                  {ach.icon}
                </div>
                <div>
                  <CardTitle className="text-lg">{ach.name}</CardTitle>
                  <CardDescription>{ach.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Badge
                    className={isUnlocked ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-700'}
                  >
                    {isUnlocked ? 'Conquistado' : 'Bloqueado'}
                  </Badge>
                  {ach.points && (
                    <span className="text-sm font-medium text-gray-700">
                      +{ach.points} pts
                    </span>
                  )}
                </div>
              </CardContent>
              {!isUnlocked && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}

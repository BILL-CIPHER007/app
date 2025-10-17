
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/loading-spinner';
import { Trophy, Medal, Award, Star, Crown } from 'lucide-react';

interface RankingUser {
  id: string;
  name: string;
  points: number;
  level: number;
}

export default function RankingPage() {
  const { user } = useAuth();
  const [ranking, setRanking] = useState<RankingUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRanking();
  }, []);

  const fetchRanking = async () => {
    try {
      const response = await fetch('/api/stats');
      if (response.ok) {
        const data = await response.json();
        setRanking(data.ranking || []);
      }
    } catch (error) {
      console.error('Erro ao buscar ranking:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-orange-500" />;
      default:
        return <Trophy className="h-6 w-6 text-gray-400" />;
    }
  };

  const getRankColor = (position: number) => {
    switch (position) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
      default:
        return 'bg-white border border-gray-200';
    }
  };

  const userPosition = ranking.findIndex(u => u.id === user?.id) + 1;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" text="Carregando ranking..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Ranking Global</h1>
        <p className="text-gray-600 mt-2">
          Veja como você está se saindo comparado aos outros alunos
        </p>
      </div>

      {/* User Position */}
      {user && userPosition > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  #{userPosition}
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">Sua Posição</h3>
                  <p className="text-blue-700">
                    {user.points} pontos • Nível {user.level}
                  </p>
                </div>
              </div>
              <Badge className="bg-blue-500">
                <Star className="h-3 w-3 mr-1" />
                Você
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top 3 Podium */}
      {ranking.length >= 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Pódio</CardTitle>
            <CardDescription>Os 3 melhores alunos da plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {/* 2º Lugar */}
              <div className="text-center order-1">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-gray-300 to-gray-500 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-xl">
                    2º
                  </div>
                  <Medal className="absolute -top-2 -right-2 h-8 w-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-lg">{ranking[1].name}</h3>
                <p className="text-gray-600">{ranking[1].points} pontos</p>
                <Badge variant="outline">Nível {ranking[1].level}</Badge>
              </div>

              {/* 1º Lugar */}
              <div className="text-center order-2">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-2xl">
                    1º
                  </div>
                  <Crown className="absolute -top-3 -right-3 h-10 w-10 text-yellow-500" />
                </div>
                <h3 className="font-semibold text-xl">{ranking[0].name}</h3>
                <p className="text-gray-600 font-medium">{ranking[0].points} pontos</p>
                <Badge className="bg-yellow-500">Nível {ranking[0].level}</Badge>
              </div>

              {/* 3º Lugar */}
              <div className="text-center order-3">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-xl">
                    3º
                  </div>
                  <Award className="absolute -top-2 -right-2 h-8 w-8 text-orange-500" />
                </div>
                <h3 className="font-semibold text-lg">{ranking[2].name}</h3>
                <p className="text-gray-600">{ranking[2].points} pontos</p>
                <Badge variant="outline">Nível {ranking[2].level}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full Ranking */}
      <Card>
        <CardHeader>
          <CardTitle>Ranking Completo</CardTitle>
          <CardDescription>
            Todos os alunos ordenados por pontuação
          </CardDescription>
        </CardHeader>
        <CardContent>
          {ranking.length > 0 ? (
            <div className="space-y-3">
              {ranking.map((student, index) => {
                const position = index + 1;
                const isCurrentUser = student.id === user?.id;
                
                return (
                  <div
                    key={student.id}
                    className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                      isCurrentUser
                        ? 'bg-blue-50 border border-blue-200'
                        : position <= 3
                        ? getRankColor(position)
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        position <= 3 && !isCurrentUser
                          ? 'bg-white/20 text-white'
                          : isCurrentUser
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-600 border border-gray-200'
                      }`}>
                        #{position}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {getRankIcon(position)}
                        <div>
                          <h3 className={`font-semibold ${
                            position <= 3 && !isCurrentUser ? 'text-white' : 'text-gray-900'
                          }`}>
                            {isCurrentUser ? 'Você' : student.name}
                          </h3>
                          <p className={`text-sm ${
                            position <= 3 && !isCurrentUser ? 'text-white/80' : 'text-gray-600'
                          }`}>
                            Nível {student.level}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        position <= 3 && !isCurrentUser ? 'text-white' : 'text-gray-900'
                      }`}>
                        {student.points}
                      </div>
                      <div className={`text-sm ${
                        position <= 3 && !isCurrentUser ? 'text-white/80' : 'text-gray-600'
                      }`}>
                        pontos
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Nenhum aluno no ranking ainda
            </p>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold">{ranking.length}</div>
            <div className="text-sm text-gray-600">Alunos no ranking</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Star className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">
              {ranking.length > 0 ? Math.max(...ranking.map(u => u.level)) : 0}
            </div>
            <div className="text-sm text-gray-600">Nível mais alto</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Award className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">
              {ranking.length > 0 ? Math.max(...ranking.map(u => u.points)) : 0}
            </div>
            <div className="text-sm text-gray-600">Maior pontuação</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

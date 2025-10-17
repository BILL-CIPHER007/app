
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/stats-card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LoadingSpinner } from '@/components/loading-spinner';
import { ACHIEVEMENTS } from '@/lib/gamification';
import { 
  Trophy, 
  Target, 
  Clock, 
  TrendingUp,
  Award,
  Star,
  BookOpen,
  Zap
} from 'lucide-react';

interface AlunoStats {
  totalAttempts: number;
  userInfo: {
    points: number;
    level: number;
    medals: string[];
  };
  averageScore: number;
  recentAttempts: Array<{
    id: string;
    pontuacao: number;
    dataConclusao: string;
    quiz: {
      titulo: string;
      questions: Array<{ id: string }>;
    };
  }>;
  ranking: Array<{
    id: string;
    name: string;
    points: number;
    level: number;
  }>;
}

export default function AlunoDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AlunoStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" text="Carregando dashboard..." />
      </div>
    );
  }

  if (!stats || !user) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Erro ao carregar estatísticas</p>
      </div>
    );
  }

  const progressToNextLevel = ((user.points % 100) / 100) * 100;
  const pointsToNextLevel = 100 - (user.points % 100);
  const userRankPosition = stats.ranking.findIndex(u => u.id === user.id) + 1;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Olá, {user.name}! 👋</h1>
            <p className="text-blue-100">
              Continue estudando e alcance novos níveis de conhecimento
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{user.level}</div>
                <div className="text-sm text-blue-100">Nível</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{user.points}</div>
                <div className="text-sm text-blue-100">Pontos</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Quizzes Realizados"
          value={stats.totalAttempts}
          description="Total de tentativas"
          icon={BookOpen}
        />
        <StatsCard
          title="Pontuação Média"
          value={Math.round(stats.averageScore || 0)}
          description="Pontos por quiz"
          icon={Target}
        />
        <StatsCard
          title="Posição no Ranking"
          value={userRankPosition > 0 ? `#${userRankPosition}` : '-'}
          description="Entre todos os alunos"
          icon={Trophy}
        />
        <StatsCard
          title="Medalhas Conquistadas"
          value={user.medals?.length || 0}
          description="Conquistas desbloqueadas"
          icon={Award}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Level Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-500" />
                Progresso do Nível
              </CardTitle>
              <CardDescription>
                Você está no nível {user.level}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Nível {user.level}</span>
                  <span>Nível {user.level + 1}</span>
                </div>
                <Progress value={progressToNextLevel} className="h-3" />
                <p className="text-sm text-gray-600 text-center">
                  Faltam {pointsToNextLevel} pontos para o próximo nível
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Attempts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Atividades Recentes
              </CardTitle>
              <CardDescription>
                Seus últimos quizzes realizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats.recentAttempts.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentAttempts.slice(0, 5).map((attempt) => {
                    const totalQuestions = attempt.quiz.questions.length;
                    const percentage = totalQuestions > 0 ? (attempt.pontuacao / (totalQuestions * 10)) * 100 : 0;
                    
                    return (
                      <div key={attempt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{attempt.quiz.titulo}</p>
                          <p className="text-xs text-gray-600">
                            {new Date(attempt.dataConclusao).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">{attempt.pontuacao} pts</p>
                          <p className="text-xs text-gray-500">
                            {Math.round(percentage)}% de acerto
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Nenhum quiz realizado ainda
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-purple-500" />
                Conquistas
              </CardTitle>
              <CardDescription>
                Medalhas que você conquistou
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user.medals && user.medals.length > 0 ? (
                <div className="space-y-3">
                  {user.medals.map((medalId: string) => {
                    const achievement = ACHIEVEMENTS.find(a => a.id === medalId);
                    if (!achievement) return null;
                    
                    return (
                      <div key={medalId} className="flex items-center space-x-3 p-2 bg-yellow-50 rounded-lg">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div>
                          <p className="font-medium text-sm">{achievement.name}</p>
                          <p className="text-xs text-gray-600">{achievement.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Nenhuma conquista ainda
                </p>
              )}
            </CardContent>
          </Card>

          {/* Top Ranking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                Top Ranking
              </CardTitle>
              <CardDescription>
                Os melhores alunos da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.ranking.slice(0, 5).map((student, index) => (
                  <div
                    key={student.id}
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      student.id === user.id ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-orange-500 text-white' :
                        'bg-gray-200 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {student.id === user.id ? 'Você' : student.name}
                        </p>
                        <p className="text-xs text-gray-600">Nível {student.level}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">{student.points}</p>
                      <p className="text-xs text-gray-500">pontos</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Continue sua jornada de aprendizado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/aluno/quizzes"
              className="p-4 border border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-center"
            >
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <h3 className="font-medium">Fazer Quiz</h3>
              <p className="text-sm text-gray-600">Pratique com novos quizzes</p>
            </a>
            
            <a
              href="/aluno/ranking"
              className="p-4 border border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-center"
            >
              <Trophy className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <h3 className="font-medium">Ver Ranking</h3>
              <p className="text-sm text-gray-600">Compare seu desempenho</p>
            </a>
            
            <a
              href="/aluno/achievements"
              className="p-4 border border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-center"
            >
              <Award className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <h3 className="font-medium">Conquistas</h3>
              <p className="text-sm text-gray-600">Veja todas as medalhas</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

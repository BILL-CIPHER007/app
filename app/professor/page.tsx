
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/stats-card';
import { LoadingSpinner } from '@/components/loading-spinner';
import { 
  BookOpen, 
  FileQuestion, 
  Users, 
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';

interface ProfessorStats {
  totalQuestions: number;
  totalQuizzes: number;
  totalAttempts: number;
  recentAttempts: Array<{
    id: string;
    pontuacao: number;
    dataConclusao: string;
    aluno: { name: string };
    quiz: { titulo: string };
  }>;
  questionsByDisciplina: Array<{
    disciplina: string;
    _count: { disciplina: number };
  }>;
}

export default function ProfessorDashboard() {
  const [stats, setStats] = useState<ProfessorStats | null>(null);
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

  if (!stats) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Erro ao carregar estatísticas</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard do Professor</h1>
        <p className="text-gray-600 mt-2">
          Acompanhe suas questões, quizzes e o desempenho dos alunos
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total de Questões"
          value={stats.totalQuestions}
          description="Questões criadas"
          icon={FileQuestion}
        />
        <StatsCard
          title="Total de Quizzes"
          value={stats.totalQuizzes}
          description="Quizzes criados"
          icon={BookOpen}
        />
        <StatsCard
          title="Tentativas de Alunos"
          value={stats.totalAttempts}
          description="Quizzes realizados"
          icon={Users}
        />
        <StatsCard
          title="Taxa de Engajamento"
          value={`${stats.totalQuizzes > 0 ? Math.round((stats.totalAttempts / stats.totalQuizzes) * 100) / 100 : 0}`}
          description="Tentativas por quiz"
          icon={TrendingUp}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Attempts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Tentativas Recentes
            </CardTitle>
            <CardDescription>
              Últimas tentativas dos alunos em seus quizzes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentAttempts.length > 0 ? (
              <div className="space-y-4">
                {stats.recentAttempts.slice(0, 5).map((attempt) => (
                  <div key={attempt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{attempt.aluno.name}</p>
                      <p className="text-xs text-gray-600">{attempt.quiz.titulo}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">{attempt.pontuacao} pts</p>
                      <p className="text-xs text-gray-500">
                        {new Date(attempt.dataConclusao).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Nenhuma tentativa ainda
              </p>
            )}
          </CardContent>
        </Card>

        {/* Questions by Subject */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Questões por Disciplina
            </CardTitle>
            <CardDescription>
              Distribuição das suas questões por matéria
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.questionsByDisciplina.length > 0 ? (
              <div className="space-y-3">
                {stats.questionsByDisciplina.map((item) => {
                  const disciplinaNames: Record<string, string> = {
                    LINGUA_PORTUGUESA: 'Língua Portuguesa',
                    MATEMATICA: 'Matemática',
                    CIENCIAS: 'Ciências',
                    HISTORIA: 'História',
                    GEOGRAFIA: 'Geografia',
                    INGLES: 'Inglês',
                  };

                  const colors: Record<string, string> = {
                    LINGUA_PORTUGUESA: 'bg-blue-500',
                    MATEMATICA: 'bg-green-500',
                    CIENCIAS: 'bg-purple-500',
                    HISTORIA: 'bg-orange-500',
                    GEOGRAFIA: 'bg-teal-500',
                    INGLES: 'bg-pink-500',
                  };

                  return (
                    <div key={item.disciplina} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${colors[item.disciplina]}`} />
                        <span className="text-sm font-medium">
                          {disciplinaNames[item.disciplina]}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">
                        {item._count.disciplina} questões
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Nenhuma questão criada ainda
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Acesse rapidamente as principais funcionalidades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/professor/questions/new"
              className="p-4 border border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-center"
            >
              <FileQuestion className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <h3 className="font-medium">Criar Questão</h3>
              <p className="text-sm text-gray-600">Adicione uma nova questão</p>
            </a>
            
            <a
              href="/professor/quizzes/new"
              className="p-4 border border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-center"
            >
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <h3 className="font-medium">Criar Quiz</h3>
              <p className="text-sm text-gray-600">Monte um novo quiz</p>
            </a>
            
            <a
              href="/professor/questions"
              className="p-4 border border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-center"
            >
              <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <h3 className="font-medium">Ver Questões</h3>
              <p className="text-sm text-gray-600">Gerencie suas questões</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

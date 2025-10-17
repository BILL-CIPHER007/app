
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/loading-spinner';
import { DISCIPLINAS } from '@/lib/constants';
import { 
  Play, 
  Clock, 
  FileQuestion, 
  Trophy,
  CheckCircle,
  BookOpen
} from 'lucide-react';
import Link from 'next/link';

interface Quiz {
  id: string;
  titulo: string;
  descricao: string;
  tempoLimite: number;
  ativo: boolean;
  createdAt: string;
  professor: { name: string };
  questions: Array<{
    question: {
      disciplina: keyof typeof DISCIPLINAS;
    };
  }>;
  attempts: Array<{
    id: string;
    pontuacao: number;
    dataConclusao: string;
  }>;
  _count: {
    attempts: number;
  };
}

interface QuizzesResponse {
  quizzes: Quiz[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await fetch('/api/quizzes?ativo=true');
      if (response.ok) {
        const data: QuizzesResponse = await response.json();
        setQuizzes(data.quizzes);
      }
    } catch (error) {
      console.error('Erro ao buscar quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDisciplinas = (quiz: Quiz) => {
    const disciplinas = quiz.questions.map(q => q.question.disciplina);
    const uniqueDisciplinas = [...new Set(disciplinas)];
    return uniqueDisciplinas.slice(0, 3); // Mostrar no máximo 3
  };

  const hasUserAttempted = (quiz: Quiz) => {
    return (quiz.attempts?.length ?? 0) > 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" text="Carregando quizzes..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Quizzes Disponíveis</h1>
        <p className="text-gray-600 mt-2">
          Pratique com os quizzes criados pelos professores e ganhe pontos
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Quizzes</p>
                <p className="text-2xl font-bold">{quizzes.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Quizzes Realizados</p>
                <p className="text-2xl font-bold">
                  {quizzes.filter(quiz => hasUserAttempted(quiz)).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Disponíveis</p>
                <p className="text-2xl font-bold">
                  {quizzes.filter(quiz => !hasUserAttempted(quiz)).length}
                </p>
              </div>
              <Play className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quizzes List */}
      {quizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => {
            const userAttempted = hasUserAttempted(quiz);
            const disciplinas = getDisciplinas(quiz);
            const userAttempt = quiz.attempts[0]; // Primeira (e única) tentativa do usuário

            return (
              <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <CardTitle className="text-lg line-clamp-2">{quiz.titulo}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {quiz.descricao}
                      </CardDescription>
                    </div>
                    {userAttempted && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Feito
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Disciplinas */}
                  <div className="flex flex-wrap gap-1">
                    {disciplinas.map((disciplina) => (
                      <Badge key={disciplina} variant="outline" className="text-xs">
                        {DISCIPLINAS[disciplina]}
                      </Badge>
                    ))}
                    {quiz.questions.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{quiz.questions.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <FileQuestion className="h-4 w-4 mr-1" />
                        {quiz.questions.length} questões
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {quiz.tempoLimite} min
                      </span>
                    </div>
                  </div>

                  {/* Professor */}
                  <p className="text-sm text-gray-600">
                    Por: <span className="font-medium">{quiz.professor.name}</span>
                  </p>

                  {/* User Result */}
                  {userAttempted && userAttempt && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-green-800">
                          Sua pontuação:
                        </span>
                        <span className="text-sm font-bold text-green-800">
                          {userAttempt.pontuacao} pontos
                        </span>
                      </div>
                      <p className="text-xs text-green-600 mt-1">
                        Realizado em {new Date(userAttempt.dataConclusao).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="pt-2">
                    {userAttempted ? (
                      <Button variant="outline" className="w-full" disabled>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Quiz Concluído
                      </Button>
                    ) : (
                      <Link href={`/aluno/quizzes/${quiz.id}`}>
                        <Button className="w-full">
                          <Play className="h-4 w-4 mr-2" />
                          Iniciar Quiz
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-20">
            <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum quiz disponível
            </h3>
            <p className="text-gray-600">
              Os professores ainda não criaram quizzes. Volte mais tarde!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

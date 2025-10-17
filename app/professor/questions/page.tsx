
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/loading-spinner';
import { DISCIPLINAS, DIFICULDADES, DISCIPLINA_COLORS, DIFICULDADE_COLORS } from '@/lib/constants';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2,
  BookOpen,
  Clock
} from 'lucide-react';
import Link from 'next/link';

interface Question {
  id: string;
  disciplina: keyof typeof DISCIPLINAS;
  assunto: string;
  enunciado: string;
  alternativas: string[];
  respostaCorreta: number;
  dificuldade: keyof typeof DIFICULDADES;
  createdAt: string;
  professor: { name: string };
}

interface QuestionsResponse {
  questions: Question[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDisciplina, setSelectedDisciplina] = useState('all');
  const [selectedDificuldade, setSelectedDificuldade] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    fetchQuestions();
  }, [currentPage, selectedDisciplina, selectedDificuldade, searchTerm]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
      });

      if (selectedDisciplina !== 'all') params.append('disciplina', selectedDisciplina);
      if (selectedDificuldade !== 'all') params.append('dificuldade', selectedDificuldade);
      if (searchTerm) params.append('assunto', searchTerm);

      const response = await fetch(`/api/questions?${params}`);
      if (response.ok) {
        const data: QuestionsResponse = await response.json();
        setQuestions(data.questions);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Erro ao buscar questões:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta questão?')) return;

    try {
      const response = await fetch(`/api/questions/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchQuestions();
      } else {
        alert('Erro ao excluir questão');
      }
    } catch (error) {
      console.error('Erro ao excluir questão:', error);
      alert('Erro ao excluir questão');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Minhas Questões</h1>
          <p className="text-gray-600 mt-1">
            Gerencie suas questões e crie novas para os quizzes
          </p>
        </div>
        <Link href="/professor/questions/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Questão
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar por assunto</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Digite o assunto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Disciplina</label>
              <Select value={selectedDisciplina} onValueChange={setSelectedDisciplina}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as disciplinas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as disciplinas</SelectItem>
                  {Object.entries(DISCIPLINAS).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Dificuldade</label>
              <Select value={selectedDificuldade} onValueChange={setSelectedDificuldade}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as dificuldades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as dificuldades</SelectItem>
                  {Object.entries(DIFICULDADES).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" text="Carregando questões..." />
        </div>
      ) : questions.length > 0 ? (
        <div className="space-y-4">
          {questions.map((question) => (
            <Card key={question.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge className={DISCIPLINA_COLORS[question.disciplina]}>
                        {DISCIPLINAS[question.disciplina]}
                      </Badge>
                      <Badge variant="outline" className={DIFICULDADE_COLORS[question.dificuldade]}>
                        {DIFICULDADES[question.dificuldade]}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{question.assunto}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {question.enunciado}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link href={`/professor/questions/${question.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(question.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {question.alternativas.length} alternativas
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {new Date(question.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <span className="flex items-center px-4 text-sm text-gray-600">
                Página {currentPage} de {pagination.pages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
                disabled={currentPage === pagination.pages}
              >
                Próxima
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-20">
            <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma questão encontrada
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedDisciplina !== 'all' || selectedDificuldade !== 'all'
                ? 'Tente ajustar os filtros ou criar uma nova questão.'
                : 'Comece criando sua primeira questão.'}
            </p>
            <Link href="/professor/questions/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Questão
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

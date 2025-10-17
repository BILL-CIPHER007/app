'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/loading-spinner'
import { Plus, Search, Filter, BookOpen, Clock, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { DISCIPLINAS, DIFICULDADES, DISCIPLINA_COLORS, DIFICULDADE_COLORS } from '@/lib/constants'

interface Quiz {
  id: string
  titulo: string
  descricao: string
  disciplina: keyof typeof DISCIPLINAS
  assunto: string
  dificuldade: keyof typeof DIFICULDADES
  tempoLimite: number
  createdAt: string
  _count: { attempts: number }
}

interface QuizzesResponse {
  quizzes: Quiz[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDisciplina, setSelectedDisciplina] = useState('all')
  const [selectedDificuldade, setSelectedDificuldade] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 })

  useEffect(() => {
    fetchQuizzes()
  }, [currentPage, selectedDisciplina, selectedDificuldade, searchTerm])

  const fetchQuizzes = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
      })
      if (selectedDisciplina !== 'all') params.append('disciplina', selectedDisciplina)
      if (selectedDificuldade !== 'all') params.append('dificuldade', selectedDificuldade)
      if (searchTerm) params.append('titulo', searchTerm)

      const res = await fetch(`/api/quizzes?${params}`)
      if (res.ok) {
        const data: QuizzesResponse = await res.json()
        setQuizzes(data.quizzes)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Erro ao buscar quizzes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este quiz?')) return
    try {
      const res = await fetch(`/api/quizzes/${id}`, { method: 'DELETE' })
      if (res.ok) fetchQuizzes()
      else alert('Erro ao excluir quiz')
    } catch (err) {
      console.error(err)
      alert('Erro ao excluir quiz')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meus Quizzes</h1>
          <p className="text-gray-600 mt-1">
            Gerencie seus quizzes criados e acompanhe tentativas
          </p>
        </div>
        <Link href="/professor/quizzes/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Quiz
          </Button>
        </Link>
      </div>

      {/* Filtros */}
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
              <label className="text-sm font-medium">Buscar por título</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Digite o título..."
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
                  <SelectItem value="all">Todas</SelectItem>
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
                  <SelectItem value="all">Todas</SelectItem>
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

      {/* Lista de quizzes */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" text="Carregando quizzes..." />
        </div>
      ) : quizzes.length > 0 ? (
        <div className="space-y-4">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge className={DISCIPLINA_COLORS[quiz.disciplina]}>
                        {DISCIPLINAS[quiz.disciplina]}
                      </Badge>
                      <Badge variant="outline" className={DIFICULDADE_COLORS[quiz.dificuldade]}>
                        {DIFICULDADES[quiz.dificuldade]}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{quiz.titulo}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {quiz.descricao}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link href={`/professor/quizzes/${quiz.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(quiz.id)}
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
                      {quiz._count.attempts} tentativas
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {new Date(quiz.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <span className="text-gray-600">
                    Tempo limite: {quiz.tempoLimite} min
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Paginação */}
          {pagination.pages > 1 && (
            <div className="flex justify-center space-x-2 pt-4">
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
              Nenhum quiz encontrado
            </h3>
            <p className="text-gray-600 mb-6">
              Crie seu primeiro quiz para começar.
            </p>
            <Link href="/professor/quizzes/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Criar Quiz
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

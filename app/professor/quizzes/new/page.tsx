'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { LoadingSpinner } from '@/components/loading-spinner'
import { Filter, Search, BookOpen, Clock, CheckSquare } from 'lucide-react'
import { DISCIPLINAS, DIFICULDADES, DISCIPLINA_COLORS, DIFICULDADE_COLORS } from '@/lib/constants'

interface Question {
  id: string
  disciplina: keyof typeof DISCIPLINAS
  assunto: string
  enunciado: string
  alternativas: string[]
  dificuldade: keyof typeof DIFICULDADES
  createdAt: string
}

interface QuestionsResponse {
  questions: Question[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function CreateQuizPage() {
  const router = useRouter()
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm()
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDisciplina, setSelectedDisciplina] = useState('all')
  const [selectedDificuldade, setSelectedDificuldade] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 })
  const selectedIds = watch('questionIds', []) as string[]

  useEffect(() => {
    fetchQuestions()
  }, [currentPage, selectedDisciplina, selectedDificuldade, searchTerm])

  const fetchQuestions = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      })
      if (selectedDisciplina !== 'all') params.append('disciplina', selectedDisciplina)
      if (selectedDificuldade !== 'all') params.append('dificuldade', selectedDificuldade)
      if (searchTerm) params.append('assunto', searchTerm)

      const res = await fetch(`/api/questions?${params}`)
      if (res.ok) {
        const data: QuestionsResponse = await res.json()
        setQuestions(data.questions)
        setPagination(data.pagination)
      }
    } finally {
      setLoading(false)
    }
  }

  const toggleQuestion = (id: string) => {
    const set = new Set(selectedIds)
    set.has(id) ? set.delete(id) : set.add(id)
    setValue('questionIds', Array.from(set))
  }

  const onSubmit = async (data: any) => {
    const res = await fetch('/api/quizzes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, tempoLimite: Number(data.tempoLimite) })
    })
    if (res.ok) router.push('/professor/quizzes')
    else {
      const err = await res.json()
      alert(err.error || 'Erro ao criar quiz')
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Criar Novo Quiz</h1>

      {/* Informações básicas */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Quiz</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Título"
            {...register('titulo', { required: 'Título é obrigatório' })}
          />
          {errors.titulo && <p className="text-red-500 text-sm">{String(errors.titulo.message)}</p>}

          <Textarea
            placeholder="Descrição"
            {...register('descricao', { required: 'Descrição é obrigatória' })}
          />
          {errors.descricao && <p className="text-red-500 text-sm">{String(errors.descricao.message)}</p>}

          <Input
            type="number"
            placeholder="Tempo limite (minutos)"
            {...register('tempoLimite', { required: 'Informe o tempo limite' })}
          />
          {errors.tempoLimite && (
            <p className="text-red-500 text-sm">{String(errors.tempoLimite.message)}</p>
          )}
        </CardContent>
      </Card>

      {/* Filtros de questões */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filtrar Questões
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

      {/* Lista de questões em cards */}
      <Card>
        <CardHeader>
          <CardTitle>Selecione as Questões</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" text="Carregando questões..." />
            </div>
          ) : questions.length > 0 ? (
            <>
              {questions.map((q) => {
                const selected = selectedIds.includes(q.id)
                return (
                  <Card
                    key={q.id}
                    onClick={() => toggleQuestion(q.id)}
                    className={`cursor-pointer border transition ${
                      selected ? 'border-purple-500 bg-purple-50' : 'hover:shadow-md'
                    }`}
                  >
                    <CardHeader>
                      <div className="flex justify-between">
                        <div className="flex gap-2">
                          <Badge className={DISCIPLINA_COLORS[q.disciplina]}>
                            {DISCIPLINAS[q.disciplina]}
                          </Badge>
                          <Badge variant="outline" className={DIFICULDADE_COLORS[q.dificuldade]}>
                            {DIFICULDADES[q.dificuldade]}
                          </Badge>
                        </div>
                        {selected && <CheckSquare className="text-purple-600 h-5 w-5" />}
                      </div>
                      <CardTitle className="text-lg">{q.assunto}</CardTitle>
                      <CardDescription>{q.enunciado}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        {q.alternativas.length} alternativas
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(q.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </CardContent>
                  </Card>
                )
              })}
              {/* Paginação simples */}
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
            </>
          ) : (
            <p className="text-center text-gray-500">Nenhuma questão encontrada.</p>
          )}
        </CardContent>
      </Card>

      <Button
        onClick={handleSubmit(onSubmit)}
        className="w-full h-12 text-lg"
      >
        Criar Quiz
      </Button>
    </div>
  )
}

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { LoadingSpinner } from '@/components/loading-spinner';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { DISCIPLINAS, DIFICULDADES, DISCIPLINA_COLORS, DIFICULDADE_COLORS } from '@/lib/constants';

interface Question {
  id: string;
  assunto: string;
  disciplina: keyof typeof DISCIPLINAS;
  dificuldade: keyof typeof DIFICULDADES;
}

export default function EditQuizPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tempoLimite, setTempoLimite] = useState<number>(10);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    fetchInitialData();
  }, [id]);

  async function fetchInitialData() {
    setLoading(true);
    try {
      const [quizRes, questionsRes] = await Promise.all([
        fetch(`/api/quizzes/${id}`),
        fetch(`/api/questions?limit=100`),
      ]);

      if (quizRes.ok) {
        const quiz = await quizRes.json();
        setTitulo(quiz.titulo);
        setDescricao(quiz.descricao);
        setTempoLimite(quiz.tempoLimite);
        setSelectedQuestions(quiz.questions.map((q: any) => q.questionId));
      }
      if (questionsRes.ok) {
        const qData = await questionsRes.json();
        setQuestions(qData.questions);
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  }

  const toggleQuestion = (qid: string) => {
    setSelectedQuestions((prev) =>
      prev.includes(qid) ? prev.filter((q) => q !== qid) : [...prev, qid]
    );
  };

  async function handleSave() {
    if (!titulo || !descricao || selectedQuestions.length === 0) {
      alert('Preencha todos os campos e selecione ao menos uma questão');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/quizzes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo,
          descricao,
          tempoLimite,
          questionIds: selectedQuestions,
        }),
      });
      if (res.ok) {
        alert('Quiz atualizado com sucesso!');
        router.push('/professor/quizzes');
      } else {
        const err = await res.json();
        alert(err.error || 'Erro ao salvar');
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" text="Carregando quiz..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold">Editar Quiz</h1>

      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Quiz</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
          <Textarea
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
          <Input
            type="number"
            min={1}
            placeholder="Tempo limite (minutos)"
            value={tempoLimite}
            onChange={(e) => setTempoLimite(Number(e.target.value))}
          />
        </CardContent>
      </Card>

      {/* Seleção de Questões */}
      <Card>
        <CardHeader>
          <CardTitle>Selecione as Questões</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
          {questions.map((q) => (
            <label
              key={q.id}
              className="flex items-start space-x-3 p-3 border rounded-lg hover:shadow-sm transition cursor-pointer"
            >
              <Checkbox
                checked={selectedQuestions.includes(q.id)}
                onCheckedChange={() => toggleQuestion(q.id)}
              />
              <div className="space-y-1">
                <div className="flex space-x-2">
                  <Badge className={DISCIPLINA_COLORS[q.disciplina]}>
                    {DISCIPLINAS[q.disciplina]}
                  </Badge>
                  <Badge variant="outline" className={DIFICULDADE_COLORS[q.dificuldade]}>
                    {DIFICULDADES[q.dificuldade]}
                  </Badge>
                </div>
                <p className="text-sm font-medium">{q.assunto}</p>
              </div>
            </label>
          ))}
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving} className="w-full">
        {saving ? 'Salvando...' : 'Salvar Alterações'}
      </Button>
    </div>
  );
}

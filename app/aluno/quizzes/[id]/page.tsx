
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LoadingSpinner } from '@/components/loading-spinner';
import { DISCIPLINAS } from '@/lib/constants';
import { 
  ArrowLeft, 
  Clock, 
  FileQuestion, 
  CheckCircle,
  Trophy,
  Star,
  Award
} from 'lucide-react';
import Link from 'next/link';

interface QuizQuestion {
  question: {
    id: string;
    disciplina: keyof typeof DISCIPLINAS;
    assunto: string;
    enunciado: string;
    alternativas: string[];
    dificuldade: string;
  };
}

interface Quiz {
  id: string;
  titulo: string;
  descricao: string;
  tempoLimite: number;
  professor: { name: string };
  questions: QuizQuestion[];
  attempts: Array<{
    id: string;
    pontuacao: number;
    dataConclusao: string;
  }>;
}

export default function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [quizId, setQuizId] = useState<string>('');

  useEffect(() => {
    const initializeParams = async () => {
      const resolvedParams = await params;
      setQuizId(resolvedParams.id);
    };
    initializeParams();
  }, [params]);

  useEffect(() => {
    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  useEffect(() => {
    if (quizStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (quizStarted && timeLeft === 0) {
      handleSubmit();
    }
  }, [timeLeft, quizStarted]);

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`/api/quizzes/${quizId}`);
      if (response.ok) {
        const data = await response.json();
        setQuiz(data);
        
        // Verificar se o usuário já fez este quiz
        if (data.attempts.length > 0) {
          setQuizFinished(true);
        }
      } else {
        router.push('/aluno/quizzes');
      }
    } catch (error) {
      console.error('Erro ao buscar quiz:', error);
      router.push('/aluno/quizzes');
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = () => {
    if (!quiz) return;
    
    setQuizStarted(true);
    setTimeLeft(quiz.tempoLimite * 60); // Converter minutos para segundos
    setAnswers(new Array(quiz.questions.length).fill(-1));
  };

  const selectAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (!quiz || submitting) return;
    
    setSubmitting(true);
    
    try {
      const tempoGasto = (quiz.tempoLimite * 60) - timeLeft;
      
      const response = await fetch(`/api/quizzes/${quiz.id}/attempt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          respostas: answers,
          tempoGasto,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data.resultado);
        setQuizFinished(true);
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao submeter quiz');
      }
    } catch (error) {
      console.error('Erro ao submeter quiz:', error);
      alert('Erro ao submeter quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" text="Carregando quiz..." />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Quiz não encontrado</p>
      </div>
    );
  }

  // Se o usuário já fez o quiz, mostrar resultado
  if (quizFinished && quiz.attempts.length > 0 && !result) {
    const attempt = quiz.attempts[0];
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href="/aluno/quizzes">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{quiz.titulo}</h1>
            <p className="text-gray-600 mt-1">Quiz já realizado</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-6 w-6 mr-2 text-green-500" />
              Quiz Concluído
            </CardTitle>
            <CardDescription>
              Você já realizou este quiz anteriormente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="text-4xl font-bold text-green-600">
                {attempt.pontuacao} pontos
              </div>
              <p className="text-gray-600">
                Realizado em {new Date(attempt.dataConclusao).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Se o quiz foi finalizado agora, mostrar resultado
  if (quizFinished && result) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href="/aluno/quizzes">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar aos Quizzes
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-center">
              <Trophy className="h-6 w-6 mr-2 text-yellow-500" />
              Quiz Concluído!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-4">
              <div className="text-6xl font-bold text-primary">
                {result.pontuacao}
              </div>
              <p className="text-xl text-gray-600">pontos conquistados</p>
              
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {result.acertos}
                  </div>
                  <p className="text-sm text-gray-600">Acertos</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {result.total}
                  </div>
                  <p className="text-sm text-gray-600">Total</p>
                </div>
              </div>

              <div className="text-lg">
                <span className="font-semibold">
                  {Math.round((result.acertos / result.total) * 100)}%
                </span>
                <span className="text-gray-600"> de aproveitamento</span>
              </div>
            </div>

            {/* Conquistas */}
            {result.novasConquistas && result.novasConquistas.length > 0 && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2 flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Novas Conquistas!
                </h3>
                <div className="space-y-2">
                  {result.novasConquistas.map((conquista: string) => (
                    <Badge key={conquista} className="bg-yellow-200 text-yellow-800">
                      {conquista}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Novo nível */}
            {result.novoNivel && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Parabéns! Você subiu de nível!
                </h3>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Se o quiz não foi iniciado, mostrar tela de início
  if (!quizStarted) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href="/aluno/quizzes">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{quiz.titulo}</h1>
            <p className="text-gray-600 mt-1">Prepare-se para o quiz</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Sobre este Quiz</CardTitle>
                <CardDescription>{quiz.descricao}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <FileQuestion className="h-5 w-5 text-gray-400" />
                    <span>{quiz.questions.length} questões</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span>{quiz.tempoLimite} minutos</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Disciplinas:</p>
                  <div className="flex flex-wrap gap-2">
                    {[...new Set(quiz.questions.map(q => q.question.disciplina))].map(disciplina => (
                      <Badge key={disciplina} variant="outline">
                        {DISCIPLINAS[disciplina]}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600">
                    Criado por: <span className="font-medium">{quiz.professor.name}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Instruções</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="text-sm space-y-2">
                  <li>• Você tem {quiz.tempoLimite} minutos para completar</li>
                  <li>• Cada questão vale 10 pontos</li>
                  <li>• Você pode navegar entre as questões</li>
                  <li>• O quiz será enviado automaticamente quando o tempo acabar</li>
                  <li>• Você só pode fazer este quiz uma vez</li>
                </ul>

                <Button onClick={startQuiz} className="w-full" size="lg">
                  Iniciar Quiz
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Quiz em andamento
  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header com timer */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{quiz.titulo}</h1>
          <p className="text-gray-600">
            Questão {currentQuestion + 1} de {quiz.questions.length}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-red-600">
            {formatTime(timeLeft)}
          </div>
          <p className="text-sm text-gray-600">Tempo restante</p>
        </div>
      </div>

      {/* Progress */}
      <div>
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-gray-600 mt-1">
          {Math.round(progress)}% concluído
        </p>
      </div>

      {/* Question */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2 mb-2">
            <Badge variant="outline">
              {DISCIPLINAS[currentQ.question.disciplina]}
            </Badge>
            <Badge variant="outline">
              {currentQ.question.assunto}
            </Badge>
          </div>
          <CardTitle className="text-lg">
            {currentQ.question.enunciado}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentQ.question.alternativas.map((alternativa, index) => (
            <button
              key={index}
              onClick={() => selectAnswer(index)}
              className={`w-full p-4 text-left border rounded-lg transition-colors ${
                answers[currentQuestion] === index
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="font-medium mr-3">
                {String.fromCharCode(65 + index)})
              </span>
              {alternativa}
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={previousQuestion}
          disabled={currentQuestion === 0}
        >
          Anterior
        </Button>

        <div className="flex space-x-2">
          {currentQuestion === quiz.questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={submitting || answers.includes(-1)}
            >
              {submitting ? 'Enviando...' : 'Finalizar Quiz'}
            </Button>
          ) : (
            <Button
              onClick={nextQuestion}
              disabled={currentQuestion === quiz.questions.length - 1}
            >
              Próxima
            </Button>
          )}
        </div>
      </div>

      {/* Question Navigator */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Navegação Rápida</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-10 gap-2">
            {quiz.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                  index === currentQuestion
                    ? 'bg-primary text-white'
                    : answers[index] !== -1
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

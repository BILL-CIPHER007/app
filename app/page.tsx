
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/loading-spinner';
import { 
  BookOpen, 
  Trophy, 
  Users, 
  Target,
  ArrowRight,
  Star,
  Zap,
  Award
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      if (user.type === 'PROFESSOR') {
        router.push('/professor');
      } else {
        router.push('/aluno');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Carregando..." />
      </div>
    );
  }

  if (user) {
    return null; // Redirecionamento em andamento
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              IFPI Platform
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/register">
              <Button>Cadastrar</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Prepare-se para o IFPI
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Plataforma educacional gamificada para preparação de alunos da rede pública 
              para o exame classificatório do Instituto Federal do Piauí
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Começar Agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Já tenho conta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Por que escolher nossa plataforma?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Oferecemos uma experiência completa de aprendizado com gamificação, 
              estatísticas detalhadas e conteúdo focado no exame do IFPI
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Conteúdo Direcionado</CardTitle>
                <CardDescription>
                  Questões específicas para o exame classificatório do IFPI nas 6 disciplinas principais
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Trophy className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Gamificação</CardTitle>
                <CardDescription>
                  Sistema de pontos, níveis e medalhas para tornar o aprendizado mais envolvente
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Para Professores e Alunos</CardTitle>
                <CardDescription>
                  Professores podem criar questões e quizzes, alunos podem praticar e acompanhar progresso
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <CardTitle>Ranking Global</CardTitle>
                <CardDescription>
                  Compete com outros estudantes e veja sua posição no ranking geral
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>Simulados Cronometrados</CardTitle>
                <CardDescription>
                  Pratique com tempo limite para simular as condições reais do exame
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle>Estatísticas Detalhadas</CardTitle>
                <CardDescription>
                  Acompanhe seu desempenho com gráficos e relatórios completos
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Disciplines Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Disciplinas Disponíveis</h2>
            <p className="text-gray-600">
              Estude todas as matérias do exame classificatório do IFPI
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Língua Portuguesa', color: 'bg-blue-500', icon: '📚' },
              { name: 'Matemática', color: 'bg-green-500', icon: '🔢' },
              { name: 'Ciências', color: 'bg-purple-500', icon: '🔬' },
              { name: 'História', color: 'bg-orange-500', icon: '📜' },
              { name: 'Geografia', color: 'bg-teal-500', icon: '🌍' },
              { name: 'Inglês', color: 'bg-pink-500', icon: '🇺🇸' },
            ].map((disciplina) => (
              <Card key={disciplina.name} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${disciplina.color} rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl`}>
                    {disciplina.icon}
                  </div>
                  <h3 className="font-semibold text-lg">{disciplina.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto max-w-7xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para começar sua jornada?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a milhares de estudantes que já estão se preparando para o IFPI
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary">
              Criar Conta Gratuita
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-900 text-white">
        <div className="container mx-auto max-w-7xl text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <BookOpen className="h-5 w-5" />
            <span className="font-semibold">IFPI Platform</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2025 IFPI Platform. Plataforma educacional para preparação do exame classificatório.
          </p>
        </div>
      </footer>
    </div>
  );
}


'use client';

import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  LogOut, 
  Trophy, 
  Star,
  BookOpen,
  BarChart3,
  Settings
} from 'lucide-react';
import Link from 'next/link';

export function Header() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const isProfessor = user.type === 'PROFESSOR';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-6">
          <Link href={isProfessor ? '/professor' : '/aluno'} className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              IFPlay
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-4">
            {isProfessor ? (
              <>
                <Link href="/professor">
                  <Button variant="ghost" size="sm">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/professor/questions">
                  <Button variant="ghost" size="sm">
                    Questões
                  </Button>
                </Link>
                <Link href="/professor/quizzes">
                  <Button variant="ghost" size="sm">
                    Quizzes
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/aluno">
                  <Button variant="ghost" size="sm">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/aluno/quizzes">
                  <Button variant="ghost" size="sm">
                    Quizzes
                  </Button>
                </Link>
                <Link href="/aluno/ranking">
                  <Button variant="ghost" size="sm">
                    <Trophy className="h-4 w-4 mr-2" />
                    Ranking
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {!isProfessor && (
            <div className="hidden sm:flex items-center space-x-2">
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                <Star className="h-3 w-3 mr-1" />
                Nível {user.level}
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {user.points} pts
              </Badge>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">{user.name}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

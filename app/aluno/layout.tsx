
'use client';

import { useAuth } from '@/contexts/auth-context';
import { Header } from '@/components/header';
import { LoadingSpinner } from '@/components/loading-spinner';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AlunoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.type !== 'ALUNO')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Carregando..." />
      </div>
    );
  }

  if (!user || user.type !== 'ALUNO') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto max-w-7xl px-4 py-8">
        {children}
      </main>
    </div>
  );
}

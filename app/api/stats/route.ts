
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    if (payload.type === 'PROFESSOR') {
      // Estatísticas para professor
      const [
        totalQuestions,
        totalQuizzes,
        totalAttempts,
        recentAttempts,
        questionsByDisciplina,
        quizzesByMonth,
      ] = await Promise.all([
        prisma.question.count({
          where: { professorId: payload.userId },
        }),
        prisma.quiz.count({
          where: { professorId: payload.userId },
        }),
        prisma.quizAttempt.count({
          where: {
            quiz: { professorId: payload.userId },
          },
        }),
        prisma.quizAttempt.findMany({
          where: {
            quiz: { professorId: payload.userId },
          },
          select: {
            id: true,
            pontuacao: true,
            tempoGasto: true,
            dataConclusao: true,
            aluno: { select: { name: true } },
            quiz: { select: { titulo: true } },
          },
          orderBy: { dataConclusao: 'desc' },
          take: 10,
        }),

        prisma.question.groupBy({
          by: ['disciplina'],
          where: { professorId: payload.userId },
          _count: { disciplina: true },
        }),
        prisma.quiz.findMany({
          where: { professorId: payload.userId },
          select: {
            createdAt: true,
            _count: { select: { attempts: true } },
          },
        }),
      ]);

      return NextResponse.json({
        totalQuestions,
        totalQuizzes,
        totalAttempts,
        recentAttempts,
        questionsByDisciplina,
        quizzesByMonth,
      });
    } else {
      // Estatísticas para aluno
      const [
        totalAttempts,
        totalPoints,
        averageScore,
        recentAttempts,
        attemptsByDisciplina,
        ranking,
      ] = await Promise.all([
        prisma.quizAttempt.count({
          where: { alunoId: payload.userId },
        }),
        prisma.user.findUnique({
          where: { id: payload.userId },
          select: { points: true, level: true, medals: true },
        }),
        prisma.quizAttempt.aggregate({
          where: { alunoId: payload.userId },
          _avg: { pontuacao: true },
        }),
        prisma.quizAttempt.findMany({
          where: { alunoId: payload.userId },
          select: {
            id: true,
            pontuacao: true,
            tempoGasto: true,
            dataConclusao: true,
            quiz: {
              select: {
                titulo: true,
                questions: {
                  select: {
                    question: {
                      select: {
                        id: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: { dataConclusao: 'desc' },
          take: 10,
        }),

        prisma.quizAttempt.findMany({
          where: { alunoId: payload.userId },
          select: {
            quiz: {
              select: {
                questions: {
                  select: {
                    question: {
                      select: {
                        disciplina: true,
                      },
                    },
                  },
                },
              },
            },
          },
        }),
        prisma.user.findMany({
          where: { type: 'ALUNO' },
          select: {
            id: true,
            name: true,
            points: true,
            level: true,
          },
          orderBy: { points: 'desc' },
          take: 10,
        }),
      ]);

      return NextResponse.json({
        totalAttempts,
        userInfo: totalPoints,
        averageScore: averageScore._avg.pontuacao || 0,
        recentAttempts,
        attemptsByDisciplina,
        ranking,
      });
    }
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { POINTS_PER_CORRECT_ANSWER, calculateLevel, checkAchievements } from '@/lib/gamification';
import { z } from 'zod';

export const dynamic = "force-dynamic";

const attemptSchema = z.object({
  respostas: z.array(z.number().min(0).max(4)),
  tempoGasto: z.number().min(1),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || payload.type !== 'ALUNO') {
      return NextResponse.json({ error: 'Apenas alunos podem fazer quizzes' }, { status: 403 });
    }

    const body = await request.json();
    const { respostas, tempoGasto } = attemptSchema.parse(body);

    // Buscar o quiz com as questões
    const quiz = await prisma.quiz.findUnique({
      where: { id: id },
      include: {
        questions: {
          include: {
            question: true,
          },
          orderBy: { id: 'asc' },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz não encontrado' }, { status: 404 });
    }

    if (!quiz.ativo) {
      return NextResponse.json({ error: 'Quiz não está ativo' }, { status: 400 });
    }

    if (respostas.length !== quiz.questions.length) {
      return NextResponse.json({ error: 'Número de respostas não confere' }, { status: 400 });
    }

    // Verificar se o aluno já fez este quiz
    const existingAttempt = await prisma.quizAttempt.findFirst({
      where: {
        alunoId: payload.userId,
        quizId: id,
      },
    });

    if (existingAttempt) {
      return NextResponse.json({ error: 'Você já fez este quiz' }, { status: 400 });
    }

    // Calcular pontuação
    let acertos = 0;
    quiz.questions.forEach((quizQuestion: any, index: number) => {
      if (respostas[index] === quizQuestion.question.respostaCorreta) {
        acertos++;
      }
    });

    const pontuacao = acertos * POINTS_PER_CORRECT_ANSWER;
    const isPerfectScore = acertos === quiz.questions.length;

    // Buscar estatísticas do usuário para verificar conquistas
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const quizzesCompleted = await prisma.quizAttempt.count({
      where: { alunoId: payload.userId },
    });

    const perfectScores = await prisma.quizAttempt.count({
      where: {
        alunoId: payload.userId,
        pontuacao: { gte: quiz.questions.length * POINTS_PER_CORRECT_ANSWER },
      },
    });

    // Criar tentativa
    const attempt = await prisma.quizAttempt.create({
      data: {
        alunoId: payload.userId,
        quizId: id,
        respostas,
        pontuacao,
        tempoGasto,
      },
    });

    // Atualizar pontos e nível do usuário
    const newPoints = user.points + pontuacao;
    const newLevel = calculateLevel(newPoints);

    // Verificar novas conquistas
    const userStats = {
      points: newPoints,
      quizzesCompleted: quizzesCompleted + 1,
      perfectScores: isPerfectScore ? perfectScores + 1 : perfectScores,
      currentStreak: 1, // Simplificado por agora
    };

    const newAchievements = checkAchievements(userStats);
    const currentMedals = user.medals || [];
    const achievementsToAdd = newAchievements.filter(
      (achievement) => !currentMedals.includes(achievement)
    );

    // Atualizar usuário
    await prisma.user.update({
      where: { id: payload.userId },
      data: {
        points: newPoints,
        level: newLevel,
        medals: [...currentMedals, ...achievementsToAdd],
      },
    });

    return NextResponse.json({
      attempt,
      resultado: {
        acertos,
        total: quiz.questions.length,
        pontuacao,
        novasConquistas: achievementsToAdd,
        novoNivel: newLevel > user.level,
      },
    });
  } catch (error) {
    console.error('Erro ao submeter quiz:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

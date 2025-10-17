
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { z } from 'zod';

export const dynamic = "force-dynamic";

const quizSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  tempoLimite: z.number().min(1, 'Tempo limite deve ser maior que 0'),
  questionIds: z.array(z.string()).min(1, 'Deve ter pelo menos uma questão'),
});

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

    const { searchParams } = new URL(request.url);
    const ativo = searchParams.get('ativo');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const where: any = {};
    if (ativo !== null) where.ativo = ativo === 'true';
    if (payload.type === 'PROFESSOR') {
      where.professorId = payload.userId;
    }
    const includeOptions: any = {
      professor: {
        select: { name: true },
      },
      questions: {
        include: {
          question: true,
        },
      },
      _count: {
        select: {
          attempts: true,
        },
      },
    };

    if (payload.type === 'ALUNO') {
      includeOptions.attempts = {
        where: { alunoId: payload.userId },
        select: {
          id: true,
          pontuacao: true,
          dataConclusao: true,
        },
      };
    }

    const [quizzes, total] = await Promise.all([
      prisma.quiz.findMany({
        where,
        include: includeOptions,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.quiz.count({ where }),
    ]);


    return NextResponse.json({
      quizzes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Erro ao buscar quizzes:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || payload.type !== 'PROFESSOR') {
      return NextResponse.json({ error: 'Apenas professores podem criar quizzes' }, { status: 403 });
    }

    const body = await request.json();
    const { titulo, descricao, tempoLimite, questionIds } = quizSchema.parse(body);

    // Verificar se todas as questões existem e pertencem ao professor
    const questions = await prisma.question.findMany({
      where: {
        id: { in: questionIds },
        professorId: payload.userId,
      },
    });

    if (questions.length !== questionIds.length) {
      return NextResponse.json(
        { error: 'Algumas questões não foram encontradas ou não pertencem a você' },
        { status: 400 }
      );
    }

    const quiz = await prisma.quiz.create({
      data: {
        titulo,
        descricao,
        tempoLimite,
        professorId: payload.userId,
        questions: {
          create: questionIds.map((questionId) => ({
            questionId,
          })),
        },
      },
      include: {
        professor: {
          select: { name: true },
        },
        questions: {
          include: {
            question: true,
          },
        },
      },
    });

    return NextResponse.json(quiz, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar quiz:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

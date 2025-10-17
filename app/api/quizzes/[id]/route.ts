
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { z } from 'zod';

export const dynamic = "force-dynamic";

export async function GET(
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
    if (!payload) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: id },
      include: {
        professor: {
          select: { name: true },
        },
        questions: {
          include: {
            question: true,
          },
        },
        attempts: {
          where: payload.type === 'ALUNO' ? { alunoId: payload.userId } : {},
          include: {
            aluno: {
              select: { name: true },
            },
          },
          orderBy: { dataConclusao: 'desc' },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz não encontrado' }, { status: 404 });
    }

    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Erro ao buscar quiz:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function DELETE(
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
    if (!payload || payload.type !== 'PROFESSOR') {
      return NextResponse.json({ error: 'Apenas professores podem excluir quizzes' }, { status: 403 });
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: id },
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz não encontrado' }, { status: 404 });
    }

    if (quiz.professorId !== payload.userId) {
      return NextResponse.json({ error: 'Você só pode excluir seus próprios quizzes' }, { status: 403 });
    }

    await prisma.quiz.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: 'Quiz excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir quiz:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

const quizSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  tempoLimite: z.number().min(1, 'Tempo limite deve ser maior que 0'),
  questionIds: z.array(z.string()).min(1, 'Selecione pelo menos uma questão'),
});

export async function PUT(
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
    if (!payload || payload.type !== 'PROFESSOR') {
      return NextResponse.json({ error: 'Apenas professores podem editar quizzes' }, { status: 403 });
    }

    const body = await request.json();
    const { titulo, descricao, tempoLimite, questionIds } = quizSchema.parse(body);

    // Verificar se o quiz existe e pertence ao professor
    const quiz = await prisma.quiz.findUnique({ where: { id } });
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz não encontrado' }, { status: 404 });
    }
    if (quiz.professorId !== payload.userId) {
      return NextResponse.json({ error: 'Você só pode editar seus próprios quizzes' }, { status: 403 });
    }

    // Verificar se todas as questões existem e pertencem ao professor
    const questions = await prisma.question.findMany({
      where: { id: { in: questionIds }, professorId: payload.userId },
    });
    if (questions.length !== questionIds.length) {
      return NextResponse.json(
        { error: 'Algumas questões não foram encontradas ou não pertencem a você' },
        { status: 400 }
      );
    }

    // Atualizar quiz e suas relações
    const updatedQuiz = await prisma.quiz.update({
      where: { id },
      data: {
        titulo,
        descricao,
        tempoLimite,
        questions: {
          deleteMany: {}, // Remove ligações antigas
          create: questionIds.map((qid) => ({ questionId: qid })),
        },
      },
      include: {
        professor: { select: { name: true } },
        questions: { include: { question: true } },
      },
    });

    return NextResponse.json(updatedQuiz);
  } catch (error) {
    console.error('Erro ao atualizar quiz:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

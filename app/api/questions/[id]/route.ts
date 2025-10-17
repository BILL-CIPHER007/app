
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { z } from 'zod';

export const dynamic = "force-dynamic";

const questionSchema = z.object({
  disciplina: z.enum(['LINGUA_PORTUGUESA', 'MATEMATICA', 'CIENCIAS', 'HISTORIA', 'GEOGRAFIA', 'INGLES']),
  assunto: z.string().min(1, 'Assunto é obrigatório'),
  enunciado: z.string().min(1, 'Enunciado é obrigatório'),
  alternativas: z.array(z.string()).length(5, 'Deve ter exatamente 5 alternativas'),
  respostaCorreta: z.number().min(0).max(4, 'Resposta correta deve ser entre 0 e 4'),
  dificuldade: z.enum(['FACIL', 'MEDIO', 'DIFICIL']),
});

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

    const question = await prisma.question.findUnique({
      where: { id: id },
      include: {
        professor: {
          select: { name: true },
        },
      },
    });

    if (!question) {
      return NextResponse.json({ error: 'Questão não encontrada' }, { status: 404 });
    }

    return NextResponse.json(question);
  } catch (error) {
    console.error('Erro ao buscar questão:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

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
      return NextResponse.json({ error: 'Apenas professores podem editar questões' }, { status: 403 });
    }

    const question = await prisma.question.findUnique({
      where: { id: id },
    });

    if (!question) {
      return NextResponse.json({ error: 'Questão não encontrada' }, { status: 404 });
    }

    if (question.professorId !== payload.userId) {
      return NextResponse.json({ error: 'Você só pode editar suas próprias questões' }, { status: 403 });
    }

    const body = await request.json();
    const data = questionSchema.parse(body);

    const updatedQuestion = await prisma.question.update({
      where: { id: id },
      data,
      include: {
        professor: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json(updatedQuestion);
  } catch (error) {
    console.error('Erro ao atualizar questão:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
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
      return NextResponse.json({ error: 'Apenas professores podem excluir questões' }, { status: 403 });
    }

    const question = await prisma.question.findUnique({
      where: { id: id },
    });

    if (!question) {
      return NextResponse.json({ error: 'Questão não encontrada' }, { status: 404 });
    }

    if (question.professorId !== payload.userId) {
      return NextResponse.json({ error: 'Você só pode excluir suas próprias questões' }, { status: 403 });
    }

    await prisma.question.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: 'Questão excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir questão:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

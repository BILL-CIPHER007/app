
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
    const disciplina = searchParams.get('disciplina');
    const assunto = searchParams.get('assunto');
    const dificuldade = searchParams.get('dificuldade');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const where: any = {};
    if (disciplina && disciplina !== 'all') where.disciplina = disciplina;
    if (assunto && assunto !== 'all') where.assunto = { contains: assunto, mode: 'insensitive' };
    if (dificuldade && dificuldade !== 'all') where.dificuldade = dificuldade;

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        include: {
          professor: {
            select: { name: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.question.count({ where }),
    ]);

    return NextResponse.json({
      questions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Erro ao buscar questões:', error);
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
      return NextResponse.json({ error: 'Apenas professores podem criar questões' }, { status: 403 });
    }

    const body = await request.json();
    const data = questionSchema.parse(body);

    const question = await prisma.question.create({
      data: {
        ...data,
        professorId: payload.userId,
      },
      include: {
        professor: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar questão:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

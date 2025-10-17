
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Criar usuário professor de exemplo
  const professorPassword = await bcrypt.hash('password123', 12);
  const professor = await prisma.user.upsert({
    where: { email: 'professor@ifpi.edu.br' },
    update: {},
    create: {
      email: 'professor@ifpi.edu.br',
      name: 'Professor Silva',
      password: professorPassword,
      type: 'PROFESSOR',
      points: 100,
      level: 5,
      medals: ['CREATOR', 'EXPERT'],
    },
  });

  // Criar usuário aluno de exemplo
  const alunoPassword = await bcrypt.hash('password123', 12);
  const aluno = await prisma.user.upsert({
    where: { email: 'aluno@example.com' },
    update: {},
    create: {
      email: 'aluno@example.com',
      name: 'João Silva',
      password: alunoPassword,
      type: 'ALUNO',
      points: 250,
      level: 3,
      medals: ['FIRST_QUIZ', 'STREAK_5'],
    },
  });

  // Criar mais alguns alunos para o ranking
  const alunoPassword2 = await bcrypt.hash('password123', 12);
  const aluno2 = await prisma.user.upsert({
    where: { email: 'maria@example.com' },
    update: {},
    create: {
      email: 'maria@example.com',
      name: 'Maria Santos',
      password: alunoPassword2,
      type: 'ALUNO',
      points: 320,
      level: 4,
      medals: ['FIRST_QUIZ', 'STREAK_5', 'TOP_PERFORMER'],
    },
  });

  const alunoPassword3 = await bcrypt.hash('password123', 12);
  const aluno3 = await prisma.user.upsert({
    where: { email: 'pedro@example.com' },
    update: {},
    create: {
      email: 'pedro@example.com',
      name: 'Pedro Costa',
      password: alunoPassword3,
      type: 'ALUNO',
      points: 180,
      level: 2,
      medals: ['FIRST_QUIZ'],
    },
  });

  // Criar questões de exemplo
  const questoes = [
    // Língua Portuguesa
    {
      disciplina: 'LINGUA_PORTUGUESA' as const,
      assunto: 'Interpretação de Texto',
      enunciado: 'Leia o texto abaixo e responda: "O Brasil é um país de dimensões continentais, com rica diversidade cultural e natural. Sua economia é uma das maiores da América Latina." O texto destaca principalmente:',
      alternativas: [
        'A economia brasileira',
        'A localização geográfica do Brasil',
        'As características gerais do Brasil',
        'A população brasileira',
        'O clima brasileiro'
      ],
      respostaCorreta: 2,
      dificuldade: 'FACIL' as const,
      professorId: professor.id,
    },
    {
      disciplina: 'LINGUA_PORTUGUESA' as const,
      assunto: 'Gramática',
      enunciado: 'Assinale a alternativa em que todas as palavras estão corretamente acentuadas:',
      alternativas: [
        'Saúde, heroí, Piauí',
        'Saúde, herói, Piauí',
        'Saude, herói, Piauí',
        'Saúde, herói, Piaui',
        'Saude, heroí, Piaui'
      ],
      respostaCorreta: 1,
      dificuldade: 'MEDIO' as const,
      professorId: professor.id,
    },
    // Matemática
    {
      disciplina: 'MATEMATICA' as const,
      assunto: 'Álgebra',
      enunciado: 'Resolva a equação: 2x + 5 = 15. O valor de x é:',
      alternativas: [
        '5',
        '10',
        '7',
        '3',
        '8'
      ],
      respostaCorreta: 0,
      dificuldade: 'FACIL' as const,
      professorId: professor.id,
    },
    {
      disciplina: 'MATEMATICA' as const,
      assunto: 'Geometria',
      enunciado: 'A área de um triângulo com base 8 cm e altura 6 cm é:',
      alternativas: [
        '48 cm²',
        '24 cm²',
        '14 cm²',
        '12 cm²',
        '36 cm²'
      ],
      respostaCorreta: 1,
      dificuldade: 'MEDIO' as const,
      professorId: professor.id,
    },
    // Ciências
    {
      disciplina: 'CIENCIAS' as const,
      assunto: 'Biologia',
      enunciado: 'O processo pelo qual as plantas produzem seu próprio alimento é chamado de:',
      alternativas: [
        'Respiração',
        'Digestão',
        'Fotossíntese',
        'Transpiração',
        'Fermentação'
      ],
      respostaCorreta: 2,
      dificuldade: 'FACIL' as const,
      professorId: professor.id,
    },
    // História
    {
      disciplina: 'HISTORIA' as const,
      assunto: 'História do Brasil',
      enunciado: 'A Independência do Brasil foi proclamada em:',
      alternativas: [
        '7 de setembro de 1822',
        '15 de novembro de 1889',
        '21 de abril de 1792',
        '12 de outubro de 1492',
        '1º de janeiro de 1801'
      ],
      respostaCorreta: 0,
      dificuldade: 'FACIL' as const,
      professorId: professor.id,
    },
    // Geografia
    {
      disciplina: 'GEOGRAFIA' as const,
      assunto: 'Geografia do Brasil',
      enunciado: 'O Piauí faz fronteira com quantos estados brasileiros?',
      alternativas: [
        '4 estados',
        '5 estados',
        '6 estados',
        '7 estados',
        '3 estados'
      ],
      respostaCorreta: 2,
      dificuldade: 'MEDIO' as const,
      professorId: professor.id,
    },
    // Inglês
    {
      disciplina: 'INGLES' as const,
      assunto: 'Vocabulário',
      enunciado: 'What is the correct translation for "escola" in English?',
      alternativas: [
        'House',
        'School',
        'Hospital',
        'Library',
        'Market'
      ],
      respostaCorreta: 1,
      dificuldade: 'FACIL' as const,
      professorId: professor.id,
    }
  ];

  for (const questao of questoes) {
    await prisma.question.create({
      data: questao,
    });
  }

  // Criar quiz de exemplo
  const quiz = await prisma.quiz.upsert({
    where: { id: 'quiz-simulado-ifpi' },
    update: {},
    create: {
      id: 'quiz-simulado-ifpi',
      titulo: 'Simulado IFPI - Conhecimentos Gerais',
      descricao: 'Quiz preparatório com questões das principais disciplinas do exame classificatório do IFPI.',
      professorId: professor.id,
      tempoLimite: 60,
      ativo: true,
    },
  });

  // Associar algumas questões ao quiz
  const questoesCriadas = await prisma.question.findMany({
    take: 5,
  });

  for (const questao of questoesCriadas) {
    await prisma.quizQuestion.upsert({
      where: {
        quizId_questionId: {
          quizId: quiz.id,
          questionId: questao.id,
        },
      },
      update: {},
      create: {
        quizId: quiz.id,
        questionId: questao.id,
      },
    });
  }

  // Criar algumas tentativas de quiz para gerar dados no ranking
  await prisma.quizAttempt.create({
    data: {
      alunoId: aluno2.id,
      quizId: quiz.id,
      respostas: [0, 1, 2, 1, 0], // Algumas respostas corretas
      pontuacao: 80,
      tempoGasto: 1200, // 20 minutos
    },
  });

  await prisma.quizAttempt.create({
    data: {
      alunoId: aluno.id,
      quizId: quiz.id,
      respostas: [0, 1, 1, 1, 0], // Algumas respostas corretas
      pontuacao: 60,
      tempoGasto: 1800, // 30 minutos
    },
  });

  await prisma.quizAttempt.create({
    data: {
      alunoId: aluno3.id,
      quizId: quiz.id,
      respostas: [0, 0, 2, 0, 1], // Algumas respostas corretas
      pontuacao: 40,
      tempoGasto: 2400, // 40 minutos
    },
  });

  // Criar conquistas/medalhas
  const achievements = [
    {
      id: 'first-quiz',
      name: 'Primeiro Quiz',
      description: 'Complete seu primeiro quiz',
      icon: '🎯',
      condition: 'complete_first_quiz',
      points: 10,
    },
    {
      id: 'streak-5',
      name: 'Sequência de 5',
      description: 'Complete 5 quizzes seguidos',
      icon: '🔥',
      condition: 'complete_5_quizzes',
      points: 50,
    },
    {
      id: 'top-performer',
      name: 'Alto Desempenho',
      description: 'Obtenha pontuação acima de 80%',
      icon: '⭐',
      condition: 'score_above_80',
      points: 25,
    },
    {
      id: 'creator',
      name: 'Criador',
      description: 'Crie sua primeira questão',
      icon: '✏️',
      condition: 'create_first_question',
      points: 15,
    },
    {
      id: 'expert',
      name: 'Especialista',
      description: 'Crie 10 questões',
      icon: '🎓',
      condition: 'create_10_questions',
      points: 100,
    },
  ];

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { id: achievement.id },
      update: {},
      create: achievement,
    });
  }

  console.log('Database seeded successfully!');
  console.log('Professor login: professor@ifpi.edu.br / password123');
  console.log('Aluno login: aluno@example.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

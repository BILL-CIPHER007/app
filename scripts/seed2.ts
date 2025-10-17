import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

console.log('Iniciando a inserção das 20 questões selecionadas...');

// Busca por um usuário do tipo PROFESSOR para associar as questões [1]
const professor = await prisma.user.findFirst({
  where: { type: 'PROFESSOR' },
});

if (!professor) {
  throw new Error('Nenhum professor encontrado no banco de dados. Questões não puderam ser associadas.');
}

const questoes = [

  // ------------------------------------
  // LÍNGUA PORTUGUESA (10 Questões)
  // ------------------------------------

  // LP 1 (FÁCIL) - Interpretação Textual
  {
    disciplina: 'LINGUA_PORTUGUESA' as const,
    assunto: 'Interpretação Textual',
    enunciado: '02. Releia atentamente o poema anterior e julgue os itens a seguir. I – O eu lírico, na primeira estrofe, considera necessário buscar uma mudança profunda, que vá além da aparência. II – Na primeira estrofe, o eu lírico afi rma que a transformação deve estar presente nas pequenas coisas, ser originada no interior de cada um. III – Na segunda estrofe, o eu lírico defende a ideia de que não vale a pena se arrepender de tudo o que fez nem acreditar que um novo ano será a solução para todos os problemas. Está correto o que se afi rma em:',
    alternativas: [
      'I, apenas.',
      'II, apenas.',
      'I e II, apenas.',
      'II e III, apenas.',
      'I, II e III.',
    ],
    respostaCorreta: 4, // (e) I, II e III [3, 4]
    dificuldade: 'FACIL' as const,
    professorId: professor.id,
  },

  // LP 2 (FÁCIL) - Semântica e Sintaxe
  {
    disciplina: 'LINGUA_PORTUGUESA' as const,
    assunto: 'Semântica e Sintaxe',
    enunciado: '10. Nos versos “É dentro de você que o Ano Novo // cochila e espera desde sempre”, a expressão destacada indica:',
    alternativas: [
      'intensidade',
      'modo',
      'tempo',
      'lugar',
      'causa',
    ],
    respostaCorreta: 3, // (d) lugar [5]
    dificuldade: 'FACIL' as const,
    professorId: professor.id,
  },

  // LP 3 (FÁCIL) - Sintaxe (Classificação do Sujeito)
  {
    disciplina: 'LINGUA_PORTUGUESA' as const,
    assunto: 'Sintaxe (Classificação do Sujeito)',
    enunciado: '29. “Então vem cá”. Nessa oração, o sujeito deve ser classifi cado como:',
    alternativas: [
      'simples e explícito',
      'simples e oculto',
      'composto',
      'indeterminado',
      'inexistente',
    ],
    respostaCorreta: 1, // (b) simples e oculto [6]
    dificuldade: 'FACIL' as const,
    professorId: professor.id,
  },

  // LP 4 (FÁCIL) - Vocabulário e Sinonímia
  {
    disciplina: 'LINGUA_PORTUGUESA' as const,
    assunto: 'Vocabulário e Sinonímia',
    enunciado: '3. A palavra “hesitante”, no contexto do texto [O Homem Trocado], pode ser substituída sem comprometer o sentido pretendido por:',
    alternativas: [
      'vacilante',
      'resoluta',
      'categórica',
      'convicta',
      'confiante',
    ],
    respostaCorreta: 0, // (a) vacilante [7]
    dificuldade: 'FACIL' as const,
    professorId: professor.id,
  },

  // LP 5 (FÁCIL) - Classificação de Orações
  {
    disciplina: 'LINGUA_PORTUGUESA' as const,
    assunto: 'Classificação de Orações',
    enunciado: '4. A oração “[...] mas não conseguira entrar na universidade [...]”, grifada no texto [O Homem Trocado], classifica-se como:',
    alternativas: [
      'Subordinada adverbial causal',
      'Subordinada substantiva objetiva direta',
      'Coordenada sindética explicativa',
      'Coordenada sindética adversativa',
      'Subordinada adjetiva restritiva',
    ],
    respostaCorreta: 3, // (d) Coordenada sindética adversativa [7]
    dificuldade: 'FACIL' as const,
    professorId: professor.id,
  },

  // LP 6 (MÉDIO) - Tipologia e Gênero Textual
  {
    disciplina: 'LINGUA_PORTUGUESA' as const,
    assunto: 'Tipologia e Gênero Textual',
    enunciado: '17. O texto apresentado [sobre o trabalho análogo ao escravo], por seu propósito comunicativo, ilustra o gênero textual notícia. No que diz respeito a sua organização, nesse gênero predomina a sequência:',
    alternativas: [
      'argumentativa',
      'descritiva',
      'dialogal',
      'narrativa',
      'injuntiva',
    ],
    respostaCorreta: 3, // (d) narrativa [8]
    dificuldade: 'MEDIO' as const,
    professorId: professor.id,
  },

  // LP 7 (MÉDIO) - Sintaxe (Adjunto Adverbial)
  {
    disciplina: 'LINGUA_PORTUGUESA' as const,
    assunto: 'Sintaxe (Adjunto Adverbial)',
    enunciado: '21. Identifique a única oração cujo termo destacado funciona sintaticamente como adjunto adverbial.',
    alternativas: [
      'Os noivos estavam radiantes.',
      'A família aproveitou a festa.',
      'As madrinhas elogiaram a noiva',
      'No último banco sentou-se o tio.',
      'Os padrinhos dos noivos estavam elegantes.',
    ],
    respostaCorreta: 3, // (d) No último banco sentou-se o tio. [9]
    dificuldade: 'MEDIO' as const,
    professorId: professor.id,
  },

  // LP 8 (DIFÍCIL) - Morfologia (Classificação de Palavras)
  {
    disciplina: 'LINGUA_PORTUGUESA' as const,
    assunto: 'Morfologia (Classificação de Palavras)',
    enunciado: '08. Na última estrofe, encontramos os seguintes versos: “Para ganhar um Ano Novo // que mereça este nome...”. Do ponto de vista morfológico, a palavra destacada é classifi cada como:',
    alternativas: [
      'pronome demonstrativo',
      'conjunção integrante',
      'pronome relativo',
      'pronome indefi nido',
      'preposição',
    ],
    respostaCorreta: 2, // (c) pronome relativo [5, 10]
    dificuldade: 'DIFICIL' as const,
    professorId: professor.id,
  },

  // LP 9 (DIFÍCIL) - Concordância Verbal
  {
    disciplina: 'LINGUA_PORTUGUESA' as const,
    assunto: 'Concordância Verbal',
    enunciado: '22. No quarto parágrafo do texto III, encontra-se o seguinte período: “Kelly afi rma que há uma resistência de mulheres na ciência”. Nesse período, o verbo haver é impessoal e está usado de acordo as regras de concordância verbal da língua portuguesa. Identifi que a alternativa em que a mesma situação acontece.',
    alternativas: [
      'Já houveram várias pesquisadoras importantes na história da Computação.',
      'Deve haver várias pesquisadoras importantes na história da Computação.',
      'Haviam várias pesquisadoras importantes naquele evento de Computação',
      'Haverão várias pesquisadoras importantes naquele evento de Computação',
      'Poderão haver várias pesquisadoras importantes naquele evento de Computação.',
    ],
    respostaCorreta: 1, // (b) Deve haver várias pesquisadoras importantes na história da Computação. [11]
    dificuldade: 'DIFICIL' as const,
    professorId: professor.id,
  },

  // LP 10 (DIFÍCIL) - Acentuação Gráfica
  {
    disciplina: 'LINGUA_PORTUGUESA' as const,
    assunto: 'Acentuação Gráfica',
    enunciado: '6. Aponte a alternativa cujos vocábulos são acentuados, respectivamente, pela mesma razão de “lírio” e “apêndice”.',
    alternativas: [
      'Hermenêutica; caráter',
      'Córtex; balaústre',
      'Sonâmbulo; enciclopédia',
      'Têxtil; blasfêmia',
      'Balbúrdia; tácito.',
    ],
    respostaCorreta: 4, // (e) Balbúrdia; tácito. (Paroxítona terminada em ditongo/Proparoxítona) [12]
    dificuldade: 'DIFICIL' as const,
    professorId: professor.id,
  },

  // ------------------------------------
  // MATEMÁTICA (10 Questões)
  // ------------------------------------

  // MAT 1 (FÁCIL) - Porcentagem
  {
    disciplina: 'MATEMATICA' as const,
    assunto: 'Porcentagem',
    enunciado: '47. O preço de um aparelho celular, após um desconto de 20% sobre o preço original, é igual a R$ 840,00. Qual seria o preço do aparelho após um desconto de 30% sobre o preço original?',
    alternativas: [
      'R$ 730,00',
      'R$ 735,00',
      'R$ 740,00',
      'R$ 745,00',
      'R$ 750,00',
    ],
    respostaCorreta: 2, // (c) R$ 740,00 [13]
    dificuldade: 'FACIL' as const,
    professorId: professor.id,
  },

  // MAT 2 (FÁCIL) - Sistemas de Equações Lineares
  {
    disciplina: 'MATEMATICA' as const,
    assunto: 'Sistemas de Equações Lineares',
    enunciado: '49. Adicionando, dois a dois, três números inteiros obtemos os seguintes valores: 18, 22, 36. Qual é a soma dos três números inteiros?',
    alternativas: [
      '32',
      '34',
      '36',
      '38',
      '40',
    ],
    respostaCorreta: 4, // (e) 40 [14]
    dificuldade: 'FACIL' as const,
    professorId: professor.id,
  },

  // MAT 3 (FÁCIL) - Porcentagem e Frações
  {
    disciplina: 'MATEMATICA' as const,
    assunto: 'Porcentagem e Frações',
    enunciado: '50. Mário tinha R$ 120,00. Gastou 40% dessa quantia na compra de uma camisa e gastou, em seguida, 75% do que havia sobrado na compra de uma calça. Com quanto Mário ficou?',
    alternativas: [
      'R$ 18,00',
      'R$ 26,00',
      'R$ 28,00',
      'R$ 36,00',
      'R$ 54,00',
    ],
    respostaCorreta: 0, // (a) R$ 18,00 [15, 16]
    dificuldade: 'FACIL' as const,
    professorId: professor.id,
  },

  // MAT 4 (FÁCIL) - Sistemas de Equações Lineares (Idade)
  {
    disciplina: 'MATEMATICA' as const,
    assunto: 'Sistemas de Equações Lineares (Idade)',
    enunciado: '54. Quando Breno nasceu, seu pai tinha 32 anos. Hoje, a soma das idades de Breno e de seu pai é 72 anos. Qual a idade atual de Breno e de seu pai, respectivamente?',
    alternativas: [
      '10 e 42',
      '15 e 57',
      '20 e 52',
      '22 e 54',
      '23 e 49',
    ],
    respostaCorreta: 1, // (b) 15 e 57 [17]
    dificuldade: 'FACIL' as const,
    professorId: professor.id,
  },

  // MAT 5 (FÁCIL) - Números Racionais (Dízima Periódica)
  {
    disciplina: 'MATEMATICA' as const,
    assunto: 'Números Racionais (Dízima Periódica)',
    enunciado: '32. O valor de 6 / 0,333... é:',
    alternativas: [
      '20,0',
      '18,18...',
      '18,0',
      '2,2...',
      '2,0',
    ],
    respostaCorreta: 2, // (c) 18,0 [18]
    dificuldade: 'FACIL' as const,
    professorId: professor.id,
  },

  // MAT 6 (MÉDIO) - Equação do Segundo Grau (Modelagem)
  {
    disciplina: 'MATEMATICA' as const,
    assunto: 'Equação do Segundo Grau (Modelagem)',
    enunciado: '37. Em uma unidade escolar, os 264 alunos estão dispostos de forma retangular, em fi las , de tal modo que o número de alunos de cada fi la supera em 10 o número de fi las. Marque a alternativa que indica quantos alunos há em cada fi la.',
    alternativas: [
      '22',
      '20',
      '18',
      '14',
      '12',
    ],
    respostaCorreta: 1, // (b) 20 [19]
    dificuldade: 'MEDIO' as const,
    professorId: professor.id,
  },

  // MAT 7 (MÉDIO) - Regra de Três Inversa
  {
    disciplina: 'MATEMATICA' as const,
    assunto: 'Regra de Três Inversa',
    enunciado: '52. Quatro torneiras iguais enchem um reservatório d’água em 5 horas. Em quanto tempo três torneiras iguais a essas enchem o mesmo reservatório d’água?',
    alternativas: [
      '3 horas e 45 minutos.',
      '3 horas e 50 minutos',
      '3 horas e 55 minutos',
      '6 horas e 40 minutos',
      '6 horas e 10 minutos.',
    ],
    respostaCorreta: 3, // (d) 6 horas e 40 minutos [16]
    dificuldade: 'MEDIO' as const,
    professorId: professor.id,
  },

  // MAT 8 (DIFÍCIL) - Equações e Proporção
  {
    disciplina: 'MATEMATICA' as const,
    assunto: 'Equações e Proporção',
    enunciado: '35. O Sr. João vai repartir igualmente 180 fi gurinhas com algumas crianças. Se chegarem mais cinco crianças, a quantidade que cada uma vai receber será 2/3 da quantidade da situação inicial. Quantas crianças há inicialmente nesse grupo?',
    alternativas: [
      '12',
      '10',
      '8',
      '6',
      '5',
    ],
    respostaCorreta: 0, // (a) 12 [20]
    dificuldade: 'DIFICIL' as const,
    professorId: professor.id,
  },

  // MAT 9 (DIFÍCIL) - Função Quadrática (Raízes)
  {
    disciplina: 'MATEMATICA' as const,
    assunto: 'Função Quadrática (Raízes)',
    enunciado: '53. A função quadrática f defi nida por f(x) = x^2 - kx + k - 1 tem duas raízes iguais. Qual é o valor de k?',
    alternativas: [
      '-4',
      '-2',
      '0',
      '1',
      '2',
    ],
    respostaCorreta: 4, // (e) 2 [21]
    dificuldade: 'DIFICIL' as const,
    professorId: professor.id,
  },

  // MAT 10 (DIFÍCIL) - Proporcionalidade e Sistemas Lineares
  {
    disciplina: 'MATEMATICA' as const,
    assunto: 'Proporcionalidade e Sistemas Lineares',
    enunciado: '57. Sendo x/4 = y/12 = z/36 e 12z - x - y = 0, segue que x + y + z é igual a:',
    alternativas: [
      '24',
      '28',
      '32',
      '36',
      '40',
    ],
    respostaCorreta: 4, // (e) 40 [22]
    dificuldade: 'DIFICIL' as const,
    professorId: professor.id,
  },
];

for (const questao of questoes) {
  await prisma.question.create({
    data: questao
  });
}

console.log('20 Questões de Língua Portuguesa e Matemática inseridas com sucesso!');

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
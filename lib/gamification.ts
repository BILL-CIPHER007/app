
export const POINTS_PER_CORRECT_ANSWER = 10;

export function calculateLevel(points: number): number {
  return Math.floor(points / 100) + 1;
}

export function getPointsForNextLevel(currentLevel: number): number {
  return currentLevel * 100;
}

export function getProgressToNextLevel(points: number): number {
  const currentLevel = calculateLevel(points);
  const pointsInCurrentLevel = points % 100;
  return (pointsInCurrentLevel / 100) * 100;
}

export const ACHIEVEMENTS = [
  {
    id: 'first-quiz',
    name: 'Primeiro Quiz',
    description: 'Complete seu primeiro quiz',
    icon: '🎯',
    condition: 'complete_quiz',
    points: 50,
  },
  {
    id: 'hundred-points',
    name: 'Centurião',
    description: 'Alcance 100 pontos',
    icon: '💯',
    condition: 'reach_points_100',
    points: 0,
  },
  {
    id: 'five-hundred-points',
    name: 'Especialista',
    description: 'Alcance 500 pontos',
    icon: '⭐',
    condition: 'reach_points_500',
    points: 0,
  },
  {
    id: 'perfect-score',
    name: 'Perfeição',
    description: 'Acerte todas as questões de um quiz',
    icon: '🏆',
    condition: 'perfect_quiz',
    points: 100,
  },
  {
    id: 'streak-five',
    name: 'Em Chamas',
    description: 'Complete 5 quizzes seguidos',
    icon: '🔥',
    condition: 'quiz_streak_5',
    points: 75,
  },
];

export function checkAchievements(userStats: {
  points: number;
  quizzesCompleted: number;
  perfectScores: number;
  currentStreak: number;
}): string[] {
  const newAchievements: string[] = [];

  if (userStats.quizzesCompleted >= 1) {
    newAchievements.push('first-quiz');
  }
  
  if (userStats.points >= 100) {
    newAchievements.push('hundred-points');
  }
  
  if (userStats.points >= 500) {
    newAchievements.push('five-hundred-points');
  }
  
  if (userStats.perfectScores >= 1) {
    newAchievements.push('perfect-score');
  }
  
  if (userStats.currentStreak >= 5) {
    newAchievements.push('streak-five');
  }

  return newAchievements;
}

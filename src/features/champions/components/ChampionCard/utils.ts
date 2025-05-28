// Helper function to format numbers with commas consistently
export const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US');
};

export const calculateWinRate = (wins: number, games: number): number => {
  return games > 0 ? (wins / games) * 100 : 0;
};

export const formatWinRate = (winRate: number): string => {
  return `${winRate.toFixed(1)}%`;
};

export const formatKDA = (kda: number): string => {
  return kda.toFixed(2);
};

export const calculateAverage = (total: number, games: number): number => {
  return games > 0 ? total / games : 0;
};

export const formatAverage = (average: number): string => {
  return average.toFixed(1);
};

export const getDifficultyPercentage = (difficulty: number): number => {
  return (difficulty / 10) * 100;
};

export const getContainerClasses = (
  variant: string,
  hasOnClick: boolean
): string => {
  const baseClasses = 'card bg-base-200 rounded-xl transition-all duration-200';
  const clickableClasses = hasOnClick ? 'cursor-pointer' : '';

  switch (variant) {
    case 'compact':
      return `${baseClasses} shadow p-3 ${clickableClasses}`;
    case 'detailed':
      return `${baseClasses} shadow-xl duration-300 p-6 ${clickableClasses}`;
    default:
      return `${baseClasses} shadow p-4 ${clickableClasses}`;
  }
};

export const formatKDAValue = (kdaValue: string | number): string => {
  if (typeof kdaValue === 'number') {
    return kdaValue.toFixed(2);
  }
  return kdaValue;
};

export const formatParticipationPercentage = (pKill: string): string => {
  return `${pKill}%`;
};

export const getBadgeKey = (label: string, index: number): string => {
  return `badge-${label}-${index}`;
};

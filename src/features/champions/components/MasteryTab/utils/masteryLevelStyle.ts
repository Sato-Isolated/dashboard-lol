import { Crown, Medal, Trophy, Star } from 'lucide-react';

export interface MasteryLevelStyle {
  badge: string;
  gradient: string;
  icon: typeof Crown;
  glow: string;
}

// Helper function to get mastery level badge style
export const getMasteryLevelStyle = (level: number): MasteryLevelStyle => {
  if (level >= 7) {
    return {
      badge: 'badge-warning',
      gradient: 'from-yellow-400 to-orange-500',
      icon: Crown,
      glow: 'shadow-yellow-500/50',
    };
  }
  if (level >= 5) {
    return {
      badge: 'badge-info',
      gradient: 'from-blue-400 to-purple-500',
      icon: Medal,
      glow: 'shadow-blue-500/50',
    };
  }
  if (level >= 3) {
    return {
      badge: 'badge-success',
      gradient: 'from-green-400 to-emerald-500',
      icon: Trophy,
      glow: 'shadow-green-500/50',
    };
  }
  return {
    badge: 'badge-neutral',
    gradient: 'from-gray-400 to-gray-500',
    icon: Star,
    glow: 'shadow-gray-500/50',
  };
};

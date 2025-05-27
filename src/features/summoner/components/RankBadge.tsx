import React, { useMemo } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  Trophy,
  Star,
  TrendingUp,
  Crown,
  Medal,
  Shield,
  Sparkles,
  Zap,
  Target,
  Award,
} from 'lucide-react';
import { getAramRank } from '@/features/aram/utils/aramRankSystem';
import { withPerformanceTracking } from '@/shared/components/performance/SimplePerformanceWrapper';

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
      duration: 0.6,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
      duration: 0.4,
    },
  },
};

const rankItemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 12,
    },
  },
};

// Tier colors and gradients for enhanced design
const tierColors: Record<string, string> = {
  IRON: 'text-slate-500',
  BRONZE: 'text-amber-600',
  SILVER: 'text-slate-400',
  GOLD: 'text-yellow-500',
  PLATINUM: 'text-cyan-500',
  EMERALD: 'text-emerald-500',
  DIAMOND: 'text-blue-500',
  MASTER: 'text-purple-500',
  GRANDMASTER: 'text-red-500',
  CHALLENGER: 'text-yellow-400',
};

const tierGradients: Record<string, string> = {
  IRON: 'from-slate-500/10 to-slate-600/5',
  BRONZE: 'from-amber-600/10 to-amber-700/5',
  SILVER: 'from-slate-400/10 to-slate-500/5',
  GOLD: 'from-yellow-500/10 to-yellow-600/5',
  PLATINUM: 'from-cyan-500/10 to-cyan-600/5',
  EMERALD: 'from-emerald-500/10 to-emerald-600/5',
  DIAMOND: 'from-blue-500/10 to-blue-600/5',
  MASTER: 'from-purple-500/10 to-purple-600/5',
  GRANDMASTER: 'from-red-500/10 to-red-600/5',
  CHALLENGER: 'from-yellow-400/10 to-yellow-500/5',
};

// Queue type display names
const queueDisplayNames: Record<string, string> = {
  RANKED_SOLO_5x5: 'Ranked Solo',
  RANKED_FLEX_SR: 'Ranked Flex',
  RANKED_FLEX_TT: 'Ranked Flex 3v3',
};

interface RankBadgeProps {
  aramScore: number;
  leagues: Array<{
    queueType: string;
    tier: string;
    rank: string;
    leaguePoints: number;
    wins: number;
    losses: number;
  }>;
}

interface RankItemProps {
  rank: {
    queueType: string;
    tier: string;
    rank: string;
    leaguePoints: number;
    wins: number;
    losses: number;
  };
}

const RankItemComponent: React.FC<RankItemProps> = ({ rank }) => {
  const tierColor = tierColors[rank.tier] || 'text-base-content';
  const tierGradient = tierGradients[rank.tier] || 'from-base-100 to-base-200';
  const queueName =
    queueDisplayNames[rank.queueType] ||
    rank.queueType
      .replace('RANKED_', '')
      .replace('_5x5', '')
      .replace('_SR', '');

  const winRate =
    rank.wins + rank.losses > 0
      ? Math.round((rank.wins / (rank.wins + rank.losses)) * 100)
      : 0;

  const isHighRank = ['MASTER', 'GRANDMASTER', 'CHALLENGER'].includes(
    rank.tier
  );
  const isGoodWinrate = winRate >= 60;

  return (
    <motion.div
      className={`card bg-gradient-to-br ${tierGradient} 
                 shadow-lg border border-base-content/10 overflow-hidden
                 transition-all duration-300`}
    >
      <div className='card-body p-4'>
        <div className='flex items-center justify-between mb-3'>
          <div className='flex items-center gap-2'>
            {' '}
            <motion.div className='text-base-content/40'>
              {isHighRank ? (
                <Crown size={16} className='text-yellow-500' />
              ) : (
                <Medal size={16} />
              )}
            </motion.div>
            <span className='font-semibold text-sm text-base-content/90'>
              {queueName}
            </span>
          </div>
          {isHighRank && (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className='badge badge-warning badge-xs gap-1'
            >
              <Sparkles size={10} />
              Elite
            </motion.div>
          )}
        </div>

        <div className='flex items-center justify-between mb-3'>
          {' '}
          <motion.div
            className={`text-lg font-bold ${tierColor} flex items-center gap-2`}
          >
            <Trophy size={18} className={tierColor} />
            {rank.tier} {rank.rank}
          </motion.div>
          <div className='text-right'>
            <div className='flex items-center gap-1 text-xs text-base-content/60'>
              <Star size={12} />
              <span className='font-semibold'>{rank.leaguePoints} LP</span>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-3 gap-2'>
          {' '}
          <motion.div className='text-center p-2 bg-success/10 rounded-lg border border-success/20'>
            <div className='text-sm font-bold text-success flex items-center justify-center gap-1'>
              <Target size={14} />
              {rank.wins}
            </div>
            <div className='text-xs text-base-content/60'>Wins</div>
          </motion.div>
          <motion.div className='text-center p-2 bg-error/10 rounded-lg border border-error/20'>
            <div className='text-sm font-bold text-error flex items-center justify-center gap-1'>
              <Shield size={14} />
              {rank.losses}
            </div>
            <div className='text-xs text-base-content/60'>Losses</div>
          </motion.div>
          <motion.div
            className={`text-center p-2 rounded-lg border ${
              isGoodWinrate
                ? 'bg-info/10 border-info/20'
                : 'bg-warning/10 border-warning/20'
            }`}
          />
          <motion.div>
            <div
              className={`text-sm font-bold flex items-center justify-center gap-1 ${
                isGoodWinrate ? 'text-info' : 'text-warning'
              }`}
            >
              <TrendingUp size={14} />
              {winRate}%
            </div>
            <div className='text-xs text-base-content/60'>WR</div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const RankItem = React.memo(RankItemComponent);
RankItem.displayName = 'RankItem';

const RankBadge: React.FC<RankBadgeProps> = ({ aramScore, leagues }) => {
  const aramRank = useMemo(() => getAramRank(aramScore), [aramScore]);

  const rankedLeagues = useMemo(() => {
    if (!leagues || leagues.length === 0) {
      return (
        <motion.div
          variants={rankItemVariants}
          className='card bg-gradient-to-br from-base-200/50 to-base-300/50 
                     shadow-lg border border-base-content/10'
        >
          <div className='card-body p-6 text-center'>
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className='text-4xl mb-2 opacity-60'
            >
              🏆
            </motion.div>
            <span className='badge badge-outline badge-lg text-base-content/50 gap-2'>
              <Medal size={16} />
              Unranked
            </span>
            <p className='text-xs text-base-content/40 mt-2'>
              Start your ranked journey!
            </p>
          </div>
        </motion.div>
      );
    }

    return leagues.map((rank, i) => (
      <RankItem key={`${rank.queueType}-${i}`} rank={rank} />
    ));
  }, [leagues]);

  return (
    <motion.div
      variants={containerVariants}
      initial='hidden'
      animate='visible'
      className='flex flex-col gap-6 w-full'
    >
      {/* ARAM Rank Card */}
      <motion.div
        variants={cardVariants}
        className='card bg-gradient-to-br from-base-100 via-base-100 to-base-200/50 
                   shadow-xl border border-primary/20 overflow-hidden relative'
      >
        {/* Background decoration */}
        <div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5' />
        <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-2xl' />

        <div className='card-body p-6 relative z-10'>
          <div className='flex items-center gap-4 mb-4'>
            {/* Enhanced Avatar with animations */}
            <motion.div className='avatar placeholder relative'>
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className='bg-gradient-to-br from-primary via-accent to-secondary 
                         text-primary-content rounded-full w-16 h-16 
                         flex items-center justify-center border-4 border-primary/30 
                         shadow-lg relative overflow-hidden'
              >
                {/* Shimmer effect */}
                <div
                  className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                              skew-x-12 animate-pulse'
                />
                <motion.span
                  className='text-2xl font-bold relative z-10'
                  style={{ color: aramRank.color }}
                >
                  {aramRank.displayName[0]}
                </motion.span>
              </motion.div>

              {/* Floating rank indicator */}
              <motion.div
                animate={{ y: [-2, 2, -2] }}
                transition={{ duration: 2, repeat: Infinity }}
                className='absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full 
                         flex items-center justify-center border-2 border-base-100 shadow-lg'
              >
                <Zap size={12} className='text-accent-content' />
              </motion.div>
            </motion.div>

            {/* Rank Info */}
            <div className='flex flex-col'>
              <motion.div className='flex items-center gap-2 mb-1'>
                <motion.span
                  className='text-xl font-bold'
                  style={{ color: aramRank.color }}
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {aramRank.displayName}
                </motion.span>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Award size={18} className='text-warning' />
                </motion.div>
              </motion.div>

              <div className='flex items-center gap-2'>
                <span className='text-sm text-base-content/60'>
                  ARAM Score:
                </span>
                <motion.span className='badge badge-primary badge-lg font-bold gap-1'>
                  <Star size={12} />
                  {aramScore}
                </motion.span>
              </div>

              {/* Progress indicator */}
              <div className='mt-2'>
                <div className='text-xs text-base-content/50 mb-1'>
                  Rank Progress
                </div>
                <motion.div className='w-full bg-base-300 rounded-full h-2 overflow-hidden'>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(
                        100,
                        Math.round(
                          ((aramScore - aramRank.min) /
                            (aramRank.max - aramRank.min)) *
                            100
                        )
                      )}%`,
                    }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className='h-full bg-gradient-to-r from-primary to-accent rounded-full'
                  />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Enhanced Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className='divider text-sm text-base-content/50 font-semibold'
          >
            <div className='flex items-center gap-2'>
              <Trophy size={16} className='text-primary' />
              League Rankings
              <Trophy size={16} className='text-primary' />
            </div>
          </motion.div>

          {/* Leagues Container */}
          <AnimatePresence>
            <motion.div
              className='flex flex-col gap-3 w-full'
              variants={containerVariants}
            >
              {rankedLeagues}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default withPerformanceTracking(RankBadge, 'RankBadge');

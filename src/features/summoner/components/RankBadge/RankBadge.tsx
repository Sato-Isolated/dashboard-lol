'use client';
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Medal, Zap, Award, Trophy } from 'lucide-react';
import { containerVariants, cardVariants, rankItemVariants } from './constants';
import { useAramRank, useRankedLeagues } from './hooks';
import { RankItem } from './components';
import type { RankBadgeProps } from './types';

const RankBadge: React.FC<RankBadgeProps> = ({ aramScore, leagues }) => {
  const aramRank = useAramRank(aramScore);
  const rankedLeagues = useRankedLeagues(leagues);

  const renderLeagues = () => {
    if (rankedLeagues.length === 0) {
      return (
        <motion.div
          variants={rankItemVariants}
          className='card bg-gradient-to-br from-base-200/50 to-base-300/50 
                     shadow-lg border border-base-content/10'
        >
          <div className='card-body p-6 text-center'>
            <span className='badge badge-outline badge-lg text-base-content/50 gap-2'>
              <Medal size={16} />
              Unranked
            </span>
          </div>
        </motion.div>
      );
    }

    return rankedLeagues.map((rank, i) => (
      <RankItem key={`${rank.queueType}-${i}`} rank={rank} />
    ));
  };

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
                  Score Progress
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
                            100,
                        ),
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
              {renderLeagues()}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RankBadge;

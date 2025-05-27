'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Users,
  Target,
  TrendingUp,
  Crown,
  Medal,
  Award,
} from 'lucide-react';
import { LeaderboardTable } from './LeaderboardTable';
import { withPerformanceTracking } from '@/shared/components/performance/SimplePerformanceWrapper';

export interface LeaderboardEntry {
  name: string;
  aramScore: number;
  profileIconId: number;
  tagline: string;
}

interface Platform {
  label: string;
  value: string;
  flag: string;
  fullName: string;
}

interface LeaderboardClientProps {
  initialLeaderboard: LeaderboardEntry[];
  initialPlatform: string;
  platforms: Platform[];
}

const LeaderboardClientComponent: React.FC<LeaderboardClientProps> = ({
  initialLeaderboard,
  initialPlatform,
  platforms,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState(initialPlatform);
  const [leaderboard] = useState(initialLeaderboard);

  const selectedPlatformData = platforms.find(
    p => p.value === selectedPlatform
  );

  // Statistiques calculées
  const stats = useMemo(() => {
    if (leaderboard.length === 0) return null;

    const topScore = leaderboard[0]?.aramScore || 0;
    const averageScore = Math.round(
      leaderboard.reduce((sum, entry) => sum + entry.aramScore, 0) /
        leaderboard.length
    );
    const totalPlayers = leaderboard.length;

    return {
      topScore,
      averageScore,
      totalPlayers,
      competitiveThreshold: Math.round(averageScore * 1.2),
    };
  }, [leaderboard]);

  const handlePlatformChange = (newPlatform: string) => {
    setSelectedPlatform(newPlatform);
    // Redirection vers la nouvelle plateforme
    const url = new URL(window.location.href);
    url.searchParams.set('platform', newPlatform);
    window.location.href = url.toString();
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300'>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className='hero min-h-[40vh] relative overflow-hidden'
      >
        {/* Background Effects */}
        <div className='absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10'></div>
        <div className='absolute top-10 left-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-pulse'></div>
        <div className='absolute bottom-10 right-10 w-40 h-40 bg-secondary/20 rounded-full blur-2xl animate-pulse delay-1000'></div>

        <div className='hero-content text-center relative z-10'>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className='max-w-4xl'
          >
            <motion.h1
              className='text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4'
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              ARAM Leaderboard
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className='text-xl text-base-content/80 mb-6'
            >
              Compete with the best ARAM players in{' '}
              <span className='font-bold text-primary'>
                {selectedPlatformData?.fullName || 'your region'}
              </span>
            </motion.p>

            {/* Platform Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className='flex justify-center'
            >
              <div className='form-control w-full max-w-xs'>
                <label className='label'>
                  <span className='label-text font-bold'>Select Region</span>
                </label>
                <select
                  className='select select-bordered select-lg bg-base-100/80 backdrop-blur-sm'
                  value={selectedPlatform}
                  onChange={e => handlePlatformChange(e.target.value)}
                >
                  {platforms.map(platform => (
                    <option key={platform.value} value={platform.value}>
                      {platform.flag} {platform.label} - {platform.fullName}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Section */}
      {stats && (
        <div className='container mx-auto px-4 py-8'>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className='card bg-gradient-to-r from-warning/20 to-yellow-500/20 shadow-xl transition-all duration-300'
            >
              <div className='card-body items-center text-center'>
                <Crown className='w-8 h-8 text-warning mb-2' />
                <h3 className='text-3xl font-bold text-warning'>
                  {stats.topScore.toLocaleString()}
                </h3>
                <p className='text-base-content/70 font-medium'>
                  Highest Score
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='card bg-gradient-to-r from-primary/20 to-blue-500/20 shadow-xl transition-all duration-300'
            >
              <div className='card-body items-center text-center'>
                <TrendingUp className='w-8 h-8 text-primary mb-2' />
                <h3 className='text-3xl font-bold text-primary'>
                  {stats.averageScore.toLocaleString()}
                </h3>
                <p className='text-base-content/70 font-medium'>
                  Average Score
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className='card bg-gradient-to-r from-secondary/20 to-purple-500/20 shadow-xl transition-all duration-300'
            >
              <div className='card-body items-center text-center'>
                <Users className='w-8 h-8 text-secondary mb-2' />
                <h3 className='text-3xl font-bold text-secondary'>
                  {stats.totalPlayers.toLocaleString()}
                </h3>
                <p className='text-base-content/70 font-medium'>
                  Ranked Players
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className='card bg-gradient-to-r from-accent/20 to-green-500/20 shadow-xl transition-all duration-300'
            >
              <div className='card-body items-center text-center'>
                <Target className='w-8 h-8 text-accent mb-2' />
                <h3 className='text-3xl font-bold text-accent'>
                  {stats.competitiveThreshold.toLocaleString()}
                </h3>
                <p className='text-base-content/70 font-medium'>
                  Competitive Threshold
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}

      {/* Top 3 Podium */}
      {leaderboard.length >= 3 && (
        <div className='container mx-auto px-4 py-8'>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className='text-center mb-8'
          >
            <h2 className='text-3xl font-bold text-base-content mb-2'>
              Champions
            </h2>
            <p className='text-lg text-base-content/70'>The elite of ARAM</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='flex justify-center items-end gap-4 mb-12'
          >
            {/* 2nd Place */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='flex flex-col items-center'
            >
              <div className='card bg-gradient-to-r from-slate-400/20 to-slate-600/20 shadow-xl w-48 h-32 flex items-center justify-center mb-4'>
                <div className='text-center'>
                  <Medal className='w-8 h-8 text-slate-400 mx-auto mb-2' />
                  <h3 className='font-bold text-lg'>{leaderboard[1].name}</h3>
                  <p className='text-sm text-base-content/70'>
                    {leaderboard[1].aramScore.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className='badge badge-lg bg-slate-400 text-white'>2nd</div>
            </motion.div>

            {/* 1st Place */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className='flex flex-col items-center'
            >
              <div className='card bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 shadow-xl w-56 h-40 flex items-center justify-center mb-4'>
                <div className='text-center'>
                  <Crown className='w-10 h-10 text-yellow-500 mx-auto mb-2' />
                  <h3 className='font-bold text-xl'>{leaderboard[0].name}</h3>
                  <p className='text-base text-base-content/70'>
                    {leaderboard[0].aramScore.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className='badge badge-lg bg-yellow-500 text-white'>1st</div>
            </motion.div>

            {/* 3rd Place */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className='flex flex-col items-center'
            >
              <div className='card bg-gradient-to-r from-amber-600/20 to-amber-800/20 shadow-xl w-48 h-32 flex items-center justify-center mb-4'>
                <div className='text-center'>
                  <Award className='w-8 h-8 text-amber-600 mx-auto mb-2' />
                  <h3 className='font-bold text-lg'>{leaderboard[2].name}</h3>
                  <p className='text-sm text-base-content/70'>
                    {leaderboard[2].aramScore.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className='badge badge-lg bg-amber-600 text-white'>3rd</div>
            </motion.div>
          </motion.div>
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className='container mx-auto px-4 py-8'>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className='card bg-base-100 shadow-xl'
        >
          <div className='card-body'>
            <h2 className='card-title text-2xl mb-4'>
              <Trophy className='w-6 h-6' />
              Full Rankings
            </h2>
            <LeaderboardTable
              leaderboard={leaderboard}
              platform={selectedPlatform}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export const LeaderboardClient = withPerformanceTracking(
  React.memo(LeaderboardClientComponent),
  'LeaderboardClient'
);

LeaderboardClient.displayName = 'LeaderboardClient';

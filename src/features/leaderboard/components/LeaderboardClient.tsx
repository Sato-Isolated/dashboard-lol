'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
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

  // Calculated statistics
  const stats = useMemo(() => {
    if (leaderboard.length === 0) {
      return null;
    }

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
      scoreThreshold: Math.round(averageScore * 1.2),
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
              className='text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-3 sm:mb-4'
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
              className='text-lg sm:text-xl text-base-content/80 mb-4 sm:mb-6 px-4 sm:px-0'
            >
              Explore top ARAM scores in
              <span className='pl-1 font-bold text-primary'>
                {selectedPlatformData?.fullName || 'your region'}
              </span>
            </motion.p>

            {/* Platform Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className='flex justify-center px-4 sm:px-0'
            >
              <div className='form-control w-full max-w-xs'>
                <label className='label'>
                  <span className='label-text font-bold text-sm sm:text-base'>
                    Select Region
                  </span>
                </label>
                <select
                  className='select select-bordered select-md sm:select-lg bg-base-100/80 backdrop-blur-sm text-sm sm:text-base'
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
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8'>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8'
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className='card bg-gradient-to-r from-warning/20 to-yellow-500/20 shadow-xl transition-all duration-300'
            >
              <div className='card-body items-center text-center p-4 sm:p-6'>
                <Crown className='w-6 h-6 sm:w-8 sm:h-8 text-warning mb-2' />
                <h3 className='text-2xl sm:text-3xl font-bold text-warning'>
                  {stats.topScore.toLocaleString('en-US')}
                </h3>
                <p className='text-sm sm:text-base text-base-content/70 font-medium'>
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
              <div className='card-body items-center text-center p-4 sm:p-6'>
                <TrendingUp className='w-6 h-6 sm:w-8 sm:h-8 text-primary mb-2' />
                <h3 className='text-2xl sm:text-3xl font-bold text-primary'>
                  {stats.averageScore.toLocaleString('en-US')}
                </h3>
                <p className='text-sm sm:text-base text-base-content/70 font-medium'>
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
              <div className='card-body items-center text-center p-4 sm:p-6'>
                <Users className='w-6 h-6 sm:w-8 sm:h-8 text-secondary mb-2' />
                <h3 className='text-2xl sm:text-3xl font-bold text-secondary'>
                  {stats.totalPlayers.toLocaleString('en-US')}
                </h3>
                <p className='text-sm sm:text-base text-base-content/70 font-medium'>
                  ARAM Players
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className='card bg-gradient-to-r from-accent/20 to-green-500/20 shadow-xl transition-all duration-300'
            >
              <div className='card-body items-center text-center p-4 sm:p-6'>
                {' '}
                <Target className='w-6 h-6 sm:w-8 sm:h-8 text-accent mb-2' />{' '}
                <h3 className='text-2xl sm:text-3xl font-bold text-accent'>
                  {stats.scoreThreshold.toLocaleString('en-US')}
                </h3>
                <p className='text-sm sm:text-base text-base-content/70 font-medium'>
                  Score Threshold
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
            className='text-center mb-6 sm:mb-8'
          >
            <h2 className='text-2xl sm:text-3xl font-bold text-base-content mb-2'>
              Champions
            </h2>
            <p className='text-base sm:text-lg text-base-content/70 px-4 sm:px-0'>
              Top ARAM Score in your region
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='flex flex-col sm:flex-row justify-center items-center sm:items-end gap-4 sm:gap-4 mb-8 sm:mb-12'
          >
            {/* 2nd Place */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='flex flex-col items-center order-2 sm:order-1'
            >
              <div className='card bg-gradient-to-r from-slate-400/20 to-slate-600/20 shadow-xl w-40 h-28 sm:w-48 sm:h-32 flex items-center justify-center mb-3 sm:mb-4'>
                <div className='text-center'>
                  <Medal className='w-6 h-6 sm:w-8 sm:h-8 text-slate-400 mx-auto mb-1 sm:mb-2' />
                  <h3 className='font-bold text-base sm:text-lg truncate px-2'>
                    {leaderboard[1].name}
                  </h3>
                  <p className='text-xs sm:text-sm text-base-content/70'>
                    {leaderboard[1].aramScore.toLocaleString('en-US')}
                  </p>
                </div>
              </div>
              <div className='badge badge-md sm:badge-lg bg-slate-400 text-white'>
                2nd
              </div>
            </motion.div>

            {/* 1st Place */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className='flex flex-col items-center order-1 sm:order-2'
            >
              <div className='card bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 shadow-xl w-48 h-36 sm:w-56 sm:h-40 flex items-center justify-center mb-3 sm:mb-4'>
                <div className='text-center'>
                  <Crown className='w-8 h-8 sm:w-10 sm:h-10 text-yellow-500 mx-auto mb-1 sm:mb-2' />
                  <h3 className='font-bold text-lg sm:text-xl truncate px-2'>
                    {leaderboard[0].name}
                  </h3>
                  <p className='text-sm sm:text-base text-base-content/70'>
                    {leaderboard[0].aramScore.toLocaleString('en-US')}
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
              className='flex flex-col items-center order-3'
            >
              <div className='card bg-gradient-to-r from-amber-600/20 to-amber-800/20 shadow-xl w-40 h-28 sm:w-48 sm:h-32 flex items-center justify-center mb-3 sm:mb-4'>
                <div className='text-center'>
                  <Award className='w-6 h-6 sm:w-8 sm:h-8 text-amber-600 mx-auto mb-1 sm:mb-2' />
                  <h3 className='font-bold text-base sm:text-lg truncate px-2'>
                    {leaderboard[2].name}
                  </h3>
                  <p className='text-xs sm:text-sm text-base-content/70'>
                    {leaderboard[2].aramScore.toLocaleString('en-US')}
                  </p>
                </div>
              </div>
              <div className='badge badge-md sm:badge-lg bg-amber-600 text-white'>
                3rd
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8'>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className='card bg-base-100 shadow-xl'
        >
          <div className='card-body p-4 sm:p-6'>
            <h2 className='card-title text-xl sm:text-2xl mb-3 sm:mb-4'>
              <Trophy className='w-5 h-5 sm:w-6 sm:h-6' />
              Full Rankings
            </h2>
            <div className='overflow-x-auto'>
              <LeaderboardTable
                leaderboard={leaderboard}
                platform={selectedPlatform}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export const LeaderboardClient = React.memo(LeaderboardClientComponent);

LeaderboardClient.displayName = 'LeaderboardClient';

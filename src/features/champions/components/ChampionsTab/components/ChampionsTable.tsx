import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, TrendingUp, Trophy, Target, Sword } from 'lucide-react';
import { ChampionStats, GlobalStats } from '../championsTabTypes';
import { ChampionRow } from './ChampionRow';
import { containerVariants } from '../utils/animations';

interface ChampionsTableProps {
  sortedStats: ChampionStats[];
  championDataLookup: Record<string, any>;
  getWinrate: (champ: ChampionStats) => number;
  handleSort: (key: string) => void;
  sortIcon: (key: string) => React.ReactNode;
  globalStats: GlobalStats;
  searchTerm: string;
}

export const ChampionsTable: React.FC<ChampionsTableProps> = ({
  sortedStats,
  championDataLookup,
  getWinrate,
  handleSort,
  sortIcon,
  globalStats,
  searchTerm,
}) => {
  return (
    <motion.div
      variants={containerVariants}
      initial='hidden'
      animate='visible'
      className='overflow-x-auto'
    >
      <motion.div
        transition={{ duration: 0.3 }}
        className='bg-base-100 rounded-2xl shadow-2xl border border-base-content/10 overflow-hidden'
      >
        <table className='table table-zebra w-full'>
          <thead className='bg-gradient-to-r from-primary/10 to-accent/10'>
            <tr>
              <motion.th
                className='cursor-pointer select-none transition-colors duration-200 font-bold text-base-content'
                onClick={() => handleSort('champion')}
              >
                <div className='flex items-center gap-2'>
                  <User size={16} />
                  Champion {sortIcon('champion')}
                </div>
              </motion.th>
              <motion.th
                className='cursor-pointer select-none transition-colors duration-200 font-bold text-base-content'
                onClick={() => handleSort('games')}
              >
                <div className='flex items-center gap-2 justify-center'>
                  <TrendingUp size={16} />
                  Games {sortIcon('games')}
                </div>
              </motion.th>
              <motion.th
                className='cursor-pointer select-none transition-colors duration-200 font-bold text-base-content'
                onClick={() => handleSort('wins')}
              >
                <div className='flex items-center gap-2 justify-center'>
                  <Trophy size={16} />
                  Wins {sortIcon('wins')}
                </div>
              </motion.th>
              <motion.th
                className='cursor-pointer select-none transition-colors duration-200 font-bold text-base-content'
                onClick={() => handleSort('winrate')}
              >
                <div className='flex items-center gap-2 justify-center'>
                  <TrendingUp size={16} />
                  Winrate {sortIcon('winrate')}
                </div>
              </motion.th>
              <motion.th
                className='cursor-pointer select-none transition-colors duration-200 font-bold text-base-content'
                onClick={() => handleSort('kda')}
              >
                <div className='flex items-center gap-2 justify-center'>
                  <Target size={16} />
                  KDA {sortIcon('kda')}
                </div>
              </motion.th>
              <th className='font-bold text-base-content text-center'>
                <div className='flex items-center gap-2 justify-center'>
                  <Sword size={16} />
                  K/D/A
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode='wait'>
              {sortedStats.map((champ, index) => {
                const champInfo = championDataLookup[champ.champion];
                return (
                  <ChampionRow
                    key={champ.champion}
                    champ={champ}
                    championInfo={champInfo}
                    getWinrate={getWinrate}
                    index={index}
                  />
                );
              })}
            </AnimatePresence>
          </tbody>
          <tfoot className='bg-gradient-to-r from-base-200 to-base-300'>
            <motion.tr
              className='font-bold text-base-content'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <td className='font-extrabold text-lg'>
                <div className='flex items-center gap-2'>
                  <Trophy size={20} className='text-primary' />
                  Total ({searchTerm ? 'Filtered' : 'All'})
                </div>
              </td>
              <td className='text-center font-bold text-lg'>
                {globalStats.totalGames}
              </td>
              <td className='text-center font-bold text-lg text-success'>
                {globalStats.totalWins}
              </td>
              <td className='text-center'>
                <span className='badge badge-success badge-lg font-bold px-4 py-2'>
                  {globalStats.globalWinrate.toFixed(1)}%
                </span>
              </td>
              <td className='text-center'>
                <span className='badge badge-info badge-lg font-bold px-4 py-2'>
                  {globalStats.globalKda.toFixed(2)}
                </span>
              </td>
              <td className='text-center font-bold'>
                <span className='text-success'>{globalStats.totalKills}</span>
                <span className='text-base-content/40 mx-1'>/</span>
                <span className='text-error'>{globalStats.totalDeaths}</span>
                <span className='text-base-content/40 mx-1'>/</span>
                <span className='text-info'>{globalStats.totalAssists}</span>
              </td>
            </motion.tr>
          </tfoot>
        </table>
      </motion.div>
    </motion.div>
  );
};

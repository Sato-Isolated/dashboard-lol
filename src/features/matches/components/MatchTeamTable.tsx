import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { UIPlayer } from '@/features/matches/types/ui-match.types';
import Image from 'next/image';
import Link from 'next/link';
import { getRegion } from '@/shared/lib/utils/helpers';
import { withPerformanceTracking } from '@/shared/components/performance/SimplePerformanceWrapper';

interface PlayerRowProps {
  player: UIPlayer;
}

const PlayerRowComponent: React.FC<PlayerRowProps> = ({ player }) => {
  const region = useMemo(() => getRegion(), []);

  const profileUrl = useMemo(
    () =>
      `/${region}/summoner/${encodeURIComponent(
        player.name
      )}/${encodeURIComponent(player.tagline || 'EUW')}`,
    [region, player.name, player.tagline]
  );
  const itemsDisplay = useMemo(
    () => (
      <div className='flex items-center gap-1.5 flex-wrap'>
        {player.items.map((item, idx) => (
          <motion.div
            key={`${item}-${idx}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05, type: 'spring', stiffness: 500 }}
            className='relative'
          >
            <div className='w-8 h-8 rounded-lg overflow-hidden shadow-md border border-base-content/20 bg-base-100'>
              <Image
                src={`/assets/item/${item}.png`}
                alt={`Item ${item}`}
                width={32}
                height={32}
                className='object-cover transition-transform duration-200'
              />
            </div>
          </motion.div>
        ))}
      </div>
    ),
    [player.items]
  );
  return (
    <motion.tr
      key={player.name}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className='border-b border-base-content/10 last:border-b-0 group cursor-pointer'
    >
      <td className='p-3 pl-4 font-semibold text-base-content min-w-[120px] max-w-[220px]'>
        <div className='flex items-center gap-3'>
          {/* Champion Avatar with hover effect */}{' '}
          <motion.div className='relative'>
            {' '}
            <div className='w-12 h-12 rounded-2xl overflow-hidden shadow-lg border-2 border-primary/30 bg-base-100'>
              <Image
                src={'/assets/champion/' + player.champion + '.png'}
                alt={player.champion}
                width={48}
                height={48}
                className='object-cover transition-transform duration-300'
              />
            </div>
          </motion.div>
          {/* Player Name with Link */}
          <div className='flex flex-col'>
            <Link
              href={profileUrl}
              className='text-primary transition-colors duration-200 max-w-[110px] font-bold text-sm truncate'
              onClick={e => e.stopPropagation()}
              prefetch={false}
              title={player.name}
            >
              {player.name}
            </Link>
            {player.mvp && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className='inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-warning to-warning/80 text-warning-content text-xs font-bold rounded-full shadow-lg mt-1 w-fit'
              >
                <span>👑</span> MVP
              </motion.span>
            )}
          </div>
        </div>
      </td>

      <td className='min-w-[70px] max-w-[120px]'>
        {' '}
        <motion.span className='inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-info/20 to-info/10 text-info border border-info/30 font-mono text-sm font-bold rounded-full shadow-sm'>
          {player.kda}
        </motion.span>
      </td>

      <td className='min-w-[40px] text-left'>
        <span className='font-mono text-base-content/80 font-semibold'>
          {player.cs}
        </span>
      </td>

      <td className='min-w-[60px] text-left'>
        {' '}
        <motion.span className='inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-error/20 to-error/10 text-error border border-error/30 font-mono text-sm font-bold rounded-full shadow-sm'>
          {player.damage}
        </motion.span>
      </td>

      <td className='min-w-[60px] text-left'>
        {' '}
        <motion.span className='inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-success/20 to-success/10 text-success border border-success/30 font-mono text-sm font-bold rounded-full shadow-sm'>
          {player.gold}
        </motion.span>
      </td>

      <td className='min-w-[120px] max-w-[220px]'>{itemsDisplay}</td>
    </motion.tr>
  );
};

const PlayerRow = React.memo(PlayerRowComponent);
PlayerRow.displayName = 'PlayerRow';

const TeamTableComponent: React.FC<{
  players: UIPlayer[];
  team: string;
  teamColor: string;
  teamStats?: { kills: number; gold: number };
}> = ({ players, team, teamColor, teamStats }) => {
  const isRedTeam = teamColor === 'red';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br 
        ${
          isRedTeam
            ? 'from-error/10 via-base-100/95 to-error/5 border-error/30'
            : 'from-info/10 via-base-100/95 to-info/5 border-info/30'
        } 
        border-2 backdrop-blur-md mb-6 transition-all duration-500`}
    >
      {/* Animated Background Effects */}
      <div className='absolute inset-0 pointer-events-none overflow-hidden'>
        <motion.div
          className={`absolute -top-20 -left-20 w-60 h-60 rounded-full blur-3xl
            ${isRedTeam ? 'bg-error/20' : 'bg-info/20'}`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className={`absolute -bottom-20 -right-20 w-60 h-60 rounded-full blur-3xl
            ${isRedTeam ? 'bg-error/15' : 'bg-info/15'}`}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
      </div>

      {/* Team Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className={`relative z-10 px-6 py-4 font-bold flex items-center justify-between text-lg rounded-t-3xl
          ${
            isRedTeam
              ? 'bg-gradient-to-r from-error/20 to-error/10 text-error border-b-2 border-error/30'
              : 'bg-gradient-to-r from-info/20 to-info/10 text-info border-b-2 border-info/30'
          }`}
      >
        <div className='flex items-center gap-3'>
          <span className='text-2xl'>{isRedTeam ? '🔴' : '🔵'}</span>
          <span className='font-extrabold'>{team}</span>
        </div>

        {teamStats && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className='flex items-center gap-3'
          >
            {' '}
            <motion.span className='inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-primary/20 to-primary/10 text-primary border border-primary/30 font-bold text-sm rounded-full shadow-lg'>
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M7 11l5-5m0 0l5 5m-5-5v12'
                />
              </svg>
              {teamStats.kills} Kills
            </motion.span>{' '}
            <motion.span className='inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-warning/20 to-warning/10 text-warning border border-warning/30 font-bold text-sm rounded-full shadow-lg'>
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <circle cx='12' cy='2' r='3' />
                <path d='M12 21v-6m0 0l-3-3m3 3l3-3' />
              </svg>
              {teamStats.gold} Gold
            </motion.span>
          </motion.div>
        )}
      </motion.div>

      {/* Table Container */}
      <div className='relative z-10 overflow-x-auto'>
        <table className='table w-full min-w-[700px]'>
          <colgroup>
            <col style={{ width: '22%' }} />
            <col style={{ width: '13%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '25%' }} />
          </colgroup>

          <motion.thead
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <tr className='bg-base-200/50 backdrop-blur-sm'>
              <th className='p-3 pl-4 text-left text-base-content/70 font-bold'>
                <div className='flex items-center gap-2'>
                  <svg
                    className='w-4 h-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                    />
                  </svg>
                  Summoner
                </div>
              </th>
              <th className='text-left text-base-content/70 font-bold'>
                <div className='flex items-center gap-2'>
                  <svg
                    className='w-4 h-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                    />
                  </svg>
                  KDA
                </div>
              </th>
              <th className='text-left text-base-content/70 font-bold'>CS</th>
              <th className='text-left text-base-content/70 font-bold'>
                <div className='flex items-center gap-2'>
                  <svg
                    className='w-4 h-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M13 10V3L4 14h7v7l9-11h-7z'
                    />
                  </svg>
                  Damage
                </div>
              </th>
              <th className='text-left text-base-content/70 font-bold'>
                <div className='flex items-center gap-2'>
                  <svg
                    className='w-4 h-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <circle cx='12' cy='2' r='3' />
                    <path d='M12 21v-6m0 0l-3-3m3 3l3-3' />
                  </svg>
                  Gold
                </div>
              </th>
              <th className='text-left text-base-content/70 font-bold'>
                <div className='flex items-center gap-2'>
                  <svg
                    className='w-4 h-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
                    />
                  </svg>
                  Items
                </div>
              </th>
            </tr>
          </motion.thead>
          <tbody>
            {players.map((player, index) => (
              <PlayerRow key={player.name} player={player} />
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export const MatchTeamTable = withPerformanceTracking(
  React.memo(TeamTableComponent),
  'MatchTeamTable'
);
MatchTeamTable.displayName = 'MatchTeamTable';

export default MatchTeamTable;

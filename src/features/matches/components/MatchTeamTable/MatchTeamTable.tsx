import React from 'react';
import { motion } from 'motion/react';
import { UIPlayer } from '@/features/matches/types/uiMatchTypes';

import {
  PlayerRow,
  BackgroundEffects,
  TableHeader,
  TeamHeader,
} from './components';

import { TEAM_COLORS, COLUMN_STYLES, TeamColorType } from './constants';

export interface MatchTeamTableProps {
  players: UIPlayer[];
  team: string;
  teamColor: string;
  teamStats?: { kills: number; gold: number };
}

const TeamTableComponent: React.FC<MatchTeamTableProps> = ({
  players,
  team,
  teamColor,
  teamStats,
}) => {
  const isRedTeam = teamColor === 'red';
  const teamColorType = teamColor as TeamColorType;
  const colors = TEAM_COLORS[teamColorType];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl 
        bg-gradient-to-br ${colors.gradient} ${colors.border} 
        border-2 backdrop-blur-md mb-4 sm:mb-6 transition-all duration-500`}
    >
      <BackgroundEffects teamColor={teamColorType} />

      <TeamHeader
        team={team}
        isRedTeam={isRedTeam}
        teamStats={teamStats}
        teamColor={teamColorType}
      />

      <div className='relative z-10 overflow-x-auto'>
        <table className='table w-full min-w-[600px] sm:min-w-[700px]'>
          <colgroup>
            <col style={COLUMN_STYLES.summoner} />
            <col style={COLUMN_STYLES.kda} />
            <col style={COLUMN_STYLES.cs} />
            <col style={COLUMN_STYLES.damage} />
            <col style={COLUMN_STYLES.gold} />
            <col style={COLUMN_STYLES.items} />
          </colgroup>

          <TableHeader />

          <tbody>
            {players.map(player => (
              <PlayerRow key={player.name} player={player} />
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export const MatchTeamTable = React.memo(TeamTableComponent);

MatchTeamTable.displayName = 'MatchTeamTable';

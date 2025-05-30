import React from 'react';
import { motion } from 'motion/react';
import { UIPlayer } from '@/features/matches/types/uiMatchTypes';
import { PlayerName } from './PlayerName';
import { PlayerStats } from './PlayerStats';
import { PlayerItems } from './PlayerItems';

interface PlayerRowProps {
  player: UIPlayer;
}

const PlayerRowComponent: React.FC<PlayerRowProps> = ({ player }) => {
  return (
    <motion.tr
      key={player.name}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className='border-b border-base-content/10 last:border-b-0 group cursor-pointer'
    >
      <PlayerName player={player} />
      <PlayerStats player={player} />
      <PlayerItems items={player.items.map(String)} />
    </motion.tr>
  );
};

export const PlayerRow = React.memo(PlayerRowComponent);
PlayerRow.displayName = 'PlayerRow';

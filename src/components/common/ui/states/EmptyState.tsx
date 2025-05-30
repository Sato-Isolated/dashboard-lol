'use client';
import React from 'react';
import { motion } from 'motion/react';
import {
  Search,
  GamepadIcon,
  Users,
  AlertCircle,
  Database,
} from 'lucide-react';
import { getSizeConfig } from '@/lib/design/tokens';
import type { StateComponentProps } from '@/types/coreTypes';

interface EmptyStateProps extends StateComponentProps {
  /**
   * Type of empty state - determines icon and default message
   */
  type?:
    | 'default'
    | 'search'
    | 'matches'
    | 'champions'
    | 'users'
    | 'data'
    | 'custom';
  /**
   * Custom message to display
   */
  message?: string;
  /**
   * Title for the empty state
   */
  title?: string;
  /**
   * Optional action button
   */
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
  };
  /**
   * Custom icon (overrides type icon)
   */
  icon?: React.ReactNode;
  /**
   * Custom emoji (overrides icon)
   */
  emoji?: string;
}

const typeConfig = {
  default: {
    emoji: '📭',
    icon: Database,
    title: 'No Data',
    message: 'No data available at the moment',
  },
  search: {
    emoji: '🔍',
    icon: Search,
    title: 'No Results Found',
    message: 'Try adjusting your search terms',
  },
  matches: {
    emoji: '🎮',
    icon: GamepadIcon,
    title: 'No Matches',
    message: 'No matches found for this player',
  },
  champions: {
    emoji: '🏆',
    icon: Users,
    title: 'No Champions',
    message: 'No champion data available',
  },
  users: {
    emoji: '👤',
    icon: Users,
    title: 'No Users',
    message: 'No users found',
  },
  data: {
    emoji: '📊',
    icon: Database,
    title: 'No Data',
    message: 'No data to display',
  },
  custom: {
    emoji: '💭',
    icon: AlertCircle,
    title: 'Empty',
    message: 'Nothing to show here',
  },
};

/**
 * Shared empty state component with consistent styling and multiple variants
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'default',
  message,
  title,
  action,
  size = 'md',
  fullHeight = false,
  className = '',
  icon,
  emoji,
}) => {
  const config = typeConfig[type];
  const sizeConf = getSizeConfig('empty', size);

  const displayTitle = title || config.title;
  const displayMessage = message || config.message;
  const displayEmoji = emoji || config.emoji;
  const IconComponent = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        flex flex-col items-center justify-center space-y-4 text-center
        ${sizeConf.container}
        ${fullHeight ? 'min-h-[400px]' : ''}
        ${className}
      `}
    >
      {/* Icon/Emoji */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: type === 'search' ? [0, 5, -5, 0] : [0, 2, -2, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className='mb-2'
      >
        {icon ? (
          <div className={sizeConf.icon}>{icon}</div>
        ) : emoji || displayEmoji ? (
          <div className={sizeConf.emoji}>{emoji || displayEmoji}</div>
        ) : (
          <IconComponent className={`${sizeConf.icon} text-base-content/30`} />
        )}
      </motion.div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`font-semibold text-base-content ${sizeConf.title}`}
      >
        {displayTitle}
      </motion.h3>

      {/* Message */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`text-base-content/60 max-w-md ${sizeConf.message}`}
      >
        {displayMessage}
      </motion.p>

      {/* Action Button */}
      {action && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileTap={{ scale: 0.95 }}
          onClick={action.onClick}
          className={`
            btn ${
              action.variant === 'primary'
                ? 'btn-primary'
                : action.variant === 'secondary'
                  ? 'btn-secondary'
                  : 'btn-outline'
            } 
            ${sizeConf.button}
          `}
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
};

export default EmptyState;

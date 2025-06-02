'use client';
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collapsibleContentVariants, innerContentVariants } from '../constants';
import { CollapsibleContentProps } from '../matchCardTypes';
import MatchCardTabs from '../../MatchCardTabs';

const CollapsibleContent: React.FC<CollapsibleContentProps> = ({
  open,
  tab,
  setTab,
  match,
  redTeam,
  blueTeam,
}) => {
  return (
    <AnimatePresence mode='wait'>
      {open && (
        <motion.div
          {...collapsibleContentVariants}
          className='overflow-hidden z-10 border-t border-base-content/10'
        >
          <motion.div {...innerContentVariants} className='px-4 lg:px-6 py-6'>
            <MatchCardTabs
              tab={tab}
              setTab={setTab}
              match={match}
              redTeam={redTeam}
              blueTeam={blueTeam}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(CollapsibleContent);

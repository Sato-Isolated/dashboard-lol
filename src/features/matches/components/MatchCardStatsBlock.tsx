import React, { useMemo } from "react";
import { motion } from "framer-motion";

interface Badge {
  label: string;
  color: string;
  icon: string;
}

interface MatchCardStatsBlockProps {
  kdaParts: string[];
  kdaValue: string | number;
  pKill: string;
  specialBadges: Badge[];
}

const MatchCardStatsBlockComponent: React.FC<MatchCardStatsBlockProps> = ({
  kdaParts,
  kdaValue,
  pKill,
  specialBadges,
}) => {
  // Memoize KDA parts to avoid array access on every render
  const { kills, deaths, assists } = useMemo(
    () => ({
      kills: kdaParts[0],
      deaths: kdaParts[1],
      assists: kdaParts[2],
    }),
    [kdaParts]
  );
  // Memoize badges to prevent unnecessary re-renders when array reference changes
  const renderBadges = useMemo(
    () =>
      specialBadges.map((badge, index) => (
        <motion.span
          key={badge.label}
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            delay: 0.5 + index * 0.1,
            type: "spring",
            stiffness: 400,
            damping: 25,
          }}
          whileHover={{ scale: 1.05, y: -2 }}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-white font-bold 
                     shadow-lg bg-gradient-to-r ${badge.color} border border-white/20
                     text-xs hover:shadow-xl transition-all duration-300 cursor-default`}
        >
          <span className="text-sm">{badge.icon}</span>
          <span>{badge.label}</span>
        </motion.span>
      )),
    [specialBadges]
  );
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="flex flex-col items-center justify-center flex-1 px-4 min-w-[160px] 
                 bg-gradient-to-br from-base-200/30 to-base-100/20 rounded-2xl 
                 border border-base-content/10 backdrop-blur-sm shadow-inner
                 hover:border-primary/30 transition-all duration-300 py-4"
    >
      {/* KDA Display */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
        className="flex items-center gap-3 text-3xl font-extrabold tracking-tight mb-3"
      >
        {" "}
        <motion.span
          whileHover={{ scale: 1.1 }}
          className="text-success drop-shadow-lg font-mono cursor-default"
        >
          {kills}
        </motion.span>
        <span className="text-base-content/50 text-2xl">/</span>
        <motion.span
          whileHover={{ scale: 1.1 }}
          className="text-error drop-shadow-lg font-mono cursor-default"
        >
          {deaths}
        </motion.span>
        <span className="text-base-content/50 text-2xl">/</span>
        <motion.span
          whileHover={{ scale: 1.1 }}
          className="text-info drop-shadow-lg font-mono cursor-default"
        >
          {assists}
        </motion.span>
      </motion.div>

      {/* KDA Ratio */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full 
                   bg-gradient-to-r from-primary/20 to-accent/20 
                   border border-primary/30 text-primary font-bold text-sm
                   shadow-lg hover:shadow-primary/30 transition-all duration-300 mb-2"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M12 20l9-5-9-5-9 5 9 5z" />
          <path d="M12 10l9-5-9-5-9 5 9 5z" />
        </svg>
        <span>KDA: {kdaValue}</span>
      </motion.div>

      {/* P/Kill Percentage */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.05 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full 
                   bg-gradient-to-r from-secondary/20 to-accent/20 
                   border border-secondary/30 text-secondary font-bold text-sm
                   shadow-lg hover:shadow-secondary/30 transition-all duration-300 mb-3"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="8,12 12,16 16,12" />
        </svg>
        <span>P/Kill {pKill}%</span>
      </motion.div>

      {/* Special Badges */}
      <div className="flex gap-2 flex-wrap justify-center max-w-[140px]">
        {renderBadges}
      </div>
    </motion.div>
  );
};

// Memoize component to prevent unnecessary re-renders
const MatchCardStatsBlock = React.memo(MatchCardStatsBlockComponent);
MatchCardStatsBlock.displayName = "MatchCardStatsBlock";

export default MatchCardStatsBlock;

import type { TabConfig } from './matchCardTabsTypes';

// Tab configuration with icons and colors
export const TAB_CONFIGS: TabConfig[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: '📊',
    color: 'primary',
    description: 'Match details and team stats',
  },
  {
    id: 'team',
    label: 'Analysis',
    icon: '🔍',
    color: 'secondary',
    description: 'In-depth team analysis',
  },
  {
    id: 'build',
    label: 'Build',
    icon: '⚔️',
    color: 'accent',
    description: 'Items, runes and spells',
  },
];

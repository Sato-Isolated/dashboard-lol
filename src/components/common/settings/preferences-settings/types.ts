// Shared types for PreferencesSettings components

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export interface ExtendedPreferences {
  // Core preferences that match API
  theme?:
    | 'light'
    | 'dark'
    | 'cupcake'
    | 'bumblebee'
    | 'emerald'
    | 'corporate'
    | 'synthwave'
    | 'retro'
    | 'cyberpunk'
    | 'valentine'
    | 'halloween'
    | 'garden'
    | 'forest'
    | 'aqua'
    | 'lofi'
    | 'pastel'
    | 'fantasy'
    | 'wireframe'
    | 'black'
    | 'luxury'
    | 'dracula'
    | 'cmyk'
    | 'autumn'
    | 'business'
    | 'acid'
    | 'lemonade'
    | 'night'
    | 'coffee'
    | 'winter'
    | 'dim'
    | 'nord'
    | 'sunset'
    | 'caramellatte'
    | 'abyss'
    | 'system';
  notifications?: {
    email?: boolean;
    push?: boolean;
    marketing?: boolean;
  };
  dashboard?: {
    defaultView?: 'grid' | 'list';
    itemsPerPage?: number;
  };
  // Additional UI preferences
  defaultRegion: string;
  showRankBadges: boolean;
  autoRefresh: boolean;
  showMatchDetails: boolean;
  enableNotifications: boolean;
  compactMode: boolean;
  showTooltips: boolean;
  animationsEnabled: boolean;
}

export interface Message {
  type: 'success' | 'error';
  text: string;
}

export interface Region {
  value: string;
  label: string;
}

// Component Props
export interface AppearanceSettingsProps {
  preferences: ExtendedPreferences;
  onPreferenceChange: (key: string, value: boolean | string) => void;
  onThemeChange: (theme: string) => void;
  themes: string[];
  currentTheme: string;
  getThemeDisplayName: (themeName: string) => string;
}

export interface DashboardSettingsProps {
  preferences: ExtendedPreferences;
  onPreferenceChange: (key: string, value: boolean | string) => void;
  regions: Region[];
}

export interface NotificationSettingsProps {
  preferences: ExtendedPreferences;
  onPreferenceChange: (key: string, value: boolean | string) => void;
}

export interface MessageDisplayProps {
  message: Message | null;
}

export interface SaveButtonProps {
  onSave: () => void;
  isLoading: boolean;
}

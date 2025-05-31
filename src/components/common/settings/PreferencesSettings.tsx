'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Palette,
  Monitor,
  Bell,
  Globe,
  Save,
  BarChart3,
  Trophy,
} from 'lucide-react';
import { useTheme } from '@/stores/themeStore';

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface PreferencesSettingsProps {
  user: User;
}

export default function PreferencesSettings({
  user,
}: PreferencesSettingsProps) {
  const { theme, setTheme, themes } = useTheme();
  const [preferences, setPreferences] = useState({
    defaultRegion: 'EUW',
    showRankBadges: true,
    autoRefresh: true,
    showMatchDetails: true,
    enableNotifications: true,
    compactMode: false,
    showTooltips: true,
    animationsEnabled: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  const regions = [
    { value: 'EUW', label: 'Europe West' },
    { value: 'EUNE', label: 'Europe Nordic & East' },
    { value: 'NA', label: 'North America' },
    { value: 'KR', label: 'Korea' },
    { value: 'JP', label: 'Japan' },
    { value: 'BR', label: 'Brazil' },
    { value: 'LAN', label: 'Latin America North' },
    { value: 'LAS', label: 'Latin America South' },
    { value: 'OCE', label: 'Oceania' },
    { value: 'TR', label: 'Turkey' },
    { value: 'RU', label: 'Russia' },
  ];

  const handlePreferenceChange = (key: string, value: boolean | string) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleSavePreferences = async () => {
    setIsLoading(true);
    try {
      // Here you would call your API to save preferences
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setIsLoading(false);
    }
  };

  const getThemeDisplayName = (themeName: string) => {
    return (
      themeName.charAt(0).toUpperCase() +
      themeName.slice(1).replace(/([A-Z])/g, ' $1')
    );
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-3 mb-6'>
        <Palette className='w-6 h-6 text-primary' />
        <div>
          <h2 className='text-2xl font-bold text-base-content'>Preferences</h2>
          <p className='text-base-content/60'>
            Customize your dashboard experience
          </p>
        </div>
      </div>

      {/* Theme Settings */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className='bg-base-200/50 rounded-2xl p-6'
      >
        <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
          <Monitor className='w-5 h-5' />
          Appearance
        </h3>

        <div className='space-y-4'>
          <div className='form-control'>
            <label className='label'>
              <span className='label-text font-medium'>Theme</span>
            </label>
            <select
              value={theme}
              onChange={e => setTheme(e.target.value)}
              className='select select-bordered w-full max-w-xs'
            >
              {themes.map(themeName => (
                <option key={themeName} value={themeName}>
                  {getThemeDisplayName(themeName)}
                </option>
              ))}
            </select>
          </div>

          <div className='form-control'>
            <label className='cursor-pointer label justify-start gap-3'>
              <input
                type='checkbox'
                checked={preferences.compactMode}
                onChange={e =>
                  handlePreferenceChange('compactMode', e.target.checked)
                }
                className='checkbox checkbox-primary'
              />
              <div>
                <span className='label-text font-medium'>Compact Mode</span>
                <div className='text-xs text-base-content/60'>
                  Reduce spacing and element sizes
                </div>
              </div>
            </label>
          </div>

          <div className='form-control'>
            <label className='cursor-pointer label justify-start gap-3'>
              <input
                type='checkbox'
                checked={preferences.animationsEnabled}
                onChange={e =>
                  handlePreferenceChange('animationsEnabled', e.target.checked)
                }
                className='checkbox checkbox-primary'
              />
              <div>
                <span className='label-text font-medium'>Animations</span>
                <div className='text-xs text-base-content/60'>
                  Enable smooth transitions and animations
                </div>
              </div>
            </label>
          </div>
        </div>
      </motion.div>

      {/* Dashboard Settings */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className='bg-base-200/50 rounded-2xl p-6'
      >
        <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
          <BarChart3 className='w-5 h-5' />
          Dashboard Settings
        </h3>

        <div className='space-y-4'>
          <div className='form-control'>
            <label className='label'>
              <span className='label-text font-medium'>Default Region</span>
            </label>
            <select
              value={preferences.defaultRegion}
              onChange={e =>
                handlePreferenceChange('defaultRegion', e.target.value)
              }
              className='select select-bordered w-full max-w-xs'
            >
              {regions.map(region => (
                <option key={region.value} value={region.value}>
                  {region.label}
                </option>
              ))}
            </select>
          </div>

          <div className='form-control'>
            <label className='cursor-pointer label justify-start gap-3'>
              <input
                type='checkbox'
                checked={preferences.showRankBadges}
                onChange={e =>
                  handlePreferenceChange('showRankBadges', e.target.checked)
                }
                className='checkbox checkbox-primary'
              />
              <div>
                <span className='label-text font-medium'>Show Rank Badges</span>
                <div className='text-xs text-base-content/60'>
                  Display rank badges on player profiles
                </div>
              </div>
            </label>
          </div>

          <div className='form-control'>
            <label className='cursor-pointer label justify-start gap-3'>
              <input
                type='checkbox'
                checked={preferences.autoRefresh}
                onChange={e =>
                  handlePreferenceChange('autoRefresh', e.target.checked)
                }
                className='checkbox checkbox-primary'
              />
              <div>
                <span className='label-text font-medium'>Auto Refresh</span>
                <div className='text-xs text-base-content/60'>
                  Automatically refresh data every 30 seconds
                </div>
              </div>
            </label>
          </div>

          <div className='form-control'>
            <label className='cursor-pointer label justify-start gap-3'>
              <input
                type='checkbox'
                checked={preferences.showMatchDetails}
                onChange={e =>
                  handlePreferenceChange('showMatchDetails', e.target.checked)
                }
                className='checkbox checkbox-primary'
              />
              <div>
                <span className='label-text font-medium'>
                  Detailed Match View
                </span>
                <div className='text-xs text-base-content/60'>
                  Show expanded match information by default
                </div>
              </div>
            </label>
          </div>

          <div className='form-control'>
            <label className='cursor-pointer label justify-start gap-3'>
              <input
                type='checkbox'
                checked={preferences.showTooltips}
                onChange={e =>
                  handlePreferenceChange('showTooltips', e.target.checked)
                }
                className='checkbox checkbox-primary'
              />
              <div>
                <span className='label-text font-medium'>Show Tooltips</span>
                <div className='text-xs text-base-content/60'>
                  Display helpful tooltips on hover
                </div>
              </div>
            </label>
          </div>
        </div>
      </motion.div>

      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className='bg-base-200/50 rounded-2xl p-6'
      >
        <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
          <Bell className='w-5 h-5' />
          Notifications
        </h3>

        <div className='space-y-4'>
          <div className='form-control'>
            <label className='cursor-pointer label justify-start gap-3'>
              <input
                type='checkbox'
                checked={preferences.enableNotifications}
                onChange={e =>
                  handlePreferenceChange(
                    'enableNotifications',
                    e.target.checked
                  )
                }
                className='checkbox checkbox-primary'
              />
              <div>
                <span className='label-text font-medium'>
                  Enable Notifications
                </span>
                <div className='text-xs text-base-content/60'>
                  Receive notifications about updates and new features
                </div>
              </div>
            </label>
          </div>

          <div className='alert alert-info'>
            <Globe className='w-4 h-4' />
            <div className='text-sm'>
              <div className='font-medium'>Browser Notifications</div>
              <div className='text-xs opacity-70'>
                To receive push notifications, please enable them in your
                browser settings.
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className='flex justify-end'
      >
        <motion.button
          onClick={handleSavePreferences}
          disabled={isLoading}
          whileTap={{ scale: 0.98 }}
          className='btn btn-primary gap-2'
        >
          {isLoading ? (
            <span className='loading loading-spinner loading-sm'></span>
          ) : (
            <Save className='w-4 h-4' />
          )}
          {isLoading ? 'Saving...' : 'Save Preferences'}
        </motion.button>
      </motion.div>
    </div>
  );
}

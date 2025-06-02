'use client';

import { motion } from 'motion/react';
import { Monitor } from 'lucide-react';
import type { AppearanceSettingsProps } from './types';

/**
 * AppearanceSettings Component
 *
 * Handles theme selection, compact mode, and animation preferences.
 * Provides immediate visual feedback for theme changes with auto-save functionality.
 */
export default function AppearanceSettings({
  preferences,
  onPreferenceChange,
  onThemeChange,
  themes,
  currentTheme,
  getThemeDisplayName,
}: AppearanceSettingsProps) {
  return (
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
            value={currentTheme}
            onChange={e => onThemeChange(e.target.value)}
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
                onPreferenceChange('compactMode', e.target.checked)
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
                onPreferenceChange('animationsEnabled', e.target.checked)
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
  );
}

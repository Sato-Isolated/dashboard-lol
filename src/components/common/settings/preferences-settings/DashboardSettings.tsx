'use client';

import { motion } from 'motion/react';
import { BarChart3 } from 'lucide-react';
import type { DashboardSettingsProps } from './types';

/**
 * DashboardSettings Component
 *
 * Manages dashboard-specific preferences including region selection,
 * rank badges, auto refresh, match details, and tooltips.
 */
export default function DashboardSettings({
  preferences,
  onPreferenceChange,
  regions,
}: DashboardSettingsProps) {
  return (
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
            onChange={e => onPreferenceChange('defaultRegion', e.target.value)}
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
                onPreferenceChange('showRankBadges', e.target.checked)
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
                onPreferenceChange('autoRefresh', e.target.checked)
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
                onPreferenceChange('showMatchDetails', e.target.checked)
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
                onPreferenceChange('showTooltips', e.target.checked)
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
  );
}

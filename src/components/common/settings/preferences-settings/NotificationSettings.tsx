'use client';

import { motion } from 'motion/react';
import { Bell, Globe } from 'lucide-react';
import type { NotificationSettingsProps } from './types';

/**
 * NotificationSettings Component
 *
 * Manages notification preferences and displays browser notification information.
 * Provides guidance for enabling browser notifications.
 */
export default function NotificationSettings({
  preferences,
  onPreferenceChange,
}: NotificationSettingsProps) {
  return (
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
                onPreferenceChange('enableNotifications', e.target.checked)
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
              To receive push notifications, please enable them in your browser
              settings.
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Database,
  Download,
  Trash2,
  AlertTriangle,
  Shield,
  Clock,
  HardDrive,
} from 'lucide-react';

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface DataSettingsProps {
  user: User;
}

export default function DataSettings({ user }: DataSettingsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      // Here you would call your API to export user data
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate download
      const data = {
        user: user,
        exportDate: new Date().toISOString(),
        // Add other user data here
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dashboard-data-${user.id}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      return;
    }

    setIsDeletingAccount(true);
    try {
      // Here you would call your API to delete the account
      await new Promise(resolve => setTimeout(resolve, 2000));

      // After successful deletion, redirect to home
      window.location.href = '/';
    } catch (error) {
      console.error('Failed to delete account:', error);
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const dataStats = [
    { label: 'Account Created', value: 'March 2024', icon: Clock },
    { label: 'Stored Data', value: '2.3 MB', icon: HardDrive },
    { label: 'Favorites', value: '5 summoners', icon: Database },
    { label: 'Search History', value: '127 searches', icon: Database },
  ];

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-3 mb-6'>
        <Database className='w-6 h-6 text-primary' />
        <div>
          <h2 className='text-2xl font-bold text-base-content'>
            Data & Privacy
          </h2>
          <p className='text-base-content/60'>
            Manage your data and privacy settings
          </p>
        </div>
      </div>

      {/* Data Overview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className='bg-base-200/50 rounded-2xl p-6'
      >
        <h3 className='text-lg font-semibold mb-4'>Data Overview</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {dataStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className='flex items-center gap-3 p-4 bg-base-100 rounded-lg border border-base-300/50'
              >
                <div className='p-2 bg-primary/10 rounded-lg'>
                  <Icon className='w-4 h-4 text-primary' />
                </div>
                <div>
                  <div className='font-medium'>{stat.label}</div>
                  <div className='text-sm text-base-content/60'>
                    {stat.value}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Privacy Settings */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className='bg-base-200/50 rounded-2xl p-6'
      >
        <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
          <Shield className='w-5 h-5' />
          Privacy Settings
        </h3>

        <div className='space-y-4'>
          <div className='form-control'>
            <label className='cursor-pointer label justify-start gap-3'>
              <input
                type='checkbox'
                defaultChecked
                className='checkbox checkbox-primary'
              />
              <div>
                <span className='label-text font-medium'>
                  Profile Visibility
                </span>
                <div className='text-xs text-base-content/60'>
                  Allow your profile to be discoverable by other users
                </div>
              </div>
            </label>
          </div>

          <div className='form-control'>
            <label className='cursor-pointer label justify-start gap-3'>
              <input
                type='checkbox'
                defaultChecked
                className='checkbox checkbox-primary'
              />
              <div>
                <span className='label-text font-medium'>Match History</span>
                <div className='text-xs text-base-content/60'>
                  Share your match history with the community
                </div>
              </div>
            </label>
          </div>

          <div className='form-control'>
            <label className='cursor-pointer label justify-start gap-3'>
              <input type='checkbox' className='checkbox checkbox-primary' />
              <div>
                <span className='label-text font-medium'>Analytics</span>
                <div className='text-xs text-base-content/60'>
                  Help improve the platform by sharing anonymous usage data
                </div>
              </div>
            </label>
          </div>
        </div>
      </motion.div>

      {/* Data Export */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className='bg-base-200/50 rounded-2xl p-6'
      >
        <h3 className='text-lg font-semibold mb-4'>Export Your Data</h3>
        <p className='text-sm text-base-content/60 mb-4'>
          Download a copy of all your data including profile information,
          favorites, and preferences.
        </p>
        <motion.button
          onClick={handleExportData}
          disabled={isExporting}
          whileTap={{ scale: 0.98 }}
          className='btn btn-outline gap-2'
        >
          {isExporting ? (
            <span className='loading loading-spinner loading-sm'></span>
          ) : (
            <Download className='w-4 h-4' />
          )}
          {isExporting ? 'Preparing Export...' : 'Export Data'}
        </motion.button>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className='bg-error/5 border border-error/20 rounded-2xl p-6'
      >
        <h3 className='text-lg font-semibold mb-4 text-error flex items-center gap-2'>
          <AlertTriangle className='w-5 h-5' />
          Danger Zone
        </h3>

        <div className='space-y-4'>
          <div className='bg-base-100 rounded-lg p-4 border border-error/30'>
            <h4 className='font-medium mb-2'>Delete Account</h4>
            <p className='text-sm text-base-content/60 mb-4'>
              Permanently delete your account and all associated data. This
              action cannot be undone.
            </p>

            {!showDeleteConfirm ? (
              <motion.button
                onClick={() => setShowDeleteConfirm(true)}
                whileTap={{ scale: 0.98 }}
                className='btn btn-error btn-outline gap-2'
              >
                <Trash2 className='w-4 h-4' />
                Delete Account
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className='space-y-4'
              >
                <div className='alert alert-error'>
                  <AlertTriangle className='w-4 h-4' />
                  <span className='text-sm'>
                    This action will permanently delete your account. Type{' '}
                    <strong>DELETE</strong> to confirm.
                  </span>
                </div>

                <div className='form-control'>
                  <input
                    type='text'
                    value={deleteConfirmText}
                    onChange={e => setDeleteConfirmText(e.target.value)}
                    placeholder='Type DELETE to confirm'
                    className='input input-bordered input-error'
                  />
                </div>

                <div className='flex gap-2'>
                  <motion.button
                    onClick={handleDeleteAccount}
                    disabled={
                      deleteConfirmText !== 'DELETE' || isDeletingAccount
                    }
                    whileTap={{ scale: 0.98 }}
                    className='btn btn-error gap-2'
                  >
                    {isDeletingAccount ? (
                      <span className='loading loading-spinner loading-sm'></span>
                    ) : (
                      <Trash2 className='w-4 h-4' />
                    )}
                    {isDeletingAccount ? 'Deleting...' : 'Confirm Delete'}
                  </motion.button>

                  <motion.button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteConfirmText('');
                    }}
                    whileTap={{ scale: 0.98 }}
                    className='btn btn-ghost'
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

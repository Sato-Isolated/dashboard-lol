'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { settingsApi } from '@/lib/api/settings';
import { Message } from './types';

interface DangerZoneProps {
  onMessage: (message: Message | null) => void;
}

export default function DangerZone({ onMessage }: DangerZoneProps) {
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      onMessage({ type: 'error', text: 'Please type "DELETE" to confirm.' });
      return;
    }

    setIsDeletingAccount(true);
    onMessage(null);

    try {
      const response = await settingsApi.deleteAccount(true);

      if (response.success) {
        onMessage({
          type: 'success',
          text: 'Account deletion initiated. Redirecting...',
        });
        // After successful deletion, redirect to home
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        throw new Error(response.error || 'Failed to delete account');
      }
    } catch (error) {
      onMessage({
        type: 'error',
        text:
          error instanceof Error
            ? error.message
            : 'Failed to delete account. Please try again.',
      });
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
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
            Permanently delete your account and all associated data. This action
            cannot be undone.
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
                  This action will permanently delete your account. Type
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
                  disabled={deleteConfirmText !== 'DELETE' || isDeletingAccount}
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
  );
}

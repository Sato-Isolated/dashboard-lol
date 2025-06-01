'use client';

import { motion } from 'motion/react';
import {
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Shield,
} from 'lucide-react';
import type { ChangePasswordFormProps } from './types';

/**
 * ChangePasswordForm Component
 *
 * Handles password change functionality with validation, strength indicator,
 * and password visibility toggles. Includes real-time validation feedback.
 */
export default function ChangePasswordForm({
  passwordData,
  showPasswords,
  onPasswordChange,
  onTogglePasswordVisibility,
  onSubmit,
  isLoading,
  message,
  getPasswordStrength,
}: ChangePasswordFormProps) {
  const passwordStrength = getPasswordStrength(passwordData.newPassword);

  return (
    <motion.form
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className='bg-base-200/50 rounded-2xl p-6'
    >
      <h3 className='text-lg font-semibold mb-4'>Change Password</h3>

      <div className='space-y-4'>
        {/* Current Password */}
        <div className='form-control'>
          <label className='label'>
            <span className='label-text font-medium'>Current Password</span>
          </label>
          <div className='relative'>
            <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/40' />
            <input
              type={showPasswords.current ? 'text' : 'password'}
              name='currentPassword'
              value={passwordData.currentPassword}
              onChange={onPasswordChange}
              className='input input-bordered w-full pl-10 pr-12'
              placeholder='Enter current password'
            />
            <button
              type='button'
              onClick={() => onTogglePasswordVisibility('current')}
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/40 hover:text-base-content'
            >
              {showPasswords.current ? (
                <EyeOff className='w-4 h-4' />
              ) : (
                <Eye className='w-4 h-4' />
              )}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className='form-control'>
          <label className='label'>
            <span className='label-text font-medium'>New Password</span>
          </label>
          <div className='relative'>
            <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/40' />
            <input
              type={showPasswords.new ? 'text' : 'password'}
              name='newPassword'
              value={passwordData.newPassword}
              onChange={onPasswordChange}
              className='input input-bordered w-full pl-10 pr-12'
              placeholder='Enter new password'
            />
            <button
              type='button'
              onClick={() => onTogglePasswordVisibility('new')}
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/40 hover:text-base-content'
            >
              {showPasswords.new ? (
                <EyeOff className='w-4 h-4' />
              ) : (
                <Eye className='w-4 h-4' />
              )}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {passwordData.newPassword && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className='mt-2'
            >
              <div className='flex items-center gap-2 mb-1'>
                <div className='flex-1 bg-base-300 rounded-full h-2'>
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      passwordStrength.strength === 1
                        ? 'bg-error w-1/4'
                        : passwordStrength.strength === 2
                          ? 'bg-warning w-2/4'
                          : passwordStrength.strength === 3
                            ? 'bg-info w-3/4'
                            : passwordStrength.strength === 4
                              ? 'bg-success w-full'
                              : 'w-0'
                    }`}
                  />
                </div>
                <span
                  className={`text-xs font-medium ${passwordStrength.color}`}
                >
                  {passwordStrength.label}
                </span>
              </div>
              <p className='text-xs text-base-content/60'>
                Use at least 8 characters with a mix of letters, numbers, and
                symbols
              </p>
            </motion.div>
          )}
        </div>

        {/* Confirm Password */}
        <div className='form-control'>
          <label className='label'>
            <span className='label-text font-medium'>Confirm New Password</span>
          </label>
          <div className='relative'>
            <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/40' />
            <input
              type={showPasswords.confirm ? 'text' : 'password'}
              name='confirmPassword'
              value={passwordData.confirmPassword}
              onChange={onPasswordChange}
              className='input input-bordered w-full pl-10 pr-12'
              placeholder='Confirm new password'
            />
            <button
              type='button'
              onClick={() => onTogglePasswordVisibility('confirm')}
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/40 hover:text-base-content'
            >
              {showPasswords.confirm ? (
                <EyeOff className='w-4 h-4' />
              ) : (
                <Eye className='w-4 h-4' />
              )}
            </button>
          </div>

          {/* Password Match Indicator */}
          {passwordData.confirmPassword && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='mt-1'
            >
              {passwordData.newPassword === passwordData.confirmPassword ? (
                <div className='flex items-center gap-1 text-success text-xs'>
                  <CheckCircle className='w-3 h-3' />
                  Passwords match
                </div>
              ) : (
                <div className='flex items-center gap-1 text-error text-xs'>
                  <AlertCircle className='w-3 h-3' />
                  Passwords do not match
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`alert mt-4 ${
            message.type === 'success' ? 'alert-success' : 'alert-error'
          }`}
        >
          <AlertCircle className='w-4 h-4' />
          <span className='text-sm'>{message.text}</span>
        </motion.div>
      )}

      {/* Submit Button */}
      <div className='flex justify-end mt-6'>
        <motion.button
          type='submit'
          disabled={
            isLoading ||
            !passwordData.currentPassword ||
            !passwordData.newPassword ||
            passwordData.newPassword !== passwordData.confirmPassword
          }
          whileTap={{ scale: 0.98 }}
          className='btn btn-primary gap-2'
        >
          {isLoading ? (
            <span className='loading loading-spinner loading-sm'></span>
          ) : (
            <Shield className='w-4 h-4' />
          )}
          {isLoading ? 'Updating...' : 'Update Password'}
        </motion.button>
      </div>
    </motion.form>
  );
}

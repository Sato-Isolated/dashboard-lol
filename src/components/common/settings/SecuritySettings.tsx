'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface SecuritySettingsProps {
  user: User;
}

export default function SecuritySettings({ user }: SecuritySettingsProps) {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // Basic validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      setIsLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setMessage({
        type: 'error',
        text: 'Password must be at least 8 characters long.',
      });
      setIsLoading(false);
      return;
    }

    try {
      // Here you would call your API to update password
      await new Promise(resolve => setTimeout(resolve, 1000));

      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to update password. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: '', color: '' };
    if (password.length < 6)
      return { strength: 1, label: 'Weak', color: 'text-error' };
    if (password.length < 8)
      return { strength: 2, label: 'Fair', color: 'text-warning' };
    if (password.length < 12)
      return { strength: 3, label: 'Good', color: 'text-info' };
    return { strength: 4, label: 'Strong', color: 'text-success' };
  };

  const passwordStrength = getPasswordStrength(passwordData.newPassword);

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-3 mb-6'>
        <Shield className='w-6 h-6 text-primary' />
        <div>
          <h2 className='text-2xl font-bold text-base-content'>
            Security Settings
          </h2>
          <p className='text-base-content/60'>
            Manage your password and security preferences
          </p>
        </div>
      </div>

      {/* Change Password Section */}
      <motion.form
        onSubmit={handlePasswordSubmit}
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
                onChange={handlePasswordChange}
                className='input input-bordered w-full pl-10 pr-12'
                placeholder='Enter current password'
              />
              <button
                type='button'
                onClick={() => togglePasswordVisibility('current')}
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
                onChange={handlePasswordChange}
                className='input input-bordered w-full pl-10 pr-12'
                placeholder='Enter new password'
              />
              <button
                type='button'
                onClick={() => togglePasswordVisibility('new')}
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
              <span className='label-text font-medium'>
                Confirm New Password
              </span>
            </label>
            <div className='relative'>
              <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/40' />
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                name='confirmPassword'
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className='input input-bordered w-full pl-10 pr-12'
                placeholder='Confirm new password'
              />
              <button
                type='button'
                onClick={() => togglePasswordVisibility('confirm')}
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

      {/* Security Status */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className='bg-base-200/50 rounded-2xl p-6'
      >
        <h3 className='text-lg font-semibold mb-4'>Security Status</h3>
        <div className='space-y-3'>
          <div className='flex items-center justify-between p-3 bg-success/10 rounded-lg border border-success/20'>
            <div className='flex items-center gap-3'>
              <CheckCircle className='w-5 h-5 text-success' />
              <div>
                <div className='font-medium text-success'>Email Verified</div>
                <div className='text-xs text-success/70'>
                  Your email address is verified
                </div>
              </div>
            </div>
          </div>

          <div className='flex items-center justify-between p-3 bg-info/10 rounded-lg border border-info/20'>
            <div className='flex items-center gap-3'>
              <Shield className='w-5 h-5 text-info' />
              <div>
                <div className='font-medium text-info'>Strong Password</div>
                <div className='text-xs text-info/70'>
                  Your password meets security requirements
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

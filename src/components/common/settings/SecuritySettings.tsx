'use client';

import { useState } from 'react';
import { Shield } from 'lucide-react';
import { settingsApi } from '@/lib/api/settings';
import {
  ChangePasswordForm,
  SecurityStatus,
  type User,
  type PasswordData,
  type ShowPasswords,
  type Message,
  type PasswordStrength,
} from './security-settings';

interface SecuritySettingsProps {
  user: User;
}

export default function SecuritySettings({ user }: SecuritySettingsProps) {
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState<ShowPasswords>({
    current: false,
    new: false,
    confirm: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field: keyof ShowPasswords) => {
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
      const response = await settingsApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.success) {
        setMessage({ type: 'success', text: 'Password updated successfully!' });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        throw new Error(response.error || 'Failed to update password');
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text:
          error instanceof Error
            ? error.message
            : 'Failed to update password. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password: string): PasswordStrength => {
    if (password.length === 0) return { strength: 0, label: '', color: '' };
    if (password.length < 6)
      return { strength: 1, label: 'Weak', color: 'text-error' };
    if (password.length < 8)
      return { strength: 2, label: 'Fair', color: 'text-warning' };
    if (password.length < 12)
      return { strength: 3, label: 'Good', color: 'text-info' };
    return { strength: 4, label: 'Strong', color: 'text-success' };
  };

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

      <ChangePasswordForm
        passwordData={passwordData}
        showPasswords={showPasswords}
        onPasswordChange={handlePasswordChange}
        onTogglePasswordVisibility={togglePasswordVisibility}
        onSubmit={handlePasswordSubmit}
        isLoading={isLoading}
        message={message}
        getPasswordStrength={getPasswordStrength}
      />

      <SecurityStatus />
    </div>
  );
}

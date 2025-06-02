'use client';

import { useState } from 'react';
import { Shield } from 'lucide-react';
import { settingsApi } from '@/lib/api/settings';
import { useSecurityStatus } from '@/hooks/useSecurityStatus';
import { getPasswordStrength } from '@/lib/utils/passwordStrength';
import { generateStrongPassword } from '@/lib/utils/passwordGenerator';
import {
  ChangePasswordForm,
  SecurityStatus,
  type User,
  type PasswordData,
  type ShowPasswords,
  type Message,
  type EmailVerificationStatus,
  type PasswordSecurityStatus,
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
  const [showGeneratedPassword, setShowGeneratedPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  // Fetch real security status from API
  const {
    data: securityData,
    isLoading: isLoadingStatus,
    error: statusError,
  } = useSecurityStatus();

  const generateRandomPassword = () => {
    const newPassword = generateStrongPassword();
    setPasswordData(prev => ({
      ...prev,
      newPassword,
      confirmPassword: newPassword, // Auto-fill confirm password
    }));
    setShowGeneratedPassword(true);

    // Hide the generated password flag after 10 seconds
    setTimeout(() => {
      setShowGeneratedPassword(false);
    }, 10000);
  };

  const copyPasswordToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(passwordData.newPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy password:', err);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));

    // Reset generated password flag when user manually types
    if (name === 'newPassword' && showGeneratedPassword) {
      setShowGeneratedPassword(false);
    }
  };

  const togglePasswordVisibility = (field: keyof ShowPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    console.log(`Password change attempt for user: ${user.id} (${user.email})`);

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
        console.log(`Password updated successfully for user ${user.id}`);
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
      console.error(`Password change failed for user ${user.id}:`, error);
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
  // Create security status data - use real data from API or fallback to user object
  // If there's an error loading status, show degraded fallback data
  const emailStatus: EmailVerificationStatus =
    !statusError && (securityData as any)?.email
      ? (securityData as any).email
      : {
          isVerified: user.emailVerified || false, // Use Better Auth's emailVerified field
          email: user.email || undefined,
          lastVerifiedAt: user.emailVerified ? new Date() : undefined,
        };

  const passwordStatus: PasswordSecurityStatus =
    !statusError && (securityData as any)?.password
      ? (securityData as any).password
      : {
          hasPassword: true, // Assume user has a password since they're logged in
          strength: {
            strength: 0,
            label: statusError ? 'Unknown' : 'Set', // Show 'Unknown' if we can't load status
            color: statusError ? 'text-warning' : 'text-info',
          },
          lastUpdated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Mock: 30 days ago
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

      {/* Display security status error if any */}
      {statusError && (
        <div className='alert alert-error'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='stroke-current shrink-0 h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <span>
            Failed to load security status:
            {statusError.message || 'Unknown error'}
          </span>
        </div>
      )}

      <ChangePasswordForm
        passwordData={passwordData}
        showPasswords={showPasswords}
        onPasswordChange={handlePasswordChange}
        onTogglePasswordVisibility={togglePasswordVisibility}
        onSubmit={handlePasswordSubmit}
        isLoading={isLoading}
        message={message}
        getPasswordStrength={getPasswordStrength}
        onGeneratePassword={generateRandomPassword}
        showGeneratedPassword={showGeneratedPassword}
        onCopyPassword={copyPasswordToClipboard}
        copied={copied}
      />
      <SecurityStatus
        user={user}
        emailStatus={emailStatus}
        passwordStatus={passwordStatus}
        isLoading={isLoadingStatus} // Use TanStack Query loading state
      />
    </div>
  );
}

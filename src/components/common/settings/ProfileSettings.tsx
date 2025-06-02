'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  User,
  Mail,
  Save,
  AlertCircle,
  Shield,
  Hash,
  Crown,
  CheckCircle,
} from 'lucide-react';
import { settingsApi } from '@/lib/api/settings';
import { getSummonerIcon } from '@/lib/utils/helpers';

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface ProfileSettingsProps {
  user: User;
}

export default function ProfileSettings({ user }: ProfileSettingsProps) {
  const [formData, setFormData] = useState({
    name: user.name || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    try {
      const response = await settingsApi.updateProfile({
        name: formData.name || undefined,
      });

      if (response.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        throw new Error(response.error || 'Failed to update profile');
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text:
          error instanceof Error
            ? error.message
            : 'Failed to update profile. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className='min-h-screen bg-gradient-to-br from-base-100 via-base-200/30 to-base-300/20 p-4 lg:p-8'>
      <div className='max-w-4xl mx-auto space-y-8'>
        {/* Header Section with Enhanced Styling */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-center lg:text-left'
        >
          <div className='flex items-center justify-center lg:justify-start gap-4 mb-6'>
            <div className='p-3 bg-gradient-to-br from-primary to-primary-focus rounded-2xl shadow-lg'>
              <User className='w-8 h-8 text-primary-content' />
            </div>
            <div>
              <h1 className='text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
                Profile Settings
              </h1>
              <p className='text-lg text-base-content/70 mt-2'>
                Customize your League of Legends dashboard experience
              </p>
            </div>
          </div>
        </motion.div>
        {/* Profile Picture Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className='card bg-base-100 shadow-xl border border-base-300/20'
        >
          <div className='card-body'>
            <div className='flex items-center gap-2 mb-4'>
              <Crown className='w-5 h-5 text-warning' />
              <h3 className='card-title text-lg'>League of Legends Profile</h3>
            </div>
            <div className='flex items-center gap-6'>
              <div className='avatar'>
                <div className='w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2'>
                  <img
                    src={getSummonerIcon(1440)}
                    alt={user.name || 'Summoner'}
                    className='w-full h-full rounded-full object-cover'
                  />
                </div>
              </div>
              <div className='flex-1'>
                <div className='text-sm text-base-content/70 mb-2'>
                  Your profile uses the default League of Legends Summoner Icon
                </div>
                <div className='badge badge-primary badge-outline gap-2'>
                  <CheckCircle className='w-3 h-3' />
                  Default Avatar Active
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        {/* Personal Information Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='card bg-base-100 shadow-xl border border-base-300/20'
        >
          <div className='card-body'>
            <div className='flex items-center gap-2 mb-6'>
              <User className='w-5 h-5 text-primary' />
              <h3 className='card-title text-xl'>Personal Information</h3>
            </div>
            <div className='grid grid-cols-1 gap-6'>
              {/* Name Field */}
              <div className='form-control max-w-md'>
                <label className='label'>
                  <span className='label-text font-semibold text-base-content'>
                    Display Name
                  </span>
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none z-10'>
                    <User className='w-5 h-5 text-base-content/50' />
                  </div>
                  <input
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={handleInputChange}
                    className='input input-bordered input-lg w-full pl-12 pr-4 focus:input-primary transition-all duration-200 relative z-0'
                    placeholder='Enter your display name'
                  />
                </div>
              </div>

              {/* Email Field - Read Only */}
              <div className='form-control max-w-md'>
                <label className='label'>
                  <span className='label-text font-semibold text-base-content'>
                    Email Address
                  </span>
                  <span className='label-text-alt text-base-content/50'>
                    Read only
                  </span>
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none z-10'>
                    <Mail className='w-5 h-5 text-base-content/30' />
                  </div>
                  <input
                    type='email'
                    value={user.email || 'No email provided'}
                    readOnly
                    className='input input-bordered input-lg w-full pl-12 pr-4 bg-base-200/50 text-base-content/60 cursor-not-allowed'
                    placeholder='Email cannot be changed'
                  />
                </div>
                <label className='label'>
                  <span className='label-text-alt text-warning flex items-center gap-1'>
                    <AlertCircle className='w-3 h-3' />
                    Email cannot be modified for security reasons
                  </span>
                </label>
              </div>
            </div>
            {/* Message */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`alert mt-6 ${
                  message.type === 'success' ? 'alert-success' : 'alert-error'
                }`}
              >
                <AlertCircle className='w-5 h-5' />
                <span>{message.text}</span>
              </motion.div>
            )}
            {/* Submit Button */}
            <div className='card-actions justify-end mt-8'>
              <motion.button
                type='submit'
                disabled={isLoading}
                whileTap={{ scale: 0.98 }}
                whileHover={{ scale: 1.02 }}
                className='btn btn-primary btn-lg gap-3 min-w-[140px]'
              >
                {isLoading ? (
                  <span className='loading loading-spinner loading-md'></span>
                ) : (
                  <Save className='w-5 h-5' />
                )}
                {isLoading ? 'Saving...' : 'Save Changes'}
              </motion.button>
            </div>
          </div>
        </motion.form>
        {/* Account Information */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className='card bg-base-100 shadow-xl border border-base-300/20'
        >
          <div className='card-body'>
            <div className='flex items-center gap-2 mb-6'>
              <Shield className='w-5 h-5 text-info' />
              <h3 className='card-title text-xl'>Account Information</h3>
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              {/* User ID Card */}
              <div className='bg-base-200/50 rounded-xl p-4 border border-base-300/30'>
                <div className='flex items-center gap-3 mb-2'>
                  <Hash className='w-4 h-4 text-base-content/60' />
                  <span className='text-sm font-medium text-base-content/70'>
                    User ID
                  </span>
                </div>
                <p className='font-mono text-sm bg-base-300/50 px-3 py-2 rounded-lg break-all'>
                  {user.id}
                </p>
              </div>

              {/* Account Type Card */}
              <div className='bg-base-200/50 rounded-xl p-4 border border-base-300/30'>
                <div className='flex items-center gap-3 mb-2'>
                  <Crown className='w-4 h-4 text-warning' />
                  <span className='text-sm font-medium text-base-content/70'>
                    Account Type
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='badge badge-primary badge-lg gap-2'>
                    <CheckCircle className='w-3 h-3' />
                    Standard Account
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

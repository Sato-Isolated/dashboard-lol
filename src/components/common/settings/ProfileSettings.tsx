'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Save, Camera, AlertCircle } from 'lucide-react';

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
    email: user.email || '',
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
      // Here you would call your API to update user profile
      // For now, we'll simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to update profile. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-3 mb-6'>
        <User className='w-6 h-6 text-primary' />
        <div>
          <h2 className='text-2xl font-bold text-base-content'>
            Profile Settings
          </h2>
          <p className='text-base-content/60'>
            Manage your personal information
          </p>
        </div>
      </div>

      {/* Profile Picture Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className='bg-base-200/50 rounded-2xl p-6'
      >
        <h3 className='text-lg font-semibold mb-4'>Profile Picture</h3>
        <div className='flex items-center gap-6'>
          <div className='avatar'>
            <div className='w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center'>
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || 'User'}
                  className='w-20 h-20 rounded-full object-cover'
                />
              ) : (
                <User className='w-8 h-8 text-primary' />
              )}
            </div>
          </div>
          <div className='flex-1'>
            <p className='text-sm text-base-content/60 mb-3'>
              Upload a new profile picture. Maximum size: 2MB
            </p>
            <motion.button
              whileTap={{ scale: 0.98 }}
              className='btn btn-outline btn-sm gap-2'
            >
              <Camera className='w-4 h-4' />
              Change Picture
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Personal Information Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className='bg-base-200/50 rounded-2xl p-6'
      >
        <h3 className='text-lg font-semibold mb-4'>Personal Information</h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Name Field */}
          <div className='form-control'>
            <label className='label'>
              <span className='label-text font-medium'>Display Name</span>
            </label>
            <div className='relative'>
              <User className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/40' />
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleInputChange}
                className='input input-bordered w-full pl-10'
                placeholder='Enter your display name'
              />
            </div>
          </div>

          {/* Email Field */}
          <div className='form-control'>
            <label className='label'>
              <span className='label-text font-medium'>Email Address</span>
            </label>
            <div className='relative'>
              <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/40' />
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleInputChange}
                className='input input-bordered w-full pl-10'
                placeholder='Enter your email address'
              />
            </div>
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
            disabled={isLoading}
            whileTap={{ scale: 0.98 }}
            className='btn btn-primary gap-2'
          >
            {isLoading ? (
              <span className='loading loading-spinner loading-sm'></span>
            ) : (
              <Save className='w-4 h-4' />
            )}
            {isLoading ? 'Saving...' : 'Save Changes'}
          </motion.button>
        </div>
      </motion.form>

      {/* Account Information */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className='bg-base-200/50 rounded-2xl p-6'
      >
        <h3 className='text-lg font-semibold mb-4'>Account Information</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
          <div className='flex justify-between py-2 border-b border-base-300/50'>
            <span className='text-base-content/60'>User ID:</span>
            <span className='font-mono text-xs'>{user.id}</span>
          </div>
          <div className='flex justify-between py-2 border-b border-base-300/50'>
            <span className='text-base-content/60'>Account Type:</span>
            <span className='badge badge-primary badge-sm'>Standard</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { signIn } from '@/lib/auth/auth-client';
import { Mail, Lock, X } from 'lucide-react';
import Portal from '@/components/common/ui/Portal';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const handleEmailSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // The browser already handles email validation with type="email"
    // But we can add additional verification if necessary
    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message || 'Invalid email or password');
      } else {
        onClose();
      }
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };
  const handleGoogleSignIn = async () => {
    try {
      await signIn.social({
        provider: 'google',
        callbackURL: '/',
      });
    } catch (err) {
      setError('Google sign in failed');
    }
  };

  if (!isOpen) return null;

  return (
    <Portal>
      <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
        {/* Backdrop */}
        <motion.div
          className='fixed inset-0 bg-black/60 backdrop-blur-sm'
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className='relative bg-base-100 rounded-3xl p-8 w-full max-w-md shadow-2xl border border-base-300/50'
        >
          <div className='flex items-center justify-between mb-8'>
            <h2 className='text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
              Welcome Back
            </h2>
            <button
              onClick={onClose}
              className='btn btn-ghost btn-sm btn-circle hover:bg-base-200'
            >
              <X className='w-5 h-5' />
            </button>
          </div>
          {error && (
            <div className='alert alert-error mb-4'>
              <span>{error}</span>
            </div>
          )}
          <form onSubmit={handleEmailSignIn} className='space-y-6'>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text font-medium'>Email Address</span>
              </label>
              <div className='relative'>
                <input
                  type='email'
                  name='email'
                  placeholder='Enter your email'
                  className='input input-bordered validator w-full pl-12 h-12 text-base'
                  required
                  title='Please enter a valid email address'
                />
                <Mail className='w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50' />
              </div>
              <div className='validator-hint text-sm text-error mt-1 hidden'>
                Please enter a valid email address
              </div>
            </div>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text font-medium'>Password</span>
              </label>
              <div className='relative'>
                <input
                  type='password'
                  name='password'
                  placeholder='Enter your password'
                  className='input input-bordered validator w-full pl-12 h-12 text-base'
                  required
                  minLength={8}
                  title='Password must be at least 8 characters long'
                />
                <Lock className='w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50' />
              </div>
              <div className='validator-hint text-sm text-error mt-1 hidden'>
                Password must be at least 8 characters long
              </div>
            </div>
            <button
              type='submit'
              className={`btn btn-primary w-full h-12 text-base ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          <div className='divider my-8'>or continue with</div>
          <div className='space-y-4'>
            <button
              onClick={handleGoogleSignIn}
              className='btn btn-outline w-full h-12 text-base gap-3'
            >
              <svg className='w-5 h-5' viewBox='0 0 24 24'>
                <path
                  fill='currentColor'
                  d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                />
                <path
                  fill='currentColor'
                  d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                />
                <path
                  fill='currentColor'
                  d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                />
                <path
                  fill='currentColor'
                  d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                />
              </svg>
              Google
            </button>
          </div>
        </motion.div>
      </div>
    </Portal>
  );
}

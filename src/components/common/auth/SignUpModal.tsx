'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { signUp, signIn } from '@/lib/auth/auth-client';
import { Mail, Lock, User, X } from 'lucide-react';
import Portal from '@/components/common/ui/Portal';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignUpModal({ isOpen, onClose }: SignUpModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signUp.email({
        email,
        password,
        name,
      });

      if (result.error) {
        setError(
          result.error.message || 'Failed to create account. Please try again.'
        );
      } else {
        onClose();
      }
    } catch (err) {
      setError('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await signIn.social({
        provider: 'google',
        callbackURL: '/',
      });
    } catch (err) {
      setError('Google sign up failed');
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
              Join Dashboard
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
          <form onSubmit={handleEmailSignUp} className='space-y-4'>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Name</span>
              </label>
              <div className='relative'>
                <input
                  type='text'
                  placeholder='Enter your name'
                  className='input input-bordered w-full pl-10'
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
                <User className='w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50' />
              </div>
            </div>

            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Email</span>
              </label>
              <div className='relative'>
                <input
                  type='email'
                  placeholder='Enter your email'
                  className='input input-bordered w-full pl-10'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <Mail className='w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50' />
              </div>
            </div>

            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Password</span>
              </label>
              <div className='relative'>
                <input
                  type='password'
                  placeholder='Enter your password'
                  className='input input-bordered w-full pl-10'
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <Lock className='w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50' />
              </div>
              <label className='label'>
                <span className='label-text-alt'>
                  Must be at least 8 characters
                </span>
              </label>
            </div>

            <button
              type='submit'
              className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          <div className='divider'>or</div>
          <div className='space-y-3'>
            <button
              onClick={handleGoogleSignUp}
              className='btn btn-outline w-full'
            >
              <svg className='w-4 h-4' viewBox='0 0 24 24'>
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
              Continue with Google
            </button>{' '}
          </div>
        </motion.div>
      </div>
    </Portal>
  );
}

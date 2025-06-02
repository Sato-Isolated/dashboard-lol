'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { signUp, signIn } from '@/lib/auth/auth-client';
import {
  Mail,
  Lock,
  User,
  X,
  RefreshCw,
  Copy,
  Check,
  Eye,
  EyeOff,
} from 'lucide-react';
import { getPasswordStrength } from '@/lib/utils/passwordStrength';
import { generateStrongPassword } from '@/lib/utils/passwordGenerator';
import Portal from '@/components/common/ui/Portal';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignUpModal({ isOpen, onClose }: SignUpModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showGeneratedPassword, setShowGeneratedPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

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
        // After successful signup, store password strength
        try {
          await fetch('/api/auth/update-password-strength', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              password,
            }),
          });
        } catch (strengthError) {
          // Log error but don't fail the signup process
          console.warn('Failed to store password strength:', strengthError);
        }

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
  const generateRandomPassword = () => {
    const newPassword = generateStrongPassword();
    setGeneratedPassword(newPassword);
    setCurrentPassword(newPassword);
    setShowGeneratedPassword(true);

    // Set the password in the form input
    const passwordInput = document.querySelector(
      'input[name="password"]'
    ) as HTMLInputElement;
    if (passwordInput) {
      passwordInput.value = newPassword;
    }

    // Hide the generated password flag after 10 seconds
    setTimeout(() => {
      setShowGeneratedPassword(false);
    }, 10000);
  };

  const copyPasswordToClipboard = async () => {
    const passwordInput = document.querySelector(
      'input[name="password"]'
    ) as HTMLInputElement;
    const currentPasswordValue = passwordInput?.value || currentPassword;

    try {
      await navigator.clipboard.writeText(currentPasswordValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy password:', err);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
                  name='name'
                  placeholder='Enter your name'
                  className='input input-bordered validator w-full pl-10'
                  required
                  title='Please enter your full name'
                />
                <User className='w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50' />
              </div>
              <div className='validator-hint text-sm text-error mt-1 hidden'>
                Please enter your full name
              </div>
            </div>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Email</span>
              </label>
              <div className='relative'>
                <input
                  type='email'
                  name='email'
                  placeholder='Enter your email'
                  className='input input-bordered validator w-full pl-10'
                  required
                  title='Please enter a valid email address'
                />
                <Mail className='w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50' />
              </div>
              <div className='validator-hint text-sm text-error mt-1 hidden'>
                Please enter a valid email address
              </div>
            </div>
            <div className='form-control'>
              <div className='flex justify-between items-center mb-2'>
                <label className='label-text'>Password</label>
                <div className='flex gap-1 items-center'>
                  <button
                    type='button'
                    onClick={generateRandomPassword}
                    className='btn btn-ghost btn-xs hover:bg-base-300'
                    title='Generate strong password'
                  >
                    <RefreshCw className='w-3 h-3' />
                  </button>
                  {currentPassword && (
                    <>
                      <button
                        type='button'
                        onClick={copyPasswordToClipboard}
                        className='btn btn-ghost btn-xs hover:bg-base-300'
                        title={copied ? 'Copied!' : 'Copy password'}
                      >
                        {copied ? (
                          <Check className='w-3 h-3 text-success' />
                        ) : (
                          <Copy className='w-3 h-3' />
                        )}
                      </button>
                      <button
                        type='button'
                        onClick={togglePasswordVisibility}
                        className='btn btn-ghost btn-xs hover:bg-base-300'
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <EyeOff className='w-3 h-3' />
                        ) : (
                          <Eye className='w-3 h-3' />
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className='relative'>
                <input
                  type={
                    showPassword || showGeneratedPassword ? 'text' : 'password'
                  }
                  name='password'
                  placeholder='Enter your password'
                  className='input input-bordered validator w-full pl-10 pr-12'
                  onChange={e => {
                    setCurrentPassword(e.target.value);
                    setShowGeneratedPassword(false);
                  }}
                  required
                  minLength={8}
                  title='Password must be at least 8 characters long'
                />
                <Lock className='w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50' />
                {currentPassword && showGeneratedPassword && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2'
                  >
                    <div className='badge badge-success badge-xs'>
                      Generated
                    </div>
                  </motion.div>
                )}
              </div>
              <div className='validator-hint text-sm text-error mt-1 hidden'>
                Password must be at least 8 characters long
              </div>
              {/* Password Strength Indicator */}
              {currentPassword && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className='mt-2'
                >
                  <div className='flex items-center gap-2 mb-1'>
                    <div className='flex-1 bg-base-300 rounded-full h-2'>
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          getPasswordStrength(currentPassword).strength === 1
                            ? 'bg-error w-1/4'
                            : getPasswordStrength(currentPassword).strength ===
                                2
                              ? 'bg-warning w-2/4'
                              : getPasswordStrength(currentPassword)
                                    .strength === 3
                                ? 'bg-info w-3/4'
                                : getPasswordStrength(currentPassword)
                                      .strength === 4
                                  ? 'bg-success w-full'
                                  : 'w-0'
                        }`}
                      />
                    </div>
                    <span
                      className={`text-xs font-medium ${getPasswordStrength(currentPassword).color}`}
                    >
                      {getPasswordStrength(currentPassword).label}
                    </span>
                  </div>
                </motion.div>
              )}
              <label className='label'>
                <span className='label-text-alt'>
                  Must be at least 8 characters
                </span>
                <span
                  className='label-text-alt text-primary cursor-pointer hover:underline'
                  onClick={generateRandomPassword}
                >
                  Generate strong password
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
            </button>
          </div>
        </motion.div>
      </div>
    </Portal>
  );
}

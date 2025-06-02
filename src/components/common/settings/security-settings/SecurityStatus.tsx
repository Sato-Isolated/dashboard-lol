'use client';

import { motion } from 'motion/react';
import {
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Lock,
  Loader2,
} from 'lucide-react';
import type { SecurityStatusProps } from './types';

/**
 * SecurityStatus Component
 *
 * Displays the current security status including email verification
 * and password strength indicators with visual feedback.
 */
export default function SecurityStatus({
  user,
  emailStatus,
  passwordStatus,
  isLoading = false,
}: SecurityStatusProps) {
  const getEmailStatusDisplay = () => {
    if (emailStatus.isVerified) {
      return {
        icon: CheckCircle,
        title: 'Email Verified',
        description: `${emailStatus.email || user?.email || 'Your email'} is verified`,
        bgColor: 'bg-success/10',
        borderColor: 'border-success/20',
        iconColor: 'text-success',
        titleColor: 'text-success',
        descColor: 'text-success/70',
      };
    } else {
      return {
        icon: XCircle,
        title: 'Email Not Verified',
        description: 'Please verify your email address',
        bgColor: 'bg-error/10',
        borderColor: 'border-error/20',
        iconColor: 'text-error',
        titleColor: 'text-error',
        descColor: 'text-error/70',
      };
    }
  };
  const getPasswordStatusDisplay = () => {
    if (!passwordStatus.hasPassword) {
      return {
        icon: AlertTriangle,
        title: 'No Password Set',
        description: 'Set up a password for better security',
        bgColor: 'bg-warning/10',
        borderColor: 'border-warning/20',
        iconColor: 'text-warning',
        titleColor: 'text-warning',
        descColor: 'text-warning/70',
      };
    }

    const strength = passwordStatus.strength;
    if (!strength) {
      return {
        icon: Lock,
        title: 'Password Set',
        description: 'Your account has a password',
        bgColor: 'bg-info/10',
        borderColor: 'border-info/20',
        iconColor: 'text-info',
        titleColor: 'text-info',
        descColor: 'text-info/70',
      };
    }

    // Use the strength values from our API (1-4 scale)
    if (strength.strength >= 4) {
      return {
        icon: Shield,
        title: 'Strong Password',
        description: 'Your password meets security requirements',
        bgColor: 'bg-success/10',
        borderColor: 'border-success/20',
        iconColor: 'text-success',
        titleColor: 'text-success',
        descColor: 'text-success/70',
      };
    }

    if (strength.strength >= 3) {
      return {
        icon: Shield,
        title: 'Good Password',
        description: 'Your password is reasonably secure',
        bgColor: 'bg-info/10',
        borderColor: 'border-info/20',
        iconColor: 'text-info',
        titleColor: 'text-info',
        descColor: 'text-info/70',
      };
    }

    if (strength.strength >= 2) {
      return {
        icon: AlertTriangle,
        title: 'Fair Password',
        description: 'Consider strengthening your password',
        bgColor: 'bg-warning/10',
        borderColor: 'border-warning/20',
        iconColor: 'text-warning',
        titleColor: 'text-warning',
        descColor: 'text-warning/70',
      };
    }

    // Weak password (strength = 1)
    return {
      icon: XCircle,
      title: 'Weak Password',
      description: 'Your password should be stronger',
      bgColor: 'bg-error/10',
      borderColor: 'border-error/20',
      iconColor: 'text-error',
      titleColor: 'text-error',
      descColor: 'text-error/70',
    };
  };

  const emailDisplay = getEmailStatusDisplay();
  const passwordDisplay = getPasswordStatusDisplay();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className='bg-base-200/50 rounded-2xl p-6'
    >
      <h3 className='text-lg font-semibold mb-4'>Security Status</h3>

      {isLoading ? (
        <div className='flex items-center justify-center p-8'>
          <Loader2 className='w-6 h-6 animate-spin' />
          <span className='ml-2'>Loading security status...</span>
        </div>
      ) : (
        <div className='space-y-3'>
          {/* Email Status */}
          <div
            className={`flex items-center justify-between p-3 ${emailDisplay.bgColor} rounded-lg border ${emailDisplay.borderColor}`}
          >
            <div className='flex items-center gap-3'>
              <emailDisplay.icon
                className={`w-5 h-5 ${emailDisplay.iconColor}`}
              />
              <div>
                <div className={`font-medium ${emailDisplay.titleColor}`}>
                  {emailDisplay.title}
                </div>
                <div className={`text-xs ${emailDisplay.descColor}`}>
                  {emailDisplay.description}
                </div>
              </div>
            </div>
          </div>

          {/* Password Status */}
          <div
            className={`flex items-center justify-between p-3 ${passwordDisplay.bgColor} rounded-lg border ${passwordDisplay.borderColor}`}
          >
            <div className='flex items-center gap-3'>
              <passwordDisplay.icon
                className={`w-5 h-5 ${passwordDisplay.iconColor}`}
              />
              <div>
                <div className={`font-medium ${passwordDisplay.titleColor}`}>
                  {passwordDisplay.title}
                </div>
                <div className={`text-xs ${passwordDisplay.descColor}`}>
                  {passwordDisplay.description}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

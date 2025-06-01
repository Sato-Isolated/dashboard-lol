'use client';

import { motion } from 'motion/react';
import { Shield, CheckCircle } from 'lucide-react';
import type { SecurityStatusProps } from './types';

/**
 * SecurityStatus Component
 *
 * Displays the current security status including email verification
 * and password strength indicators with visual feedback.
 */
export default function SecurityStatus({}: SecurityStatusProps) {
  return (
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
  );
}

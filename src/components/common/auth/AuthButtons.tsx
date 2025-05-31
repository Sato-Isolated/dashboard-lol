'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { useSession } from '@/lib/auth/auth-client';
import { LogIn, UserPlus } from 'lucide-react';
import LoginModal from './LoginModal';
import SignUpModal from './SignUpModal';
import ProfileButton from './ProfileButton';

export default function AuthButtons() {
  const { data: session } = useSession();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  if (session?.user) {
    return <ProfileButton />;
  }

  return (
    <>
      <div className='flex items-center gap-2'>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsLoginOpen(true)}
          className='btn btn-ghost btn-sm gap-1'
        >
          <LogIn className='w-4 h-4' />
          <span className='hidden sm:inline'>Sign In</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsSignUpOpen(true)}
          className='btn btn-primary btn-sm gap-1'
        >
          <UserPlus className='w-4 h-4' />
          <span className='hidden sm:inline'>Sign Up</span>
        </motion.button>
      </div>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
      />
    </>
  );
}

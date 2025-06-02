'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { useSession, signOut } from '@/lib/auth/auth-client';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { getSummonerIcon } from '@/lib/utils/helpers';

export default function ProfileButton() {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsDropdownOpen(false);
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  };

  const handleSettingsClick = () => {
    setIsDropdownOpen(false);
    router.push('/settings');
  };

  if (!session?.user) {
    return null;
  }

  return (
    <div className='relative'>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className='btn btn-ghost gap-2 pl-2 pr-3'
      >
        <div className='avatar'>
          <div className='w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center'>
            <img
              src={getSummonerIcon(1440)}
              alt={session.user.name || 'User'}
              className='w-8 h-8 rounded-full object-cover'
            />
          </div>
        </div>
        <span className='hidden sm:block text-sm font-medium max-w-24 truncate'>
          {session.user.name || session.user.email?.split('@')[0]}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isDropdownOpen ? 'rotate-180' : ''
          }`}
        />
      </motion.button>

      <AnimatePresence>
        {isDropdownOpen && (
          <>
            <div
              className='fixed inset-0 z-10'
              onClick={() => setIsDropdownOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className='absolute right-0 top-full mt-2 w-64 bg-base-100 rounded-2xl shadow-xl border border-base-300 z-20'
            >
              <div className='p-4'>
                <div className='flex items-center gap-3 pb-3 border-b border-base-300'>
                  <div className='avatar'>
                    <div className='w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center'>
                      <img
                        src={getSummonerIcon(1440)}
                        alt={session.user.name || 'User'}
                        className='w-10 h-10 rounded-full object-cover'
                      />
                    </div>
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='font-medium text-base-content truncate'>
                      {session.user.name || 'User'}
                    </p>
                    <p className='text-sm text-base-content/60 truncate'>
                      {session.user.email}
                    </p>
                  </div>
                </div>
                <div className='py-2'>
                  <button
                    onClick={handleSettingsClick}
                    className='flex items-center gap-3 w-full p-2 rounded-lg hover:bg-base-200 transition-colors'
                  >
                    <Settings className='w-4 h-4' />
                    <span className='text-sm'>Settings</span>
                  </button>
                </div>
                <div className='pt-2 border-t border-base-300'>
                  <button
                    onClick={handleSignOut}
                    className='flex items-center gap-3 w-full p-2 rounded-lg hover:bg-error/10 text-error transition-colors'
                  >
                    <LogOut className='w-4 h-4' />
                    <span className='text-sm'>Sign Out</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

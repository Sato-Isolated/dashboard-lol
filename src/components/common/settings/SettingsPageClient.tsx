'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, User, Shield, Bell, Palette, Database } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SettingsSection from './SettingsSection';
import ProfileSettings from './ProfileSettings';
import SecuritySettings from './SecuritySettings';
import PreferencesSettings from './PreferencesSettings';
import DataSettings from './DataSettings';

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface SettingsPageClientProps {
  user: User;
}

const settingsSections = [
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    description: 'Manage your account information',
  },
  {
    id: 'security',
    label: 'Security',
    icon: Shield,
    description: 'Password and authentication settings',
  },
  {
    id: 'preferences',
    label: 'Preferences',
    icon: Palette,
    description: 'Customize your dashboard experience',
  },
  {
    id: 'data',
    label: 'Data & Privacy',
    icon: Database,
    description: 'Manage your data and privacy settings',
  },
];

export default function SettingsPageClient({ user }: SettingsPageClientProps) {
  const [activeSection, setActiveSection] = useState('profile');
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSettings user={user} />;
      case 'security':
        return <SecuritySettings user={user} />;
      case 'preferences':
        return <PreferencesSettings user={user} />;
      case 'data':
        return <DataSettings user={user} />;
      default:
        return <ProfileSettings user={user} />;
    }
  };

  return (
    <div className='min-h-screen bg-base-200/30'>
      <div className='container mx-auto px-4 py-8 max-w-7xl'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-8'
        >
          <div className='flex items-center gap-4 mb-6'>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleGoBack}
              className='btn btn-ghost btn-circle'
            >
              <ArrowLeft className='w-5 h-5' />
            </motion.button>
            <div>
              <h1 className='text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
                Settings
              </h1>
              <p className='text-base-content/60 text-sm'>
                Manage your account and preferences
              </p>
            </div>
          </div>
        </motion.div>

        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className='lg:col-span-1'
          >
            <div className='card bg-base-100 shadow-xl'>
              <div className='card-body p-4'>
                <h2 className='card-title text-lg mb-4'>Settings</h2>
                <div className='space-y-2'>
                  {settingsSections.map((section, index) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;

                    return (
                      <motion.button
                        key={section.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 ${
                          isActive
                            ? 'bg-primary/10 text-primary border border-primary/20'
                            : 'hover:bg-base-200 text-base-content'
                        }`}
                      >
                        <Icon className='w-5 h-5 flex-shrink-0' />
                        <div className='flex-1 min-w-0'>
                          <div className='font-medium'>{section.label}</div>
                          <div className='text-xs opacity-60 truncate'>
                            {section.description}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className='lg:col-span-3'
          >
            <SettingsSection>{renderActiveSection()}</SettingsSection>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

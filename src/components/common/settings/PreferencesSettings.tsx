'use client';

import { useState, useEffect } from 'react';
import { Palette } from 'lucide-react';
import { useTheme } from '@/stores/themeStore';
import { settingsApi, Preferences } from '@/lib/api/settings';
import {
  AppearanceSettings,
  DashboardSettings,
  NotificationSettings,
  MessageDisplay,
  SaveButton,
  type User,
  type ExtendedPreferences,
  type Message,
  type Region,
} from './preferences-settings';

interface PreferencesSettingsProps {
  user: User;
}

export default function PreferencesSettings({
  user,
}: PreferencesSettingsProps) {
  const { theme, setTheme, themes } = useTheme();
  const [preferences, setPreferences] = useState<ExtendedPreferences>({
    theme: 'system',
    notifications: {
      email: true,
      push: true,
      marketing: false,
    },
    dashboard: {
      defaultView: 'grid',
      itemsPerPage: 20,
    },
    defaultRegion: 'EUW',
    showRankBadges: true,
    autoRefresh: true,
    showMatchDetails: true,
    enableNotifications: true,
    compactMode: false,
    showTooltips: true,
    animationsEnabled: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  const regions: Region[] = [
    { value: 'EUW', label: 'Europe West' },
    { value: 'EUNE', label: 'Europe Nordic & East' },
    { value: 'NA', label: 'North America' },
    { value: 'KR', label: 'Korea' },
    { value: 'JP', label: 'Japan' },
    { value: 'BR', label: 'Brazil' },
    { value: 'LAN', label: 'Latin America North' },
    { value: 'LAS', label: 'Latin America South' },
    { value: 'OCE', label: 'Oceania' },
    { value: 'TR', label: 'Turkey' },
    { value: 'RU', label: 'Russia' },
  ];
  // Load preferences on component mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        console.log(`Loading preferences for user: ${user.id} (${user.email})`);
        const response = await settingsApi.getPreferences();
        console.log('Preferences response:', response);

        if (response.success && response.data?.preferences) {
          // Merge API preferences with local extended preferences
          const apiPrefs = response.data.preferences;
          console.log(`Setting preferences for user ${user.id}:`, apiPrefs);

          setPreferences(prev => ({
            ...prev,
            ...apiPrefs,
          }));

          // Sync theme with theme store if it's different
          if (apiPrefs.theme && apiPrefs.theme !== theme) {
            console.log(`Syncing theme for user ${user.id}:`, apiPrefs.theme);
            setTheme(apiPrefs.theme);
          }
        }
      } catch (error) {
        console.error(`Failed to load preferences for user ${user.id}:`, error);
        setMessage({
          type: 'error',
          text: 'Failed to load preferences. Please refresh the page.',
        });
      }
    };

    if (user?.id) {
      loadPreferences();
    }
  }, [user.id, theme, setTheme]);

  const handlePreferenceChange = (key: string, value: boolean | string) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };
  const handleThemeChange = async (newTheme: string) => {
    console.log(
      `Theme changing to ${newTheme} for user: ${user.id} (${user.email})`
    );

    // Update local theme immediately for visual feedback
    setTheme(newTheme);

    // Update preferences state
    const updatedPrefs = {
      ...preferences,
      theme: newTheme as ExtendedPreferences['theme'],
    };
    setPreferences(updatedPrefs);

    // Auto-save theme preference
    try {
      const corePreferences: Preferences = {
        theme: newTheme as Preferences['theme'],
        notifications: preferences.notifications,
        dashboard: preferences.dashboard,
      };

      console.log(
        `Auto-saving theme preference for user ${user.id}:`,
        corePreferences
      );
      const response = await settingsApi.savePreferences(corePreferences);

      if (response.success) {
        console.log(`Theme preference saved successfully for user ${user.id}`);
        setMessage({ type: 'success', text: 'Theme updated and saved!' });
        // Clear message after 3 seconds
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error(`Failed to auto-save theme for user ${user.id}:`, error);
      setMessage({
        type: 'error',
        text: 'Theme updated but failed to save. Please click Save Preferences.',
      });
    }
  };
  const handleSavePreferences = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      // Extract only the core preferences that match the API
      const corePreferences: Preferences = {
        theme: preferences.theme,
        notifications: preferences.notifications,
        dashboard: preferences.dashboard,
      };

      console.log(
        `Saving preferences for user ${user.id} (${user.email}):`,
        corePreferences
      );
      const response = await settingsApi.savePreferences(corePreferences);
      console.log('Save response:', response);

      if (response.success) {
        setMessage({
          type: 'success',
          text: 'Preferences saved successfully!',
        });
        // Clear message after 5 seconds
        setTimeout(() => setMessage(null), 5000);
      } else {
        throw new Error(response.error || 'Failed to save preferences');
      }
    } catch (error) {
      console.error(`Save preferences error for user ${user.id}:`, error);
      setMessage({
        type: 'error',
        text:
          error instanceof Error
            ? error.message
            : 'Failed to save preferences. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getThemeDisplayName = (themeName: string) => {
    return (
      themeName.charAt(0).toUpperCase() +
      themeName.slice(1).replace(/([A-Z])/g, ' $1')
    );
  };
  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-3 mb-6'>
        <Palette className='w-6 h-6 text-primary' />
        <div>
          <h2 className='text-2xl font-bold text-base-content'>Preferences</h2>
          <p className='text-base-content/60'>
            Customize your dashboard experience
            {user.name && <span className='ml-1'>• {user.name}</span>}
            {!user.name && user.email && (
              <span className='ml-1'>• {user.email}</span>
            )}
          </p>
        </div>
      </div>
      <AppearanceSettings
        preferences={preferences}
        onPreferenceChange={handlePreferenceChange}
        onThemeChange={handleThemeChange}
        themes={themes}
        currentTheme={theme}
        getThemeDisplayName={getThemeDisplayName}
      />
      <DashboardSettings
        preferences={preferences}
        onPreferenceChange={handlePreferenceChange}
        regions={regions}
      />
      <NotificationSettings
        preferences={preferences}
        onPreferenceChange={handlePreferenceChange}
      />
      <MessageDisplay message={message} />
      <SaveButton onSave={handleSavePreferences} isLoading={isLoading} />
    </div>
  );
}

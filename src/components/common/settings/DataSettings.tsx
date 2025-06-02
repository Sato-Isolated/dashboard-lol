'use client';

import { useState } from 'react';
import { Database } from 'lucide-react';
import {
  DataSettingsProps,
  Message,
  DataOverview,
  PrivacySettings,
  DataExport,
  DangerZone,
  MessageDisplay,
} from './data-settings';

export default function DataSettings({ user }: DataSettingsProps) {
  const [message, setMessage] = useState<Message | null>(null);

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-3 mb-6'>
        <Database className='w-6 h-6 text-primary' />
        <div>
          <h2 className='text-2xl font-bold text-base-content'>
            Data & Privacy
          </h2>
          <p className='text-base-content/60'>
            Manage your data and privacy settings
          </p>
        </div>
      </div>

      <DataOverview />

      <PrivacySettings />

      <DataExport user={user} onMessage={setMessage} />

      <DangerZone onMessage={setMessage} />

      {message && <MessageDisplay message={message} />}
    </div>
  );
}

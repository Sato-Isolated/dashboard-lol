'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Download } from 'lucide-react';
import { settingsApi } from '@/lib/api/settings';
import { User, Message } from './types';

interface DataExportProps {
  user: User;
  onMessage: (message: Message | null) => void;
}

export default function DataExport({ user, onMessage }: DataExportProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportData = async () => {
    setIsExporting(true);
    onMessage(null);

    try {
      const response = await settingsApi.exportData();

      if (response.success) {
        // Create download with exported data
        const data = {
          user: user,
          exportDate: new Date().toISOString(),
          data: response.data,
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dashboard-data-${user.id}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        onMessage({ type: 'success', text: 'Data exported successfully!' });
      } else {
        throw new Error(response.error || 'Failed to export data');
      }
    } catch (error) {
      onMessage({
        type: 'error',
        text:
          error instanceof Error
            ? error.message
            : 'Failed to export data. Please try again.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className='bg-base-200/50 rounded-2xl p-6'
    >
      <h3 className='text-lg font-semibold mb-4'>Export Your Data</h3>
      <p className='text-sm text-base-content/60 mb-4'>
        Download a copy of all your data including profile information,
        favorites, and preferences.
      </p>
      <motion.button
        onClick={handleExportData}
        disabled={isExporting}
        whileTap={{ scale: 0.98 }}
        className='btn btn-outline gap-2'
      >
        {isExporting ? (
          <span className='loading loading-spinner loading-sm'></span>
        ) : (
          <Download className='w-4 h-4' />
        )}
        {isExporting ? 'Preparing Export...' : 'Export Data'}
      </motion.button>
    </motion.div>
  );
}

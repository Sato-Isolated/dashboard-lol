import { motion } from 'motion/react';
import { Shield } from 'lucide-react';

export default function PrivacySettings() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className='bg-base-200/50 rounded-2xl p-6'
    >
      <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
        <Shield className='w-5 h-5' />
        Privacy Settings
      </h3>

      <div className='space-y-4'>
        <div className='form-control'>
          <label className='cursor-pointer label justify-start gap-3'>
            <input
              type='checkbox'
              defaultChecked
              className='checkbox checkbox-primary'
            />
            <div>
              <span className='label-text font-medium'>Profile Visibility</span>
              <div className='text-xs text-base-content/60'>
                Allow your profile to be discoverable by other users
              </div>
            </div>
          </label>
        </div>

        <div className='form-control'>
          <label className='cursor-pointer label justify-start gap-3'>
            <input
              type='checkbox'
              defaultChecked
              className='checkbox checkbox-primary'
            />
            <div>
              <span className='label-text font-medium'>Match History</span>
              <div className='text-xs text-base-content/60'>
                Share your match history with the community
              </div>
            </div>
          </label>
        </div>

        <div className='form-control'>
          <label className='cursor-pointer label justify-start gap-3'>
            <input type='checkbox' className='checkbox checkbox-primary' />
            <div>
              <span className='label-text font-medium'>Analytics</span>
              <div className='text-xs text-base-content/60'>
                Help improve the platform by sharing anonymous usage data
              </div>
            </div>
          </label>
        </div>
      </div>
    </motion.div>
  );
}

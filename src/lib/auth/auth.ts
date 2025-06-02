import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { MongoClient } from 'mongodb';
import { config } from '@/lib/config';

const mongoClient = new MongoClient(config.get('DB_CONN_STRING'));

export const auth = betterAuth({
  database: mongodbAdapter(mongoClient.db(config.get('DB_NAME'))),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true in production
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (update session if older than 1 day)
  },
  secret:
    process.env.BETTER_AUTH_SECRET || 'fallback-secret-key-for-development',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  advanced: {
    generateId: () => crypto.randomUUID(),
  },
  // Add custom user fields
  user: {
    additionalFields: {
      passwordStrength: {
        type: 'number',
        required: false,
        defaultValue: 0,
      },
      passwordUpdatedAt: {
        type: 'date',
        required: false,
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;

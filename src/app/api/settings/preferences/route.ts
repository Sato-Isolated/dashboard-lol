import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { z } from 'zod';
import { MongoClient } from 'mongodb';
import { config } from '@/lib/config';

const preferencesSchema = z.object({
  theme: z
    .enum([
      'light',
      'dark',
      'cupcake',
      'bumblebee',
      'emerald',
      'corporate',
      'synthwave',
      'retro',
      'cyberpunk',
      'valentine',
      'halloween',
      'garden',
      'forest',
      'aqua',
      'lofi',
      'pastel',
      'fantasy',
      'wireframe',
      'black',
      'luxury',
      'dracula',
      'cmyk',
      'autumn',
      'business',
      'acid',
      'lemonade',
      'night',
      'coffee',
      'winter',
      'dim',
      'nord',
      'sunset',
      'caramellatte',
      'abyss',
      'system',
    ])
    .optional(),
  notifications: z
    .object({
      email: z.boolean().optional(),
      push: z.boolean().optional(),
      marketing: z.boolean().optional(),
    })
    .optional(),
  dashboard: z
    .object({
      defaultView: z.enum(['grid', 'list']).optional(),
      itemsPerPage: z.number().min(10).max(100).optional(),
    })
    .optional(),
});

// MongoDB connection
let mongoClient: MongoClient;
let db: any;
let preferencesCollection: any;

async function getDatabase() {
  if (!mongoClient) {
    mongoClient = new MongoClient(config.get('DB_CONN_STRING'));
    await mongoClient.connect();
    db = mongoClient.db(config.get('DB_NAME'));
    preferencesCollection = db.collection('userPreferences');
  }
  return { db, preferencesCollection };
}

export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/settings/preferences - Start');

    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      console.log('No session found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Session found for user:', session.user.id);

    // Get database connection
    const { preferencesCollection } = await getDatabase();

    // Try to fetch user preferences from database
    const userPreferences = await preferencesCollection.findOne({
      userId: session.user.id,
    });

    console.log('User preferences from DB:', userPreferences);

    // Return saved preferences or defaults
    const preferences = userPreferences?.preferences || {
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
    };

    console.log('Returning preferences:', preferences);

    return NextResponse.json({ success: true, data: { preferences } });
  } catch (error) {
    console.error('Get preferences error:', error);
    return NextResponse.json(
      { error: 'Failed to get preferences' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/settings/preferences - Start');

    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      console.log('No session found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Session found for user:', session.user.id);

    const body = await request.json();
    console.log('Request body:', body);

    const validatedData = preferencesSchema.parse(body);
    console.log('Validated data:', validatedData);

    // Get database connection
    const { preferencesCollection } = await getDatabase();

    // Save preferences to database using upsert
    const result = await preferencesCollection.updateOne(
      { userId: session.user.id },
      {
        $set: {
          userId: session.user.id,
          preferences: validatedData,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    console.log('Database update result:', result);
    console.log('Saved preferences for user:', session.user.id, validatedData);

    return NextResponse.json({
      success: true,
      message: 'Preferences updated successfully',
    });
  } catch (error) {
    console.error('Save preferences error:', error);

    if (error instanceof z.ZodError) {
      console.log('Validation error:', error.errors);
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to save preferences' },
      { status: 500 }
    );
  }
}

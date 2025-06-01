import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { z } from 'zod';

const preferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  language: z.string(),
  timezone: z.string(),
  dashboardLayout: z.enum(['compact', 'comfortable', 'spacious']),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    gameUpdates: z.boolean(),
    rankUpdates: z.boolean(),
    friendRequests: z.boolean(),
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'friends', 'private']),
    showOnlineStatus: z.boolean(),
    allowFriendRequests: z.boolean(),
  }),
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // For now, return default preferences
    // In a real app, you'd fetch from database
    const defaultPreferences = {
      theme: 'system',
      language: 'en',
      timezone: 'UTC',
      dashboardLayout: 'comfortable',
      notifications: {
        email: true,
        push: true,
        gameUpdates: true,
        rankUpdates: true,
        friendRequests: true,
      },
      privacy: {
        profileVisibility: 'public',
        showOnlineStatus: true,
        allowFriendRequests: true,
      },
    };

    return NextResponse.json({
      success: true,
      preferences: defaultPreferences,
    });
  } catch (error) {
    console.error('Preferences fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedPreferences = preferencesSchema.parse(body);

    // In a real app, you'd save to database
    // For now, we'll just simulate success
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      preferences: validatedPreferences,
      message: 'Preferences updated successfully',
    });
  } catch (error) {
    console.error('Preferences update error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
}

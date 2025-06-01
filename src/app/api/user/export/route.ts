import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // In a real application, you would:
    // 1. Gather all user data from your database
    // 2. Create a comprehensive export file (JSON/CSV)
    // 3. Include game stats, preferences, profile data, etc.

    const exportData = {
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        createdAt: session.user.createdAt,
        image: session.user.image,
      },
      gameData: {
        // Placeholder for game statistics
        rankedStats: {},
        matchHistory: [],
        championMastery: [],
      },
      preferences: {
        theme: 'system',
        language: 'en',
        notifications: {},
      },
      exportedAt: new Date().toISOString(),
      exportVersion: '1.0',
    };

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `lol-dashboard-export-${timestamp}.json`;

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Data export error:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}

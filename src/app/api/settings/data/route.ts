import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type } = await request.json();

    if (type === 'export') {
      // In a real app, you'd generate a comprehensive data export
      const userData = {
        user: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          createdAt: session.user.createdAt,
        },
        matches: [],
        preferences: {},
        exportedAt: new Date().toISOString(),
      };

      return NextResponse.json({
        success: true,
        data: userData,
        message: 'Data export ready for download',
      });
    }

    return NextResponse.json({ error: 'Invalid export type' }, { status: 400 });
  } catch (error) {
    console.error('Data export error:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { confirmDelete } = await request.json();

    if (!confirmDelete) {
      return NextResponse.json(
        { error: 'Account deletion not confirmed' },
        { status: 400 }
      );
    } // Delete user account using Better Auth
    await auth.api.deleteUser({
      headers: request.headers,
      body: {},
    });

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    console.error('Account deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}

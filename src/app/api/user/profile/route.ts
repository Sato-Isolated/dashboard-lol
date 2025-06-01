import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { z } from 'zod';

const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  // Email changes should use changeEmail method instead of updateUser
});

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateProfileSchema.parse(body); // Update user profile using Better Auth
    const updatedUser = await auth.api.updateUser({
      headers: request.headers,
      body: {
        name: validatedData.name,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Profile update error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: session.user,
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

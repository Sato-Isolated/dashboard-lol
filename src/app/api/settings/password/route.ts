import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { z } from 'zod';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(100),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = changePasswordSchema.parse(body);

    // Change password using Better Auth
    const result = await auth.api.changePassword({
      headers: request.headers,
      body: {
        currentPassword: validatedData.currentPassword,
        newPassword: validatedData.newPassword,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('Password change error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to change password' },
      { status: 500 }
    );
  }
}

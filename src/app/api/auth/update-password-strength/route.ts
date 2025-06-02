import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { getPasswordStrength } from '@/lib/utils/passwordStrength';
import { z } from 'zod';

const updatePasswordStrengthSchema = z.object({
  password: z.string().min(1),
  userId: z.string().optional(), // Optional, will use session user if not provided
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const body = await request.json();
    const { password, userId } = updatePasswordStrengthSchema.parse(body);

    // Use session user ID if userId not provided
    const targetUserId = userId || session?.user?.id;

    if (!targetUserId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Calculate password strength using zxcvbn
    const strength = getPasswordStrength(password);    // Update user with password strength
    await auth.api.updateUser({
      headers: request.headers,
      body: {
        passwordStrength: strength.strength,
        passwordUpdatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      passwordStrength: strength,
    });
  } catch (error) {
    console.error('Update password strength error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update password strength' },
      { status: 500 }
    );
  }
}

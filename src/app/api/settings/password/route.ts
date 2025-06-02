import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { getPasswordStrength } from '@/lib/utils/passwordStrength';
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
    await auth.api.changePassword({
      headers: request.headers,
      body: {
        currentPassword: validatedData.currentPassword,
        newPassword: validatedData.newPassword,
      },
    });

    // Calculate and store new password strength
    const strength = getPasswordStrength(validatedData.newPassword);    try {
      await auth.api.updateUser({
        headers: request.headers,
        body: {
          passwordStrength: strength.strength,
          passwordUpdatedAt: new Date(),
        },
      });
    } catch (updateError) {
      console.warn('Failed to update password strength:', updateError);
      // Don't fail the password change if strength update fails
    }

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

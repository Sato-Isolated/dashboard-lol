import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';

// Map stored strength values to our PasswordStrength type
const getPasswordStrengthFromValue = (strengthValue: number | undefined) => {
  const strengthMap = {
    1: { strength: 1, label: 'Weak', color: 'text-error' },
    2: { strength: 2, label: 'Fair', color: 'text-warning' },
    3: { strength: 3, label: 'Good', color: 'text-info' },
    4: { strength: 4, label: 'Strong', color: 'text-success' },
  };

  return (
    strengthMap[strengthValue as keyof typeof strengthMap] || {
      strength: 1,
      label: 'Set',
      color: 'text-info',
    }
  );
};

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the current user with all fields including custom fields
    const user = session.user as any;

    // Create email verification status
    const emailStatus = {
      isVerified: user.emailVerified || false,
      email: user.email || undefined,
      lastVerifiedAt: user.emailVerified ? new Date() : undefined,
    };

    // Create password security status using stored strength
    const passwordStatus = {
      hasPassword: true, // Assume user has password since they're logged in
      strength: getPasswordStrengthFromValue(user.passwordStrength),
      lastUpdated:
        user.passwordUpdatedAt ||
        user.createdAt ||
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    };

    return NextResponse.json({
      success: true,
      data: {
        email: emailStatus,
        password: passwordStatus,
      },
    });
  } catch (error) {
    console.error('Security status error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch security status' },
      { status: 500 }
    );
  }
}

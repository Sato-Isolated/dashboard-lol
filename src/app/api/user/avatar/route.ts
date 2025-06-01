import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { z } from 'zod';

// Validate file upload
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size too large. Maximum 2MB allowed.' },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'avatars');
    await mkdir(uploadsDir, { recursive: true });

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${session.user.id}-${Date.now()}.${fileExtension}`;
    const filePath = join(uploadsDir, fileName);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer); // Update user profile with new image URL
    const imageUrl = `/uploads/avatars/${fileName}`;

    const updatedUser = await auth.api.updateUser({
      headers: request.headers,
      body: {
        image: imageUrl,
      },
    });

    return NextResponse.json({
      success: true,
      imageUrl,
      user: updatedUser,
      message: 'Profile picture updated successfully',
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload profile picture' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    } // Remove profile picture from user
    const updatedUser = await auth.api.updateUser({
      headers: request.headers,
      body: {
        image: undefined,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: 'Profile picture removed successfully',
    });
  } catch (error) {
    console.error('Avatar removal error:', error);
    return NextResponse.json(
      { error: 'Failed to remove profile picture' },
      { status: 500 }
    );
  }
}

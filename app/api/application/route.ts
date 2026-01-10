import { NextRequest, NextResponse } from 'next/server';
import { sendApplicationEmail } from '@/lib/email';

/**
 * API Route: POST /api/application
 *
 * Handles application PDF upload and email delivery
 * - Accepts multipart/form-data with PDF file
 * - Validates file type and size
 * - Sends email with PDF attachment using Nodemailer (free)
 * - Does NOT store file permanently (in-memory only)
 *
 * Security measures:
 * - File type validation (PDF only)
 * - File size limit (5MB)
 * - No permanent file storage
 * - Input sanitization
 */

// Max file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    // Parse multipart/form-data using native Web API
    const formData = await request.formData();

    const file = formData.get('file') as File | null;
    const name = formData.get('name') as string | null;
    const email = formData.get('email') as string | null;

    // Validate file exists
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { success: false, error: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Validate file name (prevent path traversal)
    const filename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');

    // Convert File to Buffer for Nodemailer (in-memory, not stored)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Send email with PDF attachment
    await sendApplicationEmail(
      buffer,
      filename,
      name || undefined,
      email || undefined
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Application submitted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Application submission error:', error);

    // Check if it's an email configuration error
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    if (
      errorMessage.includes('credentials') ||
      errorMessage.includes('EMAIL')
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Email service not configured. Please contact the administrator.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit application. Please try again later.',
      },
      { status: 500 }
    );
  }
}

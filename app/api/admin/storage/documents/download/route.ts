import { NextRequest, NextResponse } from 'next/server';
import { hasValidAdminSession } from '@/lib/admin-session';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';

const BUCKET = 'documents';

export async function GET(request: NextRequest) {
  if (!hasValidAdminSession(request)) {
    return NextResponse.json(
      { error: 'Admin authentication required' },
      { status: 401 }
    );
  }

  const path = request.nextUrl.searchParams.get('path');
  if (!path || path.includes('/') || path.includes('\\')) {
    return NextResponse.json(
      { error: 'A valid document path is required' },
      { status: 400 }
    );
  }

  try {
    const supabase = createSupabaseAdminClient();
    const separatorIndex = path.indexOf('__');
    const downloadName =
      separatorIndex >= 0 ? path.slice(separatorIndex + 2) : path;
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(path, 60, { download: downloadName });

    if (error) {
      console.error('Error creating document download link:', error);
      return NextResponse.json(
        { error: 'Failed to create a document download link' },
        { status: 500 }
      );
    }

    return NextResponse.json({ signedUrl: data.signedUrl });
  } catch (error) {
    console.error('Error creating document download link:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

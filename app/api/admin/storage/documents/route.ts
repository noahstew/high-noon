import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { hasValidAdminSession } from '@/lib/admin-session';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';

const BUCKET = 'documents';
const PAGE_SIZE = 100;
const MAX_FILE_SIZE = 50 * 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set([
  'csv',
  'doc',
  'docx',
  'odp',
  'ods',
  'odt',
  'pdf',
  'ppt',
  'pptx',
  'rtf',
  'txt',
  'xls',
  'xlsx',
]);

function unauthorized() {
  return NextResponse.json({ error: 'Admin authentication required' }, { status: 401 });
}

export async function GET(request: NextRequest) {
  if (!hasValidAdminSession(request)) return unauthorized();

  try {
    const supabase = createSupabaseAdminClient();
    const documents: {
      path: string;
      name: string;
      createdAt: string | null;
      size: number | null;
    }[] = [];

    for (let offset = 0; ; offset += PAGE_SIZE) {
      const { data, error } = await supabase.storage.from(BUCKET).list('', {
        limit: PAGE_SIZE,
        offset,
        sortBy: { column: 'created_at', order: 'desc' },
      });

      if (error) {
        console.error('Error listing stored documents:', error);
        return NextResponse.json(
          { error: 'Failed to list documents from Supabase Storage' },
          { status: 500 }
        );
      }

      for (const file of data) {
        if (!file.id) continue;
        const separatorIndex = file.name.indexOf('__');
        const name =
          separatorIndex >= 0
            ? file.name.slice(separatorIndex + 2)
            : file.name;

        documents.push({
          path: file.name,
          name,
          createdAt: file.created_at ?? null,
          size:
            typeof file.metadata?.size === 'number'
              ? file.metadata.size
              : null,
        });
      }

      if (data.length < PAGE_SIZE) break;
    }

    return NextResponse.json({ documents });
  } catch (error) {
    console.error('Error listing stored documents:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!hasValidAdminSession(request)) return unauthorized();

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { error: 'Choose a document to upload' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Documents must be 50 MB or smaller' },
        { status: 413 }
      );
    }

    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !ALLOWED_EXTENSIONS.has(extension)) {
      return NextResponse.json(
        {
          error:
            'Supported formats: PDF, Word, Excel, PowerPoint, CSV, RTF, and text documents',
        },
        { status: 400 }
      );
    }

    const safeName = file.name
      .normalize('NFKC')
      .replace(/[^\p{L}\p{N}._() -]/gu, '_')
      .replace(/^[. ]+|[. ]+$/g, '');
    if (!safeName) {
      return NextResponse.json(
        { error: 'The document filename is not valid' },
        { status: 400 }
      );
    }

    const path = `${randomUUID()}__${safeName}`;
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.storage.from(BUCKET).upload(
      path,
      new Uint8Array(await file.arrayBuffer()),
      {
        contentType: file.type || 'application/octet-stream',
        upsert: false,
      }
    );

    if (error) {
      console.error('Error uploading stored document:', error);
      return NextResponse.json(
        { error: `Failed to upload document: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        document: {
          path,
          name: safeName,
          createdAt: new Date().toISOString(),
          size: file.size,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error uploading stored document:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!hasValidAdminSession(request)) return unauthorized();

  try {
    const body = await request.json();
    const path = body?.path;
    if (
      typeof path !== 'string' ||
      !path.trim() ||
      path === '.' ||
      path === '..' ||
      path.includes('/') ||
      path.includes('\\')
    ) {
      return NextResponse.json(
        { error: 'A valid document path is required' },
        { status: 400 }
      );
    }

    const { error } = await createSupabaseAdminClient()
      .storage.from(BUCKET)
      .remove([path]);

    if (error) {
      console.error('Error deleting stored document:', error);
      return NextResponse.json(
        { error: 'Failed to delete document from Supabase Storage' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting stored document:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

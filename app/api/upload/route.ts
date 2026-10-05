import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bucket = formData.get('bucket') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!bucket) {
      return NextResponse.json(
        { error: 'No bucket specified' },
        { status: 400 }
      );
    }

    if (bucket === 'blog-pdfs') {
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        return NextResponse.json(
          { error: 'Only PDF files can be uploaded to this bucket' },
          { status: 400 }
        );
      }

      const header = new Uint8Array(await file.slice(0, 5).arrayBuffer());
      if (new TextDecoder().decode(header) !== '%PDF-') {
        return NextResponse.json(
          { error: 'The uploaded file is not a valid PDF' },
          { status: 400 }
        );
      }
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}.${fileExt}`;
    const filePath = fileName;

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: bucket === 'blog-pdfs' ? 'application/pdf' : file.type,
        upsert: false,
      });

    if (error) {
      console.error('Error uploading file:', error);
      return NextResponse.json(
        { error: `Failed to upload file: ${error.message}`, details: error },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'No data returned from upload' },
        { status: 500 }
      );
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(filePath);

    console.log('Upload successful:', { path: data.path, publicUrl });

    return NextResponse.json({
      path: data.path,
      publicUrl,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}

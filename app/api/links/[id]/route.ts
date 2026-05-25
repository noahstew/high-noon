import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// DELETE - Delete a link
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const { error } = await supabase.from('links').delete().eq('id', id);

    if (error) {
      console.error('Error deleting link:', error);
      return NextResponse.json(
        { error: 'Failed to delete link' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

// PUT - Update a link
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, url, image_url } = body;

    if (!title || !url) {
      return NextResponse.json(
        { error: 'Title and URL are required' },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from('links')
      .update({
        title,
        url,
        image_url: image_url || null,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating link:', error);
      return NextResponse.json(
        { error: 'Failed to update link' },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

// PATCH - Update a link
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, url, image_url } = body;

    if (!title || !url) {
      return NextResponse.json(
        { error: 'Title and URL are required' },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from('links')
      .update({
        title,
        url,
        image_url: image_url || null,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating link:', error);
      return NextResponse.json(
        { error: 'Failed to update link' },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

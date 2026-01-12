import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET single gallery item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching gallery item:', error);
      return NextResponse.json(
        { error: 'Failed to fetch gallery item' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a gallery item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error } = await supabase.from('gallery').delete().eq('id', id);

    if (error) {
      console.error('Error deleting gallery item:', error);
      return NextResponse.json(
        { error: 'Failed to delete gallery item' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update a gallery item
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, images } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('gallery')
      .update({
        title,
        images: images || [],
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating gallery item:', error);
      return NextResponse.json(
        { error: 'Failed to update gallery item' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

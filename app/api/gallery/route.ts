import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET all gallery items
export async function GET() {
  try {
    const { data: items, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching gallery items:', error);
      return NextResponse.json(
        { error: 'Failed to fetch gallery items' },
        { status: 500 }
      );
    }

    return NextResponse.json(items);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new gallery item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, images } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('gallery')
      .insert([
        {
          title,
          images: images || [],
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating gallery item:', error);
      return NextResponse.json(
        { error: 'Failed to create gallery item' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

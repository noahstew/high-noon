import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET all links
export async function GET() {
  try {
    const { data: links, error } = await supabase
      .from('links')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching links:', error);
      return NextResponse.json(
        { error: 'Failed to fetch links' },
        { status: 500 }
      );
    }

    return NextResponse.json(links);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new link
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, url, image_url } = body;

    if (!title || !url) {
      return NextResponse.json(
        { error: 'Title and URL are required' },
        { status: 400 }
      );
    }

    // Get the current max sort_order
    const { data: maxOrderData } = await supabase
      .from('links')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1);

    const nextSortOrder =
      maxOrderData && maxOrderData.length > 0
        ? maxOrderData[0].sort_order + 1
        : 0;

    const { data, error } = await supabase
      .from('links')
      .insert([
        {
          title,
          url,
          image_url: image_url || null,
          sort_order: nextSortOrder,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating link:', error);
      return NextResponse.json(
        { error: 'Failed to create link' },
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

// PUT - Update link order
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { links } = body;

    if (!links || !Array.isArray(links)) {
      return NextResponse.json(
        { error: 'Links array is required' },
        { status: 400 }
      );
    }

    // Update all links with new sort orders
    const updatePromises = links.map(
      (link: { id: string; sort_order: number }) =>
        supabase
          .from('links')
          .update({ sort_order: link.sort_order })
          .eq('id', link.id)
    );

    await Promise.all(updatePromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

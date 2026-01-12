-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create blog_post table
CREATE TABLE IF NOT EXISTS blog_post (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  images TEXT[] DEFAULT '{}', -- Array of storage bucket paths
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create links table
CREATE TABLE IF NOT EXISTS links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  images TEXT[] DEFAULT '{}', -- Array of storage bucket paths
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_blog_post_published_at ON blog_post(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_post_created_at ON blog_post(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_links_sort_order ON links(sort_order ASC);
CREATE INDEX IF NOT EXISTS idx_gallery_created_at ON gallery(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE blog_post ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Enable read access for all users" ON blog_post
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON links
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON gallery
  FOR SELECT USING (true);

-- Create policies for insert/update/delete
-- Since authentication is handled at the application level,
-- we allow all operations (your app's admin routes control access)
CREATE POLICY "Enable insert for all users" ON blog_post
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON blog_post
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON blog_post
  FOR DELETE USING (true);

CREATE POLICY "Enable insert for all users" ON links
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON links
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON links
  FOR DELETE USING (true);

CREATE POLICY "Enable insert for all users" ON gallery
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON gallery
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON gallery
  FOR DELETE USING (true);

-- Create storage buckets (run these in the Supabase dashboard or via API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('gallery-images', 'gallery-images', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('link-images', 'link-images', true);

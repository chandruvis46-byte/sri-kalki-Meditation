-- Create a table for global site settings (like logo)
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS for site_settings
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone
CREATE POLICY "Public site_settings are viewable by everyone" 
ON site_settings FOR SELECT 
TO public 
USING (true);

-- Allow all access to authenticated users (admin)
CREATE POLICY "Authenticated users can manage site_settings" 
ON site_settings FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Create a table for Hero Banners
CREATE TABLE IF NOT EXISTS banners (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  image_url TEXT NOT NULL,
  title TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS for banners
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone
CREATE POLICY "Public banners are viewable by everyone" 
ON banners FOR SELECT 
TO public 
USING (true);

-- Allow all access to authenticated users (admin)
CREATE POLICY "Authenticated users can manage banners" 
ON banners FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Storage bucket for banners and logo
-- Note: You might need to create this bucket manually in the dashboard if this script fails due to permissions, 
-- but this SQL attempts to insert it if your Supabase setup allows it.
INSERT INTO storage.buckets (id, name, public) 
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for site-assets
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
TO public 
USING ( bucket_id = 'site-assets' );

CREATE POLICY "Authenticated users can upload" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK ( bucket_id = 'site-assets' );

CREATE POLICY "Authenticated users can update" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING ( bucket_id = 'site-assets' );

CREATE POLICY "Authenticated users can delete" 
ON storage.objects FOR DELETE 
TO authenticated 
USING ( bucket_id = 'site-assets' );

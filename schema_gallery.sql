CREATE TABLE IF NOT EXISTS gallery_images (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Insert sample defaults if empty
INSERT INTO gallery_images (url)
SELECT 'fotos/26102019-0L4A3971.jpg' WHERE NOT EXISTS (SELECT 1 FROM gallery_images);
INSERT INTO gallery_images (url)
SELECT 'fotos/26102019-IMG_3886.jpg' WHERE NOT EXISTS (SELECT 1 FROM gallery_images LIMIT 1 OFFSET 1);
INSERT INTO gallery_images (url)
SELECT 'fotos/26102019-IMG_3959.jpg' WHERE NOT EXISTS (SELECT 1 FROM gallery_images LIMIT 1 OFFSET 2);

-- Enable public access to the storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery', 'gallery', true) 
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'gallery' );
CREATE POLICY "Public Insert" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'gallery' );
CREATE POLICY "Public Update" ON storage.objects FOR UPDATE WITH CHECK ( bucket_id = 'gallery' );
CREATE POLICY "Public Delete" ON storage.objects FOR DELETE USING ( bucket_id = 'gallery' );

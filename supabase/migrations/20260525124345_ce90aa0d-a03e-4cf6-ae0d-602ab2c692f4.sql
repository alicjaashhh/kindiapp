
INSERT INTO storage.buckets (id, name, public) 
VALUES ('baby-photos', 'baby-photos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Baby photos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'baby-photos');

CREATE POLICY "Users can upload baby photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'baby-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own baby photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'baby-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own baby photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'baby-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

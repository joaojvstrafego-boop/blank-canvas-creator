-- Bucket público para arquivos do curso (PDFs/áudio)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'course-files',
  'course-files',
  true,
  52428800,
  ARRAY['application/pdf', 'audio/mpeg', 'audio/mp3']
)
ON CONFLICT (id)
DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Leitura pública apenas desse bucket
DROP POLICY IF EXISTS "Public read course files" ON storage.objects;
CREATE POLICY "Public read course files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'course-files');
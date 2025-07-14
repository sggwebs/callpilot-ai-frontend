-- Create storage bucket for user settings and configuration files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('user-settings', 'user-settings', false);

-- Create policies for user settings bucket
CREATE POLICY "Users can upload their own settings files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'user-settings' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own settings files" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'user-settings' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own settings files" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'user-settings' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own settings files" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'user-settings' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
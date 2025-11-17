# Database Setup Instructions

## Supabase Database Schema

Execute the following SQL commands in your Supabase SQL Editor to set up the database schema for profile management and avatars.

### 1. Add Bio Column to Profiles Table

```sql
-- Add bio column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS bio TEXT;
```

### 2. Create Avatars Storage Bucket

```sql
-- Create avatars storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;
```

### 3. Set Up Storage Policies

```sql
-- Allow public read access to avatars
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Allow users to upload their own avatar
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own avatar
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own avatar
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### 4. Update Profiles Table Trigger

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Ensure trigger exists for profiles table
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON public.profiles 
    FOR EACH ROW 
    EXECUTE PROCEDURE update_updated_at_column();
```

## How to Execute

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Create a new query
4. Copy and paste each section above
5. Run each query sequentially
6. Verify the changes in the **Table Editor** and **Storage** sections

## Verification

After running the SQL scripts, verify:

- [ ] `profiles` table has a `bio` column (TEXT type)
- [ ] `avatars` bucket exists in Storage
- [ ] Storage policies are active (4 policies total)
- [ ] `update_profiles_updated_at` trigger exists on profiles table

## Notes

- The avatar upload feature stores images in the format: `avatars/{user_id}/{filename}`
- Profile images are publicly accessible via Supabase CDN
- Users can only manage their own avatar files (enforced by RLS policies)

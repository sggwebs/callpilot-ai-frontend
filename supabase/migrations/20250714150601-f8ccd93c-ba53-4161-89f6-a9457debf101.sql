-- Fix infinite recursion in profiles RLS policies
-- Drop the problematic policy that causes recursion
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;

-- Create a new policy that uses user metadata instead of querying the profiles table
CREATE POLICY "Admins can read all profiles" ON profiles
FOR SELECT USING (
  -- Allow admins to read all profiles using user metadata
  (auth.jwt() ->> 'role' = 'admin') OR
  (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin') OR
  (auth.jwt() -> 'user_metadata' ->> 'role' = 'Admin') OR
  -- Allow users to read their own profile
  (auth.uid() = id)
);
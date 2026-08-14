ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS avatar_url text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS provider text NOT NULL DEFAULT 'email';

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone, avatar_url, provider)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', NEW.raw_user_meta_data ->> 'picture', ''),
    COALESCE(NEW.raw_app_meta_data ->> 'provider', 'email')
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = CASE WHEN public.profiles.full_name = '' THEN EXCLUDED.full_name ELSE public.profiles.full_name END,
    email = CASE WHEN public.profiles.email = '' THEN EXCLUDED.email ELSE public.profiles.email END,
    avatar_url = CASE WHEN public.profiles.avatar_url = '' THEN EXCLUDED.avatar_url ELSE public.profiles.avatar_url END,
    updated_at = now();
  RETURN NEW;
END;
$$;
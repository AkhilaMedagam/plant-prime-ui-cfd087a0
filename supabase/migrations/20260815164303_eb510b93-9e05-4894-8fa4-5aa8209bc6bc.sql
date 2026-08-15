-- 1. profiles adjustments
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_id uuid;
UPDATE public.profiles SET user_id = id WHERE user_id IS NULL;
ALTER TABLE public.profiles ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);
ALTER TABLE public.profiles RENAME COLUMN provider TO auth_provider;
ALTER TABLE public.profiles ALTER COLUMN avatar_url DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN avatar_url DROP DEFAULT;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, user_id, full_name, email, phone, avatar_url, auth_provider)
  VALUES (
    NEW.id,
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', NEW.raw_user_meta_data ->> 'picture'),
    COALESCE(NEW.raw_app_meta_data ->> 'provider', 'email')
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = CASE WHEN public.profiles.full_name = '' THEN EXCLUDED.full_name ELSE public.profiles.full_name END,
    email = CASE WHEN public.profiles.email = '' THEN EXCLUDED.email ELSE public.profiles.email END,
    avatar_url = COALESCE(public.profiles.avatar_url, EXCLUDED.avatar_url),
    updated_at = now();

  INSERT INTO public.user_app_profiles (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$function$;

-- 2. roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- 3. user_app_profiles
CREATE TABLE public.user_app_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  onboarding_completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.user_app_profiles TO authenticated;
GRANT ALL ON public.user_app_profiles TO service_role;
ALTER TABLE public.user_app_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own app profile" ON public.user_app_profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own app profile" ON public.user_app_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own app profile" ON public.user_app_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_user_app_profiles_updated_at BEFORE UPDATE ON public.user_app_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- backfill app profiles for existing users
INSERT INTO public.user_app_profiles (user_id)
SELECT id FROM auth.users ON CONFLICT (user_id) DO NOTHING;

-- 4. contact_submissions
CREATE TABLE public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_submissions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_submissions TO authenticated;
GRANT ALL ON public.contact_submissions TO service_role;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a contact form" ON public.contact_submissions FOR INSERT TO anon WITH CHECK (user_id IS NULL);
CREATE POLICY "Signed-in users can submit a contact form" ON public.contact_submissions FOR INSERT TO authenticated WITH CHECK (user_id IS NULL OR user_id = auth.uid());
CREATE POLICY "Users can view their own submissions" ON public.contact_submissions FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can update their own submissions" ON public.contact_submissions FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can view all submissions" ON public.contact_submissions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update all submissions" ON public.contact_submissions FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete submissions" ON public.contact_submissions FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
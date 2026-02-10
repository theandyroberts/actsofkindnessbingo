-- Admin RPC: get all profiles (only callable by admins)
CREATE OR REPLACE FUNCTION public.get_all_profiles()
RETURNS SETOF public.profiles AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  RETURN QUERY SELECT * FROM public.profiles ORDER BY display_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin RPC: get all completions (only callable by admins)
CREATE OR REPLACE FUNCTION public.get_all_completions()
RETURNS SETOF public.completions AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  RETURN QUERY SELECT * FROM public.completions;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin RPC: check if current user is admin
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get current user's profile
CREATE OR REPLACE FUNCTION public.get_my_profile()
RETURNS SETOF public.profiles AS $$
BEGIN
  RETURN QUERY SELECT * FROM public.profiles WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC function to get a user's own completions (bypasses RLS issues)
CREATE OR REPLACE FUNCTION public.get_my_completions()
RETURNS SETOF public.completions AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM public.completions
  WHERE user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

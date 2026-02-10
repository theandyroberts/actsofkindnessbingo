-- Drop old leaderboard function
DROP FUNCTION IF EXISTS public.get_leaderboard();

-- New leaderboard function that includes full completion data for scoring
CREATE OR REPLACE FUNCTION public.get_leaderboard_full()
RETURNS TABLE (
  user_id UUID,
  anonymous_id TEXT,
  square_id INT,
  is_cross_team BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.user_id,
    'Player #' || LPAD(
      CAST(
        ABS(('x' || LEFT(MD5(CAST(c.user_id AS TEXT)), 8))::BIT(32)::INT % 10000)
        AS TEXT
      ), 4, '0'
    ) AS anonymous_id,
    c.square_id,
    c.is_cross_team
  FROM public.completions c;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get current user's anonymous ID
CREATE OR REPLACE FUNCTION public.get_my_anonymous_id()
RETURNS TEXT AS $$
BEGIN
  RETURN 'Player #' || LPAD(
    CAST(
      ABS(('x' || LEFT(MD5(CAST(auth.uid() AS TEXT)), 8))::BIT(32)::INT % 10000)
        AS TEXT
    ), 4, '0'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

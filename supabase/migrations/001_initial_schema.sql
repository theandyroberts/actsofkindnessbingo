-- ============================================
-- Acts of Kindness Bingo - Database Schema
-- ============================================

-- Profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  email TEXT NOT NULL,
  department TEXT NOT NULL DEFAULT '',
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Squares table (static 5x5 grid)
CREATE TABLE public.squares (
  id SERIAL PRIMARY KEY,
  row INT NOT NULL CHECK (row >= 0 AND row <= 4),
  col INT NOT NULL CHECK (col >= 0 AND col <= 4),
  text TEXT NOT NULL,
  is_heart BOOLEAN NOT NULL DEFAULT FALSE,
  is_free BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE (row, col)
);

-- Completions table
CREATE TABLE public.completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  square_id INT NOT NULL REFERENCES public.squares(id) ON DELETE CASCADE,
  coworker_name TEXT NOT NULL DEFAULT '',
  is_cross_team BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, square_id)
);

-- Indexes
CREATE INDEX idx_completions_user_id ON public.completions(user_id);
CREATE INDEX idx_completions_square_id ON public.completions(square_id);

-- ============================================
-- Row Level Security
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.squares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completions ENABLE ROW LEVEL SECURITY;

-- Squares: everyone can read
CREATE POLICY "Squares are viewable by everyone"
  ON public.squares FOR SELECT
  USING (true);

-- Profiles: users can read their own profile
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Profiles: users can update their own profile (but not is_admin)
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Profiles: admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Profiles: allow insert for new user creation (via trigger)
CREATE POLICY "Allow profile creation"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Completions: users can read their own completions
CREATE POLICY "Users can view their own completions"
  ON public.completions FOR SELECT
  USING (auth.uid() = user_id);

-- Completions: users can insert their own completions
CREATE POLICY "Users can insert their own completions"
  ON public.completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Completions: users can delete their own completions
CREATE POLICY "Users can delete their own completions"
  ON public.completions FOR DELETE
  USING (auth.uid() = user_id);

-- Completions: admins can view all completions
CREATE POLICY "Admins can view all completions"
  ON public.completions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Completions: admins can delete any completion
CREATE POLICY "Admins can delete any completion"
  ON public.completions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- ============================================
-- Trigger: auto-create profile on signup
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, email, department)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', ''),
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'department', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Function: get leaderboard (anonymous)
-- ============================================

CREATE OR REPLACE FUNCTION public.get_leaderboard()
RETURNS TABLE (
  user_id UUID,
  anonymous_id TEXT,
  total_completions BIGINT,
  cross_team_count BIGINT
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
    COUNT(*) AS total_completions,
    COUNT(*) FILTER (WHERE c.is_cross_team = TRUE) AS cross_team_count
  FROM public.completions c
  GROUP BY c.user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Seed: 25 bingo squares
-- ============================================

INSERT INTO public.squares (id, row, col, text, is_heart, is_free) VALUES
  (1,  0, 0, 'Write a thank-you note', FALSE, FALSE),
  (2,  0, 1, 'Give a genuine compliment', TRUE, FALSE),
  (3,  0, 2, 'Offer help on a task', FALSE, FALSE),
  (4,  0, 3, 'Recognize a teammate publicly', TRUE, FALSE),
  (5,  0, 4, 'Share useful resources', FALSE, FALSE),
  (6,  1, 0, 'Listen without interrupting', FALSE, FALSE),
  (7,  1, 1, 'Bring coffee or tea for someone', TRUE, FALSE),
  (8,  1, 2, 'Send a positive message', TRUE, FALSE),
  (9,  1, 3, 'Celebrate a small win', TRUE, FALSE),
  (10, 1, 4, 'Ask someone how they''re doing', FALSE, FALSE),
  (11, 2, 0, 'Help onboard someone new', FALSE, FALSE),
  (12, 2, 1, 'Express appreciation in a meeting', TRUE, FALSE),
  (13, 2, 2, 'FREE SPACE', TRUE, TRUE),
  (14, 2, 3, 'Be patient in a stressful moment', TRUE, FALSE),
  (15, 2, 4, 'Encourage a teammate', FALSE, FALSE),
  (16, 3, 0, 'Offer flexible support', FALSE, FALSE),
  (17, 3, 1, 'Clean up a shared space', TRUE, FALSE),
  (18, 3, 2, 'Respect a different perspective', TRUE, FALSE),
  (19, 3, 3, 'Check in on workload balance', TRUE, FALSE),
  (20, 3, 4, 'Thank someone for their time', FALSE, FALSE),
  (21, 4, 0, 'Share credit for success', FALSE, FALSE),
  (22, 4, 1, 'Offer constructive feedback kindly', TRUE, FALSE),
  (23, 4, 2, 'Include someone in a conversation', FALSE, FALSE),
  (24, 4, 3, 'Share a learning opportunity', TRUE, FALSE),
  (25, 4, 4, 'End the day with gratitude', FALSE, FALSE);

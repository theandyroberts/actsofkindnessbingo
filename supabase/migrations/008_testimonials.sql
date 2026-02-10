-- Testimonials table
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT false,
  paraphrase TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RPC: submit a testimonial for the current user
CREATE OR REPLACE FUNCTION public.submit_my_testimonial(
  p_message TEXT,
  p_is_anonymous BOOLEAN
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO testimonials (user_id, message, is_anonymous)
  VALUES (auth.uid(), p_message, p_is_anonymous);
END;
$$;

-- RPC: get all testimonials (admin only), joins profiles for display_name + anonymous_id
CREATE OR REPLACE FUNCTION public.get_all_testimonials()
RETURNS TABLE (
  id UUID,
  user_id UUID,
  display_name TEXT,
  anonymous_id TEXT,
  message TEXT,
  is_anonymous BOOLEAN,
  paraphrase TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND is_admin = TRUE) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  RETURN QUERY
  SELECT
    t.id,
    t.user_id,
    p.display_name,
    'Player #' || LPAD(
      CAST(
        ABS(('x' || LEFT(MD5(CAST(t.user_id AS TEXT)), 8))::BIT(32)::INT % 10000)
        AS TEXT
      ), 4, '0'
    ) AS anonymous_id,
    t.message,
    t.is_anonymous,
    t.paraphrase,
    t.created_at
  FROM testimonials t
  JOIN profiles p ON p.id = t.user_id
  ORDER BY t.created_at DESC;
END;
$$;

-- RPC: update testimonial paraphrase (admin only)
CREATE OR REPLACE FUNCTION public.update_testimonial_paraphrase(
  p_id UUID,
  p_paraphrase TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND is_admin = TRUE) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  UPDATE testimonials SET paraphrase = p_paraphrase WHERE id = p_id;
END;
$$;

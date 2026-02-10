-- Fix heart square flags
-- Heart pattern should be: (0,1), (0,3), (1,1), (1,2), (1,3), (2,1), (2,2), (2,3), (3,1), (3,2), (3,3), (4,1), (4,3)

-- First, set all to NOT heart
UPDATE public.squares SET is_heart = FALSE;

-- Then set the correct heart squares
UPDATE public.squares SET is_heart = TRUE WHERE (row, col) IN (
  (0, 1), (0, 3),
  (1, 1), (1, 2), (1, 3),
  (2, 1), (2, 2), (2, 3),
  (3, 1), (3, 2), (3, 3),
  (4, 1), (4, 3)
);

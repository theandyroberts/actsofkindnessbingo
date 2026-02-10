-- Fix heart pattern to proper heart shape:
-- .  ♥  .  ♥  .
-- ♥  ♥  ♥  ♥  ♥
-- ♥  ♥  ♥  ♥  ♥
-- .  ♥  ♥  ♥  .
-- .  .  ♥  .  .

UPDATE public.squares SET is_heart = FALSE;

UPDATE public.squares SET is_heart = TRUE WHERE (row, col) IN (
  (0, 1), (0, 3),
  (1, 0), (1, 1), (1, 2), (1, 3), (1, 4),
  (2, 0), (2, 1), (2, 2), (2, 3), (2, 4),
  (3, 1), (3, 2), (3, 3),
  (4, 2)
);

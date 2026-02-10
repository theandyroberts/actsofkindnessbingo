-- RPC to update a user's own completion (coworker name, cross-team flag)
CREATE OR REPLACE FUNCTION update_my_completion(
  p_square_id int,
  p_coworker_name text,
  p_is_cross_team boolean
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE completions
  SET coworker_name = p_coworker_name,
      is_cross_team = p_is_cross_team
  WHERE user_id = auth.uid()
    AND square_id = p_square_id;
END;
$$;

-- RPC to delete a user's own completion
CREATE OR REPLACE FUNCTION delete_my_completion(p_square_id int)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Don't allow deleting free space (square 13)
  IF p_square_id = 13 THEN
    RAISE EXCEPTION 'Cannot remove the free space';
  END IF;

  DELETE FROM completions
  WHERE user_id = auth.uid()
    AND square_id = p_square_id;
END;
$$;

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function completeSquare(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const squareId = Number(formData.get("squareId"));
  const coworkerName = (formData.get("coworkerName") as string) || "";
  const isCrossTeam = formData.get("isCrossTeam") === "true";

  if (!squareId || squareId < 1 || squareId > 25) {
    return { error: "Invalid square" };
  }

  const { error } = await supabase.from("completions").insert({
    user_id: user.id,
    square_id: squareId,
    coworker_name: coworkerName,
    is_cross_team: isCrossTeam,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "You already completed this square" };
    }
    return { error: error.message };
  }

  revalidatePath("/board");
  return { success: true };
}

export async function updateCompletion(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const squareId = Number(formData.get("squareId"));
  const coworkerName = (formData.get("coworkerName") as string) || "";
  const isCrossTeam = formData.get("isCrossTeam") === "true";

  if (!squareId || squareId < 1 || squareId > 25) {
    return { error: "Invalid square" };
  }

  const { error } = await supabase
    .from("completions")
    .update({
      coworker_name: coworkerName,
      is_cross_team: isCrossTeam,
    })
    .eq("user_id", user.id)
    .eq("square_id", squareId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/board");
  return { success: true };
}

export async function deleteOwnCompletion(squareId: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  if (!squareId || squareId < 1 || squareId > 25) {
    return { error: "Invalid square" };
  }

  // Don't allow deleting the free space
  if (squareId === 13) {
    return { error: "Cannot remove the free space" };
  }

  const { error } = await supabase
    .from("completions")
    .delete()
    .eq("user_id", user.id)
    .eq("square_id", squareId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/board");
  return { success: true };
}

export async function ensureFreeSpace() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  // Check if free space already completed
  const { data: existing } = await supabase
    .from("completions")
    .select("id")
    .eq("user_id", user.id)
    .eq("square_id", 13)
    .single();

  if (!existing) {
    await supabase.from("completions").insert({
      user_id: user.id,
      square_id: 13,
      coworker_name: "Free Space",
      is_cross_team: false,
    });
  }
}

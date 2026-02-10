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

  const { error } = await supabase.rpc("update_my_completion", {
    p_square_id: squareId,
    p_coworker_name: coworkerName,
    p_is_cross_team: isCrossTeam,
  });

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

  const { error } = await supabase.rpc("delete_my_completion", {
    p_square_id: squareId,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/board");
  return { success: true };
}

export async function submitTestimonial(message: string, isAnonymous: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  if (!message.trim()) {
    return { error: "Message is required" };
  }

  const { error } = await supabase.rpc("submit_my_testimonial", {
    p_message: message.trim(),
    p_is_anonymous: isAnonymous,
  });

  if (error) {
    return { error: error.message };
  }

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

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) throw new Error("Not authorized");

  return supabase;
}

export async function toggleAdmin(userId: string) {
  const supabase = await requireAdmin();

  const { data: target } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", userId)
    .single();

  if (!target) return { error: "User not found" };

  const { error } = await supabase
    .from("profiles")
    .update({ is_admin: !target.is_admin })
    .eq("id", userId);

  if (error) return { error: error.message };

  revalidatePath("/admin");
  return { success: true };
}

export async function deleteUser(userId: string) {
  const supabase = await requireAdmin();

  // Delete completions first, then profile
  // (profile cascades from auth.users, but we'll clean completions explicitly)
  const { error: compError } = await supabase
    .from("completions")
    .delete()
    .eq("user_id", userId);

  if (compError) return { error: compError.message };

  const { error: profileError } = await supabase
    .from("profiles")
    .delete()
    .eq("id", userId);

  if (profileError) return { error: profileError.message };

  revalidatePath("/admin");
  return { success: true };
}

export async function updateParaphrase(id: string, paraphrase: string) {
  const supabase = await requireAdmin();

  const { error } = await supabase.rpc("update_testimonial_paraphrase", {
    p_id: id,
    p_paraphrase: paraphrase,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin");
  return { success: true };
}

export async function deleteCompletion(completionId: string) {
  const supabase = await requireAdmin();

  const { error } = await supabase
    .from("completions")
    .delete()
    .eq("id", completionId);

  if (error) return { error: error.message };

  revalidatePath("/admin");
  return { success: true };
}

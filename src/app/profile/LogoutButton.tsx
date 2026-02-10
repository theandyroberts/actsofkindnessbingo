"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full py-2.5 border border-red-300 text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
    >
      Sign Out
    </button>
  );
}

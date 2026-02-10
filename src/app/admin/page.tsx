import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { calculateScore } from "@/lib/scoring";
import type { Completion, Square, Profile } from "@/lib/types";
import AdminTable from "./AdminTable";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Check admin status
  const { data: isAdmin } = await supabase.rpc("is_current_user_admin");
  if (!isAdmin) redirect("/board");

  // Fetch all data via admin RPCs
  const [profilesResult, squaresResult, completionsResult] = await Promise.all([
    supabase.rpc("get_all_profiles"),
    supabase.from("squares").select("*").order("id"),
    supabase.rpc("get_all_completions"),
  ]);

  const profiles = (profilesResult.data || []) as Profile[];
  const squares = (squaresResult.data || []) as Square[];
  const allCompletions = (completionsResult.data || []) as Completion[];

  // Calculate stats per user
  const userStats = profiles.map((p) => {
    const userCompletions = allCompletions.filter((c) => c.user_id === p.id);
    const score = calculateScore(userCompletions, squares);
    return {
      ...p,
      completionCount: userCompletions.length,
      score,
    };
  });

  // Game statistics
  const totalCompletions = allCompletions.length;
  const participationRate =
    profiles.length > 0
      ? Math.round(
          (profiles.filter((p) =>
            allCompletions.some((c) => c.user_id === p.id)
          ).length /
            profiles.length) *
            100
        )
      : 0;

  // Most popular acts
  const squareCompletionCounts = new Map<number, number>();
  for (const c of allCompletions) {
    squareCompletionCounts.set(
      c.square_id,
      (squareCompletionCounts.get(c.square_id) || 0) + 1
    );
  }
  const popularActs = squares
    .map((s) => ({
      text: s.text,
      count: squareCompletionCounts.get(s.id) || 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-pink-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-pink-600">
            Acts of Kindness Bingo
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link
              href="/board"
              className="text-gray-600 hover:text-pink-600 transition"
            >
              My Board
            </Link>
            <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-xs font-medium">
              Admin
            </span>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Admin Dashboard
        </h1>

        {/* Game Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-pink-600">
              {profiles.length}
            </div>
            <div className="text-sm text-gray-500">Total Players</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-pink-600">
              {totalCompletions}
            </div>
            <div className="text-sm text-gray-500">Total Completions</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-pink-600">
              {participationRate}%
            </div>
            <div className="text-sm text-gray-500">Participation</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-pink-600">
              {allCompletions.filter((c) => c.is_cross_team).length}
            </div>
            <div className="text-sm text-gray-500">Cross-Team Acts</div>
          </div>
        </div>

        {/* Popular Acts */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Most Popular Acts
          </h2>
          <div className="space-y-2">
            {popularActs.map((act, i) => (
              <div
                key={i}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-gray-700">{act.text}</span>
                <span className="text-pink-600 font-medium">
                  {act.count} times
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <AdminTable users={userStats} />
      </main>
    </div>
  );
}

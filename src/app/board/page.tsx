import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { calculateScore, getCompletedLines, getHeartProgress } from "@/lib/scoring";
import BingoBoard from "@/components/BingoBoard";
import { ensureFreeSpace } from "./actions";
import SecretPlayerId from "@/components/SecretPlayerId";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function BoardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Ensure free space is completed
  await ensureFreeSpace();

  // Fetch squares, completions, and profile in parallel
  const [squaresResult, completionsResult, profileResult, anonIdResult] = await Promise.all([
    supabase.from("squares").select("*").order("id"),
    supabase.rpc("get_my_completions"),
    supabase.rpc("get_my_profile").single(),
    supabase.rpc("get_my_anonymous_id"),
  ]);

  const squares = squaresResult.data || [];
  const completions = completionsResult.data || [];
  const profile = profileResult.data;
  const anonymousId = anonIdResult.data as string || "Player #????";

  const score = calculateScore(completions, squares);
  const completedLines = getCompletedLines(completions);
  const heartProgress = getHeartProgress(completions);

  // Build set of square IDs that are in completed lines
  const completedLineSquareIds = new Set<number>();
  for (const line of completedLines) {
    for (const id of line) {
      completedLineSquareIds.add(id);
    }
  }

  return (
    <div className="min-h-screen bg-pink-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-pink-600">
            Acts of Kindness Bingo
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link
              href="/leaderboard"
              className="text-gray-600 hover:text-pink-600 transition"
            >
              Leaderboard
            </Link>
            <Link
              href="/profile"
              className="text-gray-600 hover:text-pink-600 transition"
            >
              Profile
            </Link>
            {profile?.is_admin && (
              <Link
                href="/admin"
                className="text-gray-600 hover:text-pink-600 transition"
              >
                Admin
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Score summary */}
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Your Board
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Hi, {profile?.display_name || "Player"}! Click a square to mark it complete.
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Your ID: <SecretPlayerId anonymousId={anonymousId} />
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl sm:text-4xl font-bold text-pink-600">
                {score.total}
              </div>
              <div className="text-sm text-gray-500">total points</div>
            </div>
          </div>

          {/* Score breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
            <div className="bg-pink-50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-pink-600">
                {completions.length}/25
              </div>
              <div className="text-xs text-gray-500">Squares</div>
            </div>
            <div className="bg-pink-50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-pink-600">
                {score.basePoints}
              </div>
              <div className="text-xs text-gray-500">Base Pts</div>
            </div>
            <div className="bg-pink-50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-pink-600">
                {score.bingoLineCount}
              </div>
              <div className="text-xs text-gray-500">Bingo Lines</div>
            </div>
            <div className="bg-pink-50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-pink-600">
                {heartProgress.completed}/{heartProgress.total}
              </div>
              <div className="text-xs text-gray-500">Heart</div>
            </div>
            <div className="bg-pink-50 rounded-lg p-3 text-center col-span-2 sm:col-span-1">
              <div className="text-lg font-bold text-pink-600">
                {score.blackoutBonus > 0 ? "Yes!" : `${completions.length}/25`}
              </div>
              <div className="text-xs text-gray-500">Blackout</div>
            </div>
          </div>
        </div>

        {/* Bingo board */}
        <BingoBoard
          squares={squares}
          completions={completions}
          completedLineSquareIds={completedLineSquareIds}
        />

        {/* Legend */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm p-4 text-sm text-gray-600">
          <h3 className="font-semibold text-gray-900 mb-2">How Scoring Works</h3>
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span>Complete a square (same team)</span>
              <span className="font-semibold text-pink-600">1 pt</span>
            </div>
            <div className="flex justify-between">
              <span>Complete a square (cross-team)</span>
              <span className="font-semibold text-pink-600">2 pts</span>
            </div>
            <div className="flex justify-between">
              <span>First bingo line (row, column, or diagonal)</span>
              <span className="font-semibold text-pink-600">10 pts</span>
            </div>
            <div className="flex justify-between">
              <span>Each additional bingo line</span>
              <span className="font-semibold text-pink-600">20 pts</span>
            </div>
            <div className="flex justify-between">
              <span>Fill in the pink heart</span>
              <span className="font-semibold text-pink-600">50 pts</span>
            </div>
            <div className="flex justify-between">
              <span>Pink out (whole board)</span>
              <span className="font-semibold text-pink-600">100 pts</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

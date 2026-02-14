import { createClient } from "@/lib/supabase/server";
import { calculateScore } from "@/lib/scoring";
import type { Completion, Square, ScoreBreakdown } from "@/lib/types";
import CountdownTimer from "@/components/CountdownTimer";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface LeaderboardRow {
  user_id: string;
  anonymous_id: string;
  square_id: number;
  is_cross_team: boolean;
}

interface LeaderboardEntry {
  anonymous_id: string;
  completionCount: number;
  score: ScoreBreakdown;
  completedSquareIds: Set<number>;
}

export default async function LeaderboardPage() {
  const supabase = await createClient();

  const [squaresResult, lbResult] = await Promise.all([
    supabase.from("squares").select("*").order("id"),
    supabase.rpc("get_leaderboard_full"),
  ]);

  const squares = (squaresResult.data || []) as Square[];
  const rows = (lbResult.data || []) as LeaderboardRow[];

  // Group completions by user and calculate scores
  const userMap = new Map<
    string,
    { anonymous_id: string; completions: Completion[] }
  >();

  for (const row of rows) {
    if (!userMap.has(row.user_id)) {
      userMap.set(row.user_id, {
        anonymous_id: row.anonymous_id,
        completions: [],
      });
    }
    userMap.get(row.user_id)!.completions.push({
      id: "",
      user_id: row.user_id,
      square_id: row.square_id,
      coworker_name: "",
      is_cross_team: row.is_cross_team,
      completed_at: "",
    });
  }

  const entries: LeaderboardEntry[] = [];
  for (const [, userData] of userMap) {
    const score = calculateScore(userData.completions, squares);
    entries.push({
      anonymous_id: userData.anonymous_id,
      completionCount: userData.completions.length,
      score,
      completedSquareIds: new Set(userData.completions.map((c) => c.square_id)),
    });
  }

  entries.sort((a, b) => b.score.total - a.score.total);

  // Heatmap: count completions per square
  const squareCompletionCounts = new Map<number, number>();
  for (const row of rows) {
    squareCompletionCounts.set(
      row.square_id,
      (squareCompletionCounts.get(row.square_id) || 0) + 1
    );
  }
  const totalPlayers = userMap.size;

  // Continuous heatmap color: light pink → dark cherry (almost black)
  const lightColor = { r: 252, g: 231, b: 243 }; // soft pink
  const darkColor = { r: 38, g: 2, b: 14 };      // dark dark cherry
  function getHeatmapBg(ratio: number): string {
    const r = Math.round(lightColor.r + (darkColor.r - lightColor.r) * ratio);
    const g = Math.round(lightColor.g + (darkColor.g - lightColor.g) * ratio);
    const b = Math.round(lightColor.b + (darkColor.b - lightColor.b) * ratio);
    return `rgb(${r}, ${g}, ${b})`;
  }

  // Sort squares into grid order
  const sortedSquares = [...squares].sort(
    (a, b) => a.row * 5 + a.col - (b.row * 5 + b.col)
  );

  return (
    <div className="min-h-screen bg-pink-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
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
            <Link
              href="/about"
              className="text-gray-600 hover:text-pink-600 transition"
            >
              About
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Leaderboard
          </h1>
          <p className="text-gray-500 mb-6">Time remaining</p>
          <CountdownTimer />
        </div>

        {/* Heatmap */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Kindness Heatmap
          </h2>
          <p className="text-sm text-gray-500 text-center mb-4">
            Which acts are spreading the most?
          </p>
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2 max-w-2xl mx-auto">
            {sortedSquares.map((square) => {
              const count = squareCompletionCounts.get(square.id) || 0;
              const ratio = totalPlayers > 0 ? count / totalPlayers : 0;
              const useWhiteText = ratio > 0.25;

              return (
                <div
                  key={square.id}
                  className="aspect-square p-1 sm:p-2 rounded-lg text-xs font-medium flex flex-col items-center justify-center text-center border border-pink-200 transition-colors"
                  style={{
                    backgroundColor: count === 0 ? "#fff" : getHeatmapBg(ratio),
                    color: useWhiteText ? "#ffffff" : "#4a3040",
                  }}
                >
                  <span className="leading-tight text-[10px] sm:text-xs">
                    {square.is_free ? "FREE" : square.text}
                  </span>
                  <span
                    className="text-[10px] mt-0.5 font-bold"
                    style={{
                      color: useWhiteText ? "rgba(255,255,255,0.85)" : "#db2777",
                    }}
                  >
                    {count}/{totalPlayers}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-6 text-center text-sm text-gray-500">
          Identities are anonymous. Only you can see your own name.
        </div>

        <div className="space-y-3">
          {entries.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center text-gray-500">
              No players yet. Be the first to score!
            </div>
          ) : (
            entries.map((entry, i) => (
              <div
                key={entry.anonymous_id}
                className={`bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4 ${
                  i < 3 ? "ring-1 ring-pink-200" : ""
                }`}
              >
                <span
                  className={`flex-shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold ${
                    i === 0
                      ? "bg-yellow-400 text-yellow-900"
                      : i === 1
                      ? "bg-gray-300 text-gray-700"
                      : i === 2
                      ? "bg-orange-300 text-orange-900"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {i + 1}
                </span>
                <div className="flex-shrink-0 grid grid-cols-5 gap-px leading-none" title={`${entry.completionCount}/25 squares`}>
                  {sortedSquares.map((sq) => (
                    <span key={sq.id} className="text-[10px] sm:text-xs">
                      {entry.completedSquareIds.has(sq.id) ? "💗" : "◻️"}
                    </span>
                  ))}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 text-sm truncate">
                    {entry.anonymous_id}
                  </div>
                  <div className="text-xs text-gray-400">
                    {entry.completionCount}/25 squares
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="text-lg font-bold text-pink-600">
                    {entry.score.total}
                  </div>
                  <div className="text-xs text-gray-400">pts</div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

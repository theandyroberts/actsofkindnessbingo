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
  const maxCount = Math.max(1, ...squareCompletionCounts.values());
  const totalPlayers = userMap.size;

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

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {entries.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No players yet. Be the first to score!
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-sm text-gray-500">
                  <th className="px-4 py-3 font-medium">Rank</th>
                  <th className="px-4 py-3 font-medium">Player</th>
                  <th className="px-4 py-3 font-medium text-center">
                    Squares
                  </th>
                  <th className="px-4 py-3 font-medium text-right">Points</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, i) => (
                  <tr
                    key={entry.anonymous_id}
                    className={`border-t border-gray-100 ${
                      i < 3 ? "bg-pink-50/50" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
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
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {entry.anonymous_id}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">
                      {entry.completionCount}/25
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-lg font-bold text-pink-600">
                        {entry.score.total}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          Identities are anonymous. Only you can see your own name.
        </div>

        {/* Heatmap */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Kindness Heatmap
          </h2>
          <p className="text-sm text-gray-500 text-center mb-4">
            Which acts are spreading the most?
          </p>
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2 max-w-2xl mx-auto">
            {sortedSquares.map((square) => {
              const count = squareCompletionCounts.get(square.id) || 0;
              const intensity = maxCount > 0 ? count / maxCount : 0;
              // Map intensity to pink shades: 0 = white, 1 = deep pink
              const bg =
                count === 0
                  ? "bg-white"
                  : intensity < 0.25
                  ? "bg-pink-100"
                  : intensity < 0.5
                  ? "bg-pink-200"
                  : intensity < 0.75
                  ? "bg-pink-300"
                  : "bg-pink-400";
              const textColor =
                intensity >= 0.75 ? "text-white" : intensity >= 0.5 ? "text-pink-900" : "text-gray-700";

              return (
                <div
                  key={square.id}
                  className={`
                    aspect-square p-1 sm:p-2 rounded-lg text-xs font-medium
                    flex flex-col items-center justify-center text-center
                    border border-pink-200 transition-colors
                    ${bg} ${textColor}
                  `}
                >
                  <span className="leading-tight text-[10px] sm:text-xs">
                    {square.is_free ? "FREE" : square.text}
                  </span>
                  <span
                    className={`text-[10px] mt-0.5 font-bold ${
                      intensity >= 0.75
                        ? "text-white/80"
                        : "text-pink-500"
                    }`}
                  >
                    {count}/{totalPlayers}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

import type { Completion, Square, ScoreBreakdown } from "./types";

// All 12 possible bingo lines: 5 rows, 5 cols, 2 diagonals
const BINGO_LINES: number[][] = [
  // Rows (by square IDs: row*5 + col + 1)
  [1, 2, 3, 4, 5],       // row 0
  [6, 7, 8, 9, 10],      // row 1
  [11, 12, 13, 14, 15],   // row 2
  [16, 17, 18, 19, 20],   // row 3
  [21, 22, 23, 24, 25],   // row 4
  // Columns
  [1, 6, 11, 16, 21],     // col 0
  [2, 7, 12, 17, 22],     // col 1
  [3, 8, 13, 18, 23],     // col 2
  [4, 9, 14, 19, 24],     // col 3
  [5, 10, 15, 20, 25],    // col 4
  // Diagonals
  [1, 7, 13, 19, 25],     // top-left to bottom-right
  [5, 9, 13, 17, 21],     // top-right to bottom-left
];

// Heart pattern (16 squares):
// .  ♥  .  ♥  .
// ♥  ♥  ♥  ♥  ♥
// ♥  ♥  ♥  ♥  ♥
// .  ♥  ♥  ♥  .
// .  .  ♥  .  .
const HEART_SQUARE_IDS = [2, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18, 19, 23];

export function calculateScore(
  completions: Completion[],
  squares: Square[]
): ScoreBreakdown {
  const completedIds = new Set(completions.map((c) => c.square_id));

  // Base points: 1 per same-team, 2 per cross-team
  const basePoints = completions.reduce(
    (sum, c) => sum + (c.is_cross_team ? 2 : 1),
    0
  );

  // Bingo lines: first line = 10 pts, each additional = 20 pts
  let bingoLineCount = 0;
  for (const line of BINGO_LINES) {
    if (line.every((id) => completedIds.has(id))) {
      bingoLineCount++;
    }
  }
  const bingoLines = bingoLineCount === 0
    ? 0
    : 10 + (bingoLineCount - 1) * 20;

  // Heart bonus: 50 points if all 13 heart squares completed
  const heartBonus = HEART_SQUARE_IDS.every((id) => completedIds.has(id))
    ? 50
    : 0;

  // Blackout bonus: 100 points if all 25 squares completed
  const blackoutBonus = completedIds.size === 25 ? 100 : 0;

  return {
    basePoints,
    bingoLines,
    bingoLineCount,
    heartBonus,
    blackoutBonus,
    total: basePoints + bingoLines + heartBonus + blackoutBonus,
  };
}

export function getCompletedLines(completions: Completion[]): number[][] {
  const completedIds = new Set(completions.map((c) => c.square_id));
  return BINGO_LINES.filter((line) =>
    line.every((id) => completedIds.has(id))
  );
}

export function getHeartProgress(completions: Completion[]): {
  completed: number;
  total: number;
} {
  const completedIds = new Set(completions.map((c) => c.square_id));
  const completed = HEART_SQUARE_IDS.filter((id) =>
    completedIds.has(id)
  ).length;
  return { completed, total: HEART_SQUARE_IDS.length };
}

export { BINGO_LINES, HEART_SQUARE_IDS };

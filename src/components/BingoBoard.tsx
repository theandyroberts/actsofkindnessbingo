"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Square, Completion } from "@/lib/types";
import CompletionModal from "./CompletionModal";
import EditCompletionModal from "./EditCompletionModal";

interface BingoBoardProps {
  squares: Square[];
  completions: Completion[];
  completedLineSquareIds: Set<number>;
}

export default function BingoBoard({
  squares,
  completions,
  completedLineSquareIds,
}: BingoBoardProps) {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [editingSquare, setEditingSquare] = useState<Square | null>(null);
  const router = useRouter();

  const completionMap = new Map(completions.map((c) => [c.square_id, c]));

  // Sort squares into 5x5 grid order
  const sortedSquares = [...squares].sort(
    (a, b) => a.row * 5 + a.col - (b.row * 5 + b.col)
  );

  function handleSquareClick(square: Square) {
    if (square.is_free) return;
    const completion = completionMap.get(square.id);
    if (completion) {
      setEditingSquare(square);
    } else {
      setSelectedSquare(square);
    }
  }

  return (
    <>
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2 max-w-2xl mx-auto">
        {sortedSquares.map((square) => {
          const completion = completionMap.get(square.id);
          const isCompleted = !!completion;
          const isInCompletedLine = completedLineSquareIds.has(square.id);

          return (
            <button
              key={square.id}
              onClick={() => handleSquareClick(square)}
              disabled={square.is_free}
              className={`
                relative aspect-square p-1 sm:p-2 rounded-lg text-xs sm:text-sm font-medium
                flex flex-col items-center justify-center text-center
                transition-all duration-200
                ${
                  isCompleted
                    ? square.is_heart
                      ? "bg-pink-400 text-white shadow-inner hover:brightness-110 cursor-pointer"
                      : "bg-teal-500 text-white shadow-inner hover:brightness-110 cursor-pointer"
                    : square.is_heart
                    ? "bg-pink-100 hover:bg-pink-200 text-pink-800 border-2 border-pink-300 hover:shadow-md cursor-pointer"
                    : "bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:shadow-md cursor-pointer"
                }
                ${square.is_free ? "bg-pink-400 text-white cursor-default" : ""}
                ${isInCompletedLine && isCompleted ? "ring-2 ring-yellow-400 ring-offset-1" : ""}
              `}
            >
              {isCompleted && (
                <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 text-base sm:text-lg">
                  {completion?.is_cross_team ? "✓✓" : "✓"}
                </span>
              )}
              <span className="leading-tight">{square.text}</span>
              {isCompleted && completion && !square.is_free && (
                <span className="text-[10px] sm:text-xs mt-0.5 opacity-80 truncate w-full">
                  w/ {completion.coworker_name}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {selectedSquare && (
        <CompletionModal
          square={selectedSquare}
          onClose={() => setSelectedSquare(null)}
          onComplete={() => {
            setSelectedSquare(null);
            router.refresh();
          }}
        />
      )}

      {editingSquare && completionMap.get(editingSquare.id) && (
        <EditCompletionModal
          square={editingSquare}
          completion={completionMap.get(editingSquare.id)!}
          onClose={() => setEditingSquare(null)}
          onSaved={() => {
            setEditingSquare(null);
            router.refresh();
          }}
        />
      )}
    </>
  );
}

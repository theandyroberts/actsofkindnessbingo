"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import type { Square } from "@/lib/types";
import { completeSquare } from "@/app/board/actions";

interface CompletionModalProps {
  square: Square;
  onClose: () => void;
  onComplete: () => void;
}

function fireConfetti() {
  // Pink and gold burst from both sides
  const colors = ["#ec4899", "#f9a8d4", "#fbbf24", "#f472b6", "#ffffff"];

  confetti({
    particleCount: 80,
    spread: 70,
    origin: { x: 0.3, y: 0.6 },
    colors,
  });
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { x: 0.7, y: 0.6 },
    colors,
  });

  // Follow-up burst from center
  setTimeout(() => {
    confetti({
      particleCount: 50,
      spread: 100,
      origin: { x: 0.5, y: 0.5 },
      colors,
    });
  }, 200);
}

export default function CompletionModal({
  square,
  onClose,
  onComplete,
}: CompletionModalProps) {
  const [coworkerName, setCoworkerName] = useState("");
  const [isCrossTeam, setIsCrossTeam] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.set("squareId", String(square.id));
    formData.set("coworkerName", coworkerName);
    formData.set("isCrossTeam", String(isCrossTeam));

    const result = await completeSquare(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    fireConfetti();
    // Brief delay so the user sees the confetti before the modal closes
    setTimeout(() => {
      onComplete();
    }, 800);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-start mb-4">
          <div
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              square.is_heart
                ? "bg-pink-100 text-pink-700"
                : "bg-teal-100 text-teal-700"
            }`}
          >
            {square.is_heart ? "Heart Square" : "Regular Square"}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-4">{square.text}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="coworkerName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Who did you do this act of kindness with?
            </label>
            <input
              id="coworkerName"
              type="text"
              required
              value={coworkerName}
              onChange={(e) => setCoworkerName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition"
              placeholder="Coworker's name"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isCrossTeam}
              onChange={(e) => setIsCrossTeam(e.target.checked)}
              className="w-5 h-5 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
            />
            <span className="text-sm text-gray-700">
              This person is on a <strong>different team</strong> (2x points!)
            </span>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Complete!"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

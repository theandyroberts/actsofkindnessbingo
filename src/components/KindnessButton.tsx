"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { submitTestimonial } from "@/app/board/actions";

function fireConfetti() {
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

  setTimeout(() => {
    confetti({
      particleCount: 50,
      spread: 100,
      origin: { x: 0.5, y: 0.5 },
      colors,
    });
  }, 200);
}

export default function KindnessButton() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await submitTestimonial(message, isAnonymous);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setLoading(false);
    setSuccess(true);
    fireConfetti();
    setTimeout(() => {
      setOpen(false);
      setMessage("");
      setIsAnonymous(false);
      setSuccess(false);
    }, 2500);
  }

  function handleCancel() {
    setOpen(false);
    setMessage("");
    setIsAnonymous(false);
    setError("");
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-pink-500 hover:bg-pink-600 text-white px-5 py-3 rounded-full shadow-lg transition font-semibold text-sm"
      >
        Receive some Kindness?
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-pink-900/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
        {success ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-3">💗</div>
            <p className="text-2xl text-pink-600 font-bold">Thank you for sharing!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <h3 className="text-2xl font-bold text-gray-900">
              Receive some Kindness?
            </h3>
            <p className="text-base text-gray-500">
              Tell us about a kindness you received and how it made you feel.
            </p>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-base">
                {error}
              </div>
            )}

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={4}
              placeholder="What happened and how did it make you feel?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition resize-none"
            />

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-5 h-5 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
              />
              <span className="text-base text-gray-700">
                Keep my name anonymous
              </span>
            </label>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-base font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition text-base font-semibold disabled:opacity-50"
              >
                {loading ? "Sending..." : "Submit"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

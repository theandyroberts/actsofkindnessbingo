"use client";

import { useState } from "react";
import { submitTestimonial } from "@/app/board/actions";

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

    setSuccess(true);
    setTimeout(() => {
      setOpen(false);
      setMessage("");
      setIsAnonymous(false);
      setSuccess(false);
    }, 2000);
    setLoading(false);
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
    <div className="fixed bottom-6 right-6 z-40 w-80 bg-white rounded-2xl shadow-2xl p-5">
      {success ? (
        <div className="text-center py-4">
          <div className="text-3xl mb-2">💗</div>
          <p className="text-pink-600 font-semibold">Thank you for sharing!</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <h3 className="text-lg font-bold text-gray-900">
            Receive some Kindness?
          </h3>
          <p className="text-sm text-gray-500">
            Tell us about a kindness you received and how it made you feel.
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 p-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={3}
            placeholder="What happened and how did it make you feel?"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition resize-none"
          />

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
            />
            <span className="text-sm text-gray-700">
              Keep my name anonymous
            </span>
          </label>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition text-sm font-semibold disabled:opacity-50"
            >
              {loading ? "Sending..." : "Submit"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

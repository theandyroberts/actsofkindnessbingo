"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "aok-gate-passed";

// Set to true to re-enable the passphrase gate
const GATE_ENABLED = false;

export default function SiteGate({ children }: { children: React.ReactNode }) {
  const [passed, setPassed] = useState<boolean | null>(null);
  const [input, setInput] = useState("");
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (!GATE_ENABLED) {
      setPassed(true);
      return;
    }
    setPassed(localStorage.getItem(STORAGE_KEY) === "true");
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim().toLowerCase() === "gamelin") {
      localStorage.setItem(STORAGE_KEY, "true");
      setPassed(true);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }

  // Don't render anything until we've checked localStorage (prevents flash)
  if (passed === null) return null;

  if (passed) return <>{children}</>;

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center">
        <div className="text-5xl mb-4">💗</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Acts of Kindness Bingo
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Enter the passphrase to continue
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Passphrase"
            autoFocus
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition ${
              shake ? "animate-[shake_0.3s_ease-in-out]" : ""
            }`}
          />
          <button
            type="submit"
            className="w-full mt-4 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg transition"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}

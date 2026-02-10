"use client";

import { useState } from "react";

export default function SecretPlayerId({
  anonymousId,
}: {
  anonymousId: string;
}) {
  const [revealed, setRevealed] = useState(false);

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="font-semibold text-pink-500">
        {revealed ? anonymousId : "••••••••••"}
      </span>
      <button
        onMouseDown={() => setRevealed(true)}
        onMouseUp={() => setRevealed(false)}
        onMouseLeave={() => setRevealed(false)}
        onTouchStart={() => setRevealed(true)}
        onTouchEnd={() => setRevealed(false)}
        className="inline-flex items-center justify-center w-5 h-5 rounded bg-gray-200 hover:bg-gray-300 text-gray-500 text-xs transition select-none"
        title="Hold to reveal your Player ID"
      >
        {revealed ? "🔓" : "🔒"}
      </button>
    </span>
  );
}

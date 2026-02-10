"use client";

import { useState } from "react";

export default function SecretPlayerId({
  anonymousId,
}: {
  anonymousId: string;
}) {
  const [revealed, setRevealed] = useState(false);

  return (
    <span className="inline-flex items-center gap-1">
      <span className="font-semibold text-pink-500">
        {revealed ? anonymousId : "••••••••••"}
      </span>
      <button
        onMouseDown={() => setRevealed(true)}
        onMouseUp={() => setRevealed(false)}
        onMouseLeave={() => setRevealed(false)}
        onTouchStart={() => setRevealed(true)}
        onTouchEnd={() => setRevealed(false)}
        className="text-xs text-gray-400 hover:text-gray-600 bg-white px-1 rounded transition select-none"
      >
        [{revealed ? "hide" : "show"}]
      </button>
    </span>
  );
}

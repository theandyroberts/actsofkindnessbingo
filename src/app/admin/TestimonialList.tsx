"use client";

import { useState } from "react";
import type { Testimonial } from "@/lib/types";
import { updateParaphrase } from "./actions";

export default function TestimonialList({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [paraphrases, setParaphrases] = useState<Record<string, string>>(() =>
    Object.fromEntries(testimonials.map((t) => [t.id, t.paraphrase || ""]))
  );
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  async function handleSave(id: string) {
    setSaving(id);
    const result = await updateParaphrase(id, paraphrases[id]);
    setSaving(null);
    if (result.success) {
      setSaved(id);
      setTimeout(() => setSaved(null), 2000);
    }
  }

  return (
    <div className="space-y-4">
      {testimonials.map((t) => (
        <div key={t.id} className="bg-white rounded-2xl shadow-sm p-5">
          <div className="flex items-start justify-between mb-2">
            <div>
              <span className="font-medium text-gray-900">
                {t.display_name}
              </span>
              <span className="text-gray-400 mx-2">&mdash;</span>
              <span className="text-sm text-gray-500">{t.anonymous_id}</span>
              {t.is_anonymous && (
                <span className="ml-2 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-medium">
                  Anonymous
                </span>
              )}
            </div>
            <span className="text-xs text-gray-400">
              {new Date(t.created_at).toLocaleDateString()}
            </span>
          </div>

          <p className="text-gray-700 text-sm mb-3">{t.message}</p>

          <div className="border-t border-gray-100 pt-3">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Paraphrase (pull quote)
            </label>
            <textarea
              value={paraphrases[t.id] || ""}
              onChange={(e) =>
                setParaphrases((prev) => ({ ...prev, [t.id]: e.target.value }))
              }
              rows={2}
              placeholder="Write an admin paraphrase..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition resize-none"
            />
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => handleSave(t.id)}
                disabled={saving === t.id}
                className="px-3 py-1.5 bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold rounded-lg transition disabled:opacity-50"
              >
                {saving === t.id ? "Saving..." : "Save"}
              </button>
              {saved === t.id && (
                <span className="text-xs text-green-600">Saved!</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

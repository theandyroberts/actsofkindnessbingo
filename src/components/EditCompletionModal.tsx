"use client";

import { useState } from "react";
import type { Square, Completion } from "@/lib/types";
import { updateCompletion, deleteOwnCompletion } from "@/app/board/actions";

interface EditCompletionModalProps {
  square: Square;
  completion: Completion;
  onClose: () => void;
  onSaved: () => void;
}

export default function EditCompletionModal({
  square,
  completion,
  onClose,
  onSaved,
}: EditCompletionModalProps) {
  const [coworkerName, setCoworkerName] = useState(completion.coworker_name);
  const [isCrossTeam, setIsCrossTeam] = useState(completion.is_cross_team);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.set("squareId", String(square.id));
    formData.set("coworkerName", coworkerName);
    formData.set("isCrossTeam", String(isCrossTeam));

    const result = await updateCompletion(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    onSaved();
  }

  async function handleDelete() {
    setError("");
    setLoading(true);

    const result = await deleteOwnCompletion(square.id);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    onSaved();
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
            Edit Completion
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-4">{square.text}</h2>

        <form onSubmit={handleSave} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="editCoworkerName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Coworker&apos;s name
            </label>
            <input
              id="editCoworkerName"
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
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {/* Delete section */}
          <div className="pt-3 border-t border-gray-100">
            {!confirmDelete ? (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="text-sm text-gray-400 hover:text-red-500 transition"
              >
                Remove this completion
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-sm text-red-600">Are you sure?</span>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className="text-sm px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                >
                  {loading ? "Removing..." : "Yes, remove"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="text-sm text-gray-500 hover:text-gray-700 transition"
                >
                  No, keep it
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

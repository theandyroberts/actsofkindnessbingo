"use client";

import { useState } from "react";
import { updateDepartment } from "./actions";

interface ProfileFormProps {
  currentDepartment: string;
  displayName: string;
}

export default function ProfileForm({
  currentDepartment,
  displayName,
}: ProfileFormProps) {
  const [department, setDepartment] = useState(currentDepartment);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    const formData = new FormData();
    formData.set("department", department);

    await updateDepartment(formData);

    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name
        </label>
        <input
          type="text"
          value={displayName}
          disabled
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
        />
      </div>

      <div>
        <label
          htmlFor="department"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Department / Team
        </label>
        <input
          id="department"
          type="text"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save"}
        </button>
        {saved && (
          <span className="text-green-600 text-sm font-medium">Saved!</span>
        )}
      </div>
    </form>
  );
}

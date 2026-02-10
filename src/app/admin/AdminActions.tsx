"use client";

import { useState } from "react";
import { toggleAdmin, deleteUser } from "./actions";

interface AdminActionsProps {
  userId: string;
  userName: string;
  isAdmin: boolean;
}

export default function AdminActions({
  userId,
  userName,
  isAdmin,
}: AdminActionsProps) {
  const [loading, setLoading] = useState(false);

  async function handleToggleAdmin() {
    if (
      !confirm(
        `${isAdmin ? "Remove" : "Grant"} admin access for ${userName}?`
      )
    )
      return;
    setLoading(true);
    await toggleAdmin(userId);
    setLoading(false);
  }

  async function handleDeleteUser() {
    if (
      !confirm(
        `Are you sure you want to delete ${userName}? This will remove all their data.`
      )
    )
      return;
    setLoading(true);
    await deleteUser(userId);
    setLoading(false);
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={handleToggleAdmin}
        disabled={loading}
        className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition disabled:opacity-50"
      >
        {isAdmin ? "Remove Admin" : "Make Admin"}
      </button>
      <button
        onClick={handleDeleteUser}
        disabled={loading}
        className="text-xs px-2 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100 transition disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}

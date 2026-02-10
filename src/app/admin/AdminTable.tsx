"use client";

import { useState } from "react";
import type { ScoreBreakdown } from "@/lib/types";
import AdminActions from "./AdminActions";

interface UserStat {
  id: string;
  display_name: string;
  email: string;
  department: string;
  is_admin: boolean;
  completionCount: number;
  score: ScoreBreakdown;
}

type SortKey = "name" | "points" | "squares";
type SortDir = "asc" | "desc";

export default function AdminTable({ users }: { users: UserStat[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("points");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir(key === "name" ? "asc" : "desc");
    }
  }

  const sorted = [...users].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "name") {
      cmp = a.display_name.localeCompare(b.display_name);
    } else if (sortKey === "points") {
      cmp = a.score.total - b.score.total;
    } else if (sortKey === "squares") {
      cmp = a.completionCount - b.completionCount;
    }
    return sortDir === "asc" ? cmp : -cmp;
  });

  const arrow = (key: SortKey) =>
    sortKey === key ? (sortDir === "asc" ? " ↑" : " ↓") : "";

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">All Players</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left text-sm text-gray-500">
              <th
                className="px-4 py-3 font-medium cursor-pointer hover:text-pink-600 transition select-none"
                onClick={() => handleSort("name")}
              >
                Name{arrow("name")}
              </th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Department</th>
              <th
                className="px-4 py-3 font-medium text-center cursor-pointer hover:text-pink-600 transition select-none"
                onClick={() => handleSort("squares")}
              >
                Squares{arrow("squares")}
              </th>
              <th
                className="px-4 py-3 font-medium text-right cursor-pointer hover:text-pink-600 transition select-none"
                onClick={() => handleSort("points")}
              >
                Points{arrow("points")}
              </th>
              <th className="px-4 py-3 font-medium text-center">Admin</th>
              <th className="px-4 py-3 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((u) => (
              <tr key={u.id} className="border-t border-gray-100">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {u.display_name}
                </td>
                <td className="px-4 py-3 text-gray-600 text-sm">{u.email}</td>
                <td className="px-4 py-3 text-gray-600 text-sm">
                  {u.department}
                </td>
                <td className="px-4 py-3 text-center text-gray-600">
                  {u.completionCount}/25
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="font-bold text-pink-600">
                    {u.score.total}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {u.is_admin ? (
                    <span className="bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full text-xs">
                      Admin
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <AdminActions
                    userId={u.id}
                    userName={u.display_name}
                    isAdmin={u.is_admin}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

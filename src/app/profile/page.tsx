import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { calculateScore, getHeartProgress } from "@/lib/scoring";
import type { Square, Completion, Profile } from "@/lib/types";
import ProfileForm from "./ProfileForm";
import LogoutButton from "./LogoutButton";
import SecretPlayerId from "@/components/SecretPlayerId";
import Link from "next/link";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [profileResult, squaresResult, completionsResult, anonIdResult] = await Promise.all([
    supabase.rpc("get_my_profile").single(),
    supabase.from("squares").select("*").order("id"),
    supabase.rpc("get_my_completions"),
    supabase.rpc("get_my_anonymous_id"),
  ]);

  const profile = profileResult.data as Profile | null;
  const squares = (squaresResult.data || []) as Square[];
  const completions = (completionsResult.data || []) as Completion[];
  const anonymousId = anonIdResult.data as string || "Player #????";

  if (!profile) redirect("/login");

  const score = calculateScore(completions, squares);
  const heartProgress = getHeartProgress(completions);

  return (
    <div className="min-h-screen bg-pink-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-pink-600">
            Acts of Kindness Bingo
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link
              href="/board"
              className="text-gray-600 hover:text-pink-600 transition"
            >
              My Board
            </Link>
            <Link
              href="/leaderboard"
              className="text-gray-600 hover:text-pink-600 transition"
            >
              Leaderboard
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Your Profile</h1>
        <p className="text-sm text-gray-500 mb-6">
          Your ID: <SecretPlayerId anonymousId={anonymousId} />
        </p>

        {/* Stats */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Your Stats
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">
                {score.total}
              </div>
              <div className="text-sm text-gray-500">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">
                {completions.length}/25
              </div>
              <div className="text-sm text-gray-500">Squares</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">
                {score.bingoLineCount}
              </div>
              <div className="text-sm text-gray-500">Bingo Lines</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">
                {heartProgress.completed}/{heartProgress.total}
              </div>
              <div className="text-sm text-gray-500">Heart</div>
            </div>
          </div>

          {/* Score breakdown */}
          <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>Base points</span>
              <span>{score.basePoints}</span>
            </div>
            <div className="flex justify-between">
              <span>Bingo line bonuses ({score.bingoLineCount} line{score.bingoLineCount !== 1 ? "s" : ""})</span>
              <span>{score.bingoLines}</span>
            </div>
            <div className="flex justify-between">
              <span>Heart bonus</span>
              <span>{score.heartBonus}</span>
            </div>
            <div className="flex justify-between">
              <span>Blackout bonus</span>
              <span>{score.blackoutBonus}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100">
              <span>Total</span>
              <span>{score.total}</span>
            </div>
          </div>
        </div>

        {/* Edit profile */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Edit Profile
          </h2>
          <ProfileForm
            currentDepartment={profile.department}
            displayName={profile.display_name}
          />
        </div>

        {/* Logout */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <LogoutButton />
        </div>
      </main>
    </div>
  );
}

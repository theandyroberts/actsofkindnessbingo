import Link from "next/link";
import CountdownTimer from "@/components/CountdownTimer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-pink-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Acts of Kindness
            <br />
            Birthday Bingo
          </h1>
          <p className="text-lg sm:text-xl text-pink-100 max-w-2xl mx-auto mb-8">
            Inspired by Mother Emilie Gamelin&apos;s legacy of compassion.
            Complete acts of kindness, connect with colleagues across teams, and
            celebrate our shared mission.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-3 bg-white text-pink-600 font-semibold rounded-lg hover:bg-pink-50 transition shadow-lg"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 bg-pink-400/30 text-white font-semibold rounded-lg hover:bg-pink-400/50 transition border border-pink-300"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Countdown */}
      <div className="max-w-4xl mx-auto px-4 -mt-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <p className="text-sm text-gray-500 mb-3 font-medium">
            TIME REMAINING
          </p>
          <CountdownTimer />
          <p className="text-sm text-gray-400 mt-3">Game ends March 13, 2026</p>
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
          How It Works
        </h2>
        <div className="grid sm:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">1</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Get Your Card
            </h3>
            <p className="text-gray-500 text-sm">
              Register to receive your 5x5 bingo card filled with acts of
              kindness you can perform for fellow caregivers.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">2</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Spread Kindness
            </h3>
            <p className="text-gray-500 text-sm">
              Complete acts of kindness and mark them on your card. Cross-team
              acts earn double points!
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">3</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Win Prizes
            </h3>
            <p className="text-gray-500 text-sm">
              Earn points for completions, bingo lines, the heart pattern, and
              blackout. Top scorers will be celebrated!
            </p>
          </div>
        </div>
      </div>

      {/* Scoring */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            Scoring
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="bg-pink-50 rounded-xl p-4 flex justify-between items-center">
              <span className="text-gray-700">Complete a square (same team)</span>
              <span className="font-bold text-pink-600">1 pt</span>
            </div>
            <div className="bg-pink-50 rounded-xl p-4 flex justify-between items-center">
              <span className="text-gray-700">Complete a square (cross-team)</span>
              <span className="font-bold text-pink-600">2 pts</span>
            </div>
            <div className="bg-pink-50 rounded-xl p-4 flex justify-between items-center">
              <span className="text-gray-700">First bingo line</span>
              <span className="font-bold text-pink-600">10 pts</span>
            </div>
            <div className="bg-pink-50 rounded-xl p-4 flex justify-between items-center">
              <span className="text-gray-700">Each additional bingo line</span>
              <span className="font-bold text-pink-600">20 pts</span>
            </div>
            <div className="bg-pink-50 rounded-xl p-4 flex justify-between items-center">
              <span className="text-gray-700">Fill in the pink heart</span>
              <span className="font-bold text-pink-600">50 pts</span>
            </div>
            <div className="bg-pink-50 rounded-xl p-4 flex justify-between items-center">
              <span className="text-gray-700">Pink out (whole board)</span>
              <span className="font-bold text-pink-600">100 pts</span>
            </div>
          </div>
          <p className="text-center text-sm text-gray-400 mt-4">
            All points are cumulative
          </p>
        </div>
      </div>

      {/* Mother Gamelin */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Inspired by Mother Emilie Gamelin
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Mother Emilie Gamelin (1800–1851) dedicated her life to serving the
            poor, sick, and marginalized in Montreal. She founded the Sisters of
            Providence, whose mission of compassion and charity continues to
            inspire Providence Health Systems today. This game honors her legacy
            by encouraging us to perform small acts of kindness in our daily
            work.
          </p>
          <Link
            href="/about"
            className="text-pink-600 hover:text-pink-700 font-medium"
          >
            Read more about Mother Gamelin &rarr;
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-gray-400">
          <p>
            Acts of Kindness Birthday Bingo &mdash; Providence Health Systems
          </p>
          <div className="flex justify-center gap-4 mt-2">
            <Link href="/leaderboard" className="hover:text-pink-600 transition">
              Leaderboard
            </Link>
            <Link href="/about" className="hover:text-pink-600 transition">
              About
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

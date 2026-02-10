import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-gray-400">
        <p>
          Acts of Kindness Birthday Bingo &mdash; Questions? Contact Andy Roberts
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
  );
}

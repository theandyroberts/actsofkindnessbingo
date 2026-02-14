import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AboutPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
            {user && (
              <Link
                href="/profile"
                className="text-gray-600 hover:text-pink-600 transition"
              >
                Profile
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <article className="bg-white rounded-2xl shadow-sm p-8 sm:p-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Mother Emilie Gamelin
          </h1>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              <strong>Emilie Tavernier Gamelin (1800–1851)</strong> was a
              Canadian woman of deep faith and extraordinary compassion who
              dedicated her life to serving those most in need. Born in Montreal
              on February 19, 1800, she was the youngest of fifteen children.
              Orphaned at a young age, Emilie developed a profound empathy for
              those who suffered.
            </p>

            <p>
              After the death of her husband Jean-Baptiste Gamelin in 1827,
              Emilie channeled her grief into service. She began by welcoming
              elderly women who were poor and alone into her home. Her acts of
              charity quickly grew — she visited prisoners, cared for the sick,
              and provided refuge for those with nowhere to turn.
            </p>

            <p>
              In 1843, she founded the <strong>Sisters of Providence</strong>,
              a religious community devoted to serving the poor, the sick, the
              elderly, and the marginalized. Under her leadership, the Sisters
              established hospitals, orphanages, and shelters throughout
              Montreal and beyond.
            </p>

            <p>
              Mother Gamelin&apos;s approach was revolutionary for her time. She
              believed in treating every person with dignity and compassion,
              regardless of their circumstances. She was known for her personal
              warmth, visiting the sick at their bedsides, and advocating for
              those who had no voice.
            </p>

            <p>
              She passed away on September 23, 1851, during a cholera epidemic,
              having contracted the disease while caring for the sick. She was
              beatified by Pope Benedict XVI in 2001, recognizing her heroic
              virtue and lifelong dedication to charity.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              Her Legacy at Providence
            </h2>

            <p>
              The mission of Mother Gamelin lives on through Providence Health
              Systems. Her vision of compassionate care, service to the
              vulnerable, and community building continues to guide our work
              every day.
            </p>

            <p>
              This <strong>Acts of Kindness Birthday Bingo</strong> game is
              inspired by her legacy. By performing small acts of kindness for
              our fellow caregivers, we honor the spirit of Mother Gamelin and
              strengthen the bonds within our community. Every kind word, every
              helping hand, every moment of patience reflects the compassion she
              embodied.
            </p>

            <blockquote className="border-l-4 border-pink-400 pl-4 italic text-gray-500 my-6">
              &ldquo;Do good and do it well.&rdquo;
              <br />
              <span className="text-sm not-italic">&mdash; Mother Emilie Gamelin</span>
            </blockquote>
          </div>
        </article>

        <div className="text-center mt-8">
          <Link
            href="/board"
            className="inline-block px-8 py-3 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 transition shadow-lg"
          >
            Start Spreading Kindness
          </Link>
        </div>
      </main>
    </div>
  );
}

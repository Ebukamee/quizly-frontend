import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AnimateIn from "../components/AnimateIn";

const features = [
  "Unlimited subjects & documents",
  "All 4 quiz formats — MCQ, Subjective, Essay, Maths",
  "AI grading with source citations",
  "Private & public quiz sharing",
  "Attempt history & performance analytics",
  "Unlimited question generation",
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white font-sans dark:bg-black">
      <Navbar />

      {/* Hero */}
      <section className="pt-16">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center lg:py-28">
          <AnimateIn>
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
              During Beta
            </span>
            <h1 className="mt-4 font-display text-5xl font-bold leading-[1.1] tracking-tight text-black dark:text-white lg:text-6xl">
              Free while we&rsquo;re in beta.
            </h1>
            <p className="mx-auto mt-5 max-w-lg font-body text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
              Quizly is completely free during our public beta. No credit card, no trial period, no catch. Everything is included.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Pricing card */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-md">
          <AnimateIn>
            <div className="overflow-hidden rounded-2xl border-2 border-black dark:border-white">
              {/* Card header */}
              <div className="bg-black px-8 py-6 text-white dark:bg-white dark:text-black">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="font-heading text-xs font-semibold uppercase tracking-widest opacity-60">Beta Plan</p>
                    <p className="mt-1 font-display text-4xl font-bold tracking-tight">Free</p>
                  </div>
                  <span className="rounded-full border border-white/20 px-3 py-1 text-xs font-medium dark:border-black/20">
                    For now
                  </span>
                </div>
                <p className="mt-3 text-sm opacity-60">
                  Full access during our public beta. Pricing will be announced before we launch paid plans — early users will always get a discount.
                </p>
              </div>

              {/* Features */}
              <div className="bg-white px-8 py-6 dark:bg-zinc-950">
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400">Everything included</p>
                <ul className="space-y-3">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-black dark:text-white">
                        <polyline points="20,6 9,17 4,12" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/login"
                  className="mt-7 flex h-11 w-full items-center justify-center rounded-full bg-black text-sm font-semibold text-white transition-all hover:bg-zinc-800 active:scale-[0.97] dark:bg-white dark:text-black dark:hover:bg-zinc-100"
                >
                  Get started — it&apos;s free
                </Link>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-zinc-100 px-6 py-20 dark:border-zinc-900">
        <div className="mx-auto max-w-2xl">
          <AnimateIn className="mb-10">
            <h2 className="font-display text-2xl font-bold tracking-tight text-black dark:text-white">
              Common questions
            </h2>
          </AnimateIn>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
            {[
              {
                q: "Is it really free?",
                a: "Yes, completely. During our public beta, all features are free with no limits. No credit card is required.",
              },
              {
                q: "Will it stay free forever?",
                a: "We plan to introduce paid plans in the future to keep the product sustainable. However, beta users will always get a meaningful discount, and we'll give plenty of notice before anything changes.",
              },
              {
                q: "What happens to my data when paid plans launch?",
                a: "Your subjects, documents, and quiz history are yours. We'll never delete your data or lock you out without warning.",
              },
              {
                q: "How many documents can I upload?",
                a: "There's no cap during beta. Upload as many documents as you need across as many subjects as you like.",
              },
            ].map((item, i) => (
              <AnimateIn key={item.q} delay={i * 60} className="py-5">
                <p className="font-display font-semibold text-black dark:text-white">{item.q}</p>
                <p className="mt-2 font-body text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{item.a}</p>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

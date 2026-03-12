import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AnimateIn from "../components/AnimateIn";

const team = [
  {
    name: "Amara Okafor",
    role: "Co-founder & CEO",
    bio: "Former student who spent more time making flashcards than actually studying. Built Quizly to fix that.",
    initials: "AO",
  },
  {
    name: "Daniel Reeves",
    role: "Co-founder & CTO",
    bio: "Full-stack engineer obsessed with AI and the science of learning. Previously at a top-5 edtech startup.",
    initials: "DR",
  },
  {
    name: "Priya Nair",
    role: "Head of Product",
    bio: "Cognitive science graduate turned product designer. Believes studying tools should adapt to how humans actually learn.",
    initials: "PN",
  },
];

const values = [
  {
    title: "Learning over busywork",
    body: "Flashcard-making and question-writing is busywork. We automate the low-value stuff so you can spend your time actually thinking.",
  },
  {
    title: "Your material, your quiz",
    body: "Generic question banks don't know your syllabus. Every question Quizly generates is grounded in the documents you upload.",
  },
  {
    title: "Honest AI feedback",
    body: "We show you exactly which part of your source material an answer is drawn from. No black-box grading — citations included.",
  },
  {
    title: "Privacy by default",
    body: "Your documents belong to you. Quizzes are private unless you choose to share them. We don't train on your data.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white font-sans dark:bg-black">
      <Navbar />

      {/* Hero */}
      <section className="pt-16">
        <div className="mx-auto max-w-4xl px-6 py-20 lg:py-28">
          <AnimateIn>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">About Quizly</p>
            <h1 className="font-display text-5xl font-bold leading-[1.1] tracking-tight text-black dark:text-white lg:text-6xl">
              We think studying should be smarter, not harder.
            </h1>
            <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
              Quizly started with a simple frustration — spending hours converting lecture notes into quiz questions by hand. We built the tool we wished existed: upload your documents, get a proper quiz in under 30 seconds.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Mission */}
      <section className="border-t border-zinc-100 px-6 py-20 dark:border-zinc-900">
        <div className="mx-auto max-w-4xl">
          <AnimateIn>
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">Our mission</p>
                <h2 className="font-display text-3xl font-bold tracking-tight text-black dark:text-white sm:text-4xl">
                  Make active recall accessible to every student
                </h2>
              </div>
              <p className="font-body leading-relaxed text-zinc-500 dark:text-zinc-400">
                Research consistently shows that active recall — testing yourself on material — is the single most effective study technique. Yet most students default to passive re-reading because building test questions is too much work. Quizly removes that barrier. You get the benefit of self-testing without the hours of prep.
              </p>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-zinc-100 px-6 py-20 dark:border-zinc-900">
        <div className="mx-auto max-w-4xl">
          <AnimateIn className="mb-12">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-400">What we believe</p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-black dark:text-white sm:text-4xl">
              Our values
            </h2>
          </AnimateIn>

          <div className="grid gap-4 sm:grid-cols-2">
            {values.map((v, i) => (
              <AnimateIn
                key={v.title}
                delay={i * 80}
                className="card-hover rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800"
              >
                <h3 className="mb-2 font-display font-semibold text-black dark:text-white">{v.title}</h3>
                <p className="font-body text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{v.body}</p>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="border-t border-zinc-100 px-6 py-20 dark:border-zinc-900">
        <div className="mx-auto max-w-4xl">
          <AnimateIn className="mb-12">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-400">The team</p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-black dark:text-white sm:text-4xl">
              Built by learners, for learners
            </h2>
          </AnimateIn>

          <div className="grid gap-4 sm:grid-cols-3">
            {team.map((member, i) => (
              <AnimateIn
                key={member.name}
                delay={i * 80}
                className="card-hover rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-black font-display text-sm font-bold text-white dark:bg-white dark:text-black">
                  {member.initials}
                </div>
                <h3 className="font-display font-semibold text-black dark:text-white">{member.name}</h3>
                <p className="mt-0.5 text-xs font-medium text-zinc-400">{member.role}</p>
                <p className="mt-3 font-body text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{member.bio}</p>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-6 pb-20">
        <AnimateIn className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-black px-8 py-16 text-center dark:border dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="mx-auto max-w-xl font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to study smarter?
          </h2>
          <p className="mx-auto mt-4 max-w-md font-body text-zinc-400">
            Join thousands of students already using Quizly to turn their documents into quizzes.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/upload"
              className="inline-flex h-11 items-center rounded-full bg-white px-6 text-sm font-semibold text-black transition-all hover:bg-zinc-100 active:scale-[0.97]"
            >
              Get started free
            </Link>
            <Link
              href="/login"
              className="inline-flex h-11 items-center rounded-full border border-zinc-700 px-6 text-sm font-semibold text-white transition-all hover:border-zinc-500 hover:bg-zinc-900"
            >
              Sign in
            </Link>
          </div>
        </AnimateIn>
      </section>

      <Footer />
    </div>
  );
}

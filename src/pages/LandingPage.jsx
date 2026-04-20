import { Link } from 'react-router-dom';

const pillars = [
  {
    title: 'Quests, Not Checklists',
    description:
      'Every day becomes a tactical run with objectives, XP rewards, and clear win conditions.',
  },
  {
    title: 'Momentum Loop',
    description:
      'Streaks, levels, and daily caps keep you consistent without burning out.',
  },
  {
    title: 'Roadmap-Driven',
    description:
      'Missions come from your skill roadmap, so progress is meaningful, not random busywork.',
  },
];

const missionExamples = [
  {
    label: 'Deep Work',
    title: 'Implement 3 sorting algorithms from memory and benchmark each.',
  },
  {
    label: 'Applied Challenge',
    title: 'Build a mini workout circuit with timed intervals and progressive overload notes.',
  },
  {
    label: 'Review Sprint',
    title: 'Teach today\'s concept in 5 bullets and log one mistake to avoid tomorrow.',
  },
];

export default function LandingPage() {
  return (
    <div className="app-shell app-bg-grid">
      <header className="container-app py-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#1f7a5f] text-white font-bold flex items-center justify-center shadow">
            SQ
          </div>
          <div>
            <p className="text-sm text-muted">Productivity RPG</p>
            <h1 className="text-xl font-bold leading-none">Skill Quest</h1>
          </div>
        </div>
        <Link to="/login" className="btn btn-secondary">
          Sign in
        </Link>
      </header>

      <main className="container-app pb-14">
        <section className="card-strong reveal-up relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-[#f5a52433] blur-2xl" />
          <div className="absolute -bottom-14 -left-14 w-48 h-48 rounded-full bg-[#1f7a5f2b] blur-2xl" />

          <p className="badge mb-4">Gamify Your Real Life</p>
          <h2 className="heading-display max-w-4xl mb-4">
            Turn study, fitness, and life goals into high-quality daily quests.
          </h2>
          <p className="text-muted max-w-2xl mb-7">
            We turn your roadmap into better missions: focused deep work, deliberate practice,
            applied challenges, and review loops that actually move your level up.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link to="/login" className="btn btn-primary">
              Start Your Quest
            </Link>
            <Link to="/login" className="btn btn-secondary">
              View Live Dashboard
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="card reveal-up">
              <h3 className="text-xl font-bold mb-2">{pillar.title}</h3>
              <p className="text-sm text-muted">{pillar.description}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 card reveal-up">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h3 className="text-2xl font-bold">What Better Tasks Look Like</h3>
            <span className="badge">Mission Quality Upgrade</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {missionExamples.map((example) => (
              <article key={example.title} className="rounded-2xl border border-[#d8d2be] bg-[#fffdf5] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#1f7a5f] mb-2">
                  {example.label}
                </p>
                <p className="font-medium leading-relaxed">{example.title}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

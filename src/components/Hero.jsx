import React from 'react';

const Hero = () => {
  return (
    <section className="relative flex min-h-screen items-center justify-center px-6 py-20">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-sky-500/20 via-transparent to-indigo-500/20" />
      <div className="w-full max-w-5xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 shadow-sm dark:border-white/15 dark:bg-white/5 dark:text-sky-200">
          Curated directory
        </span>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
          Your questions answered.
        </h1>
        <p className="mt-6 text-lg text-slate-600 dark:text-slate-200 sm:text-xl">
          Discover trusted resources, research hubs, and communities curated for lifelong learners.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#directory"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 dark:focus-visible:ring-white/80 dark:focus-visible:ring-offset-slate-950"
          >
            Explore the directory
          </a>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-8 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:border-white/20 dark:text-white/80 dark:hover:border-white/40 dark:hover:text-white dark:focus-visible:ring-white/80 dark:focus-visible:ring-offset-slate-950"
          >
            Save your favorites
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;

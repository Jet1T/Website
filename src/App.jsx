import React, { useMemo, useState, useEffect } from 'react';
import Hero from './components/Hero';
import SearchBar from './components/SearchBar';
import LinkList from './components/LinkList';
import { links } from './data/links';

const normalizeText = (text) => text.toLowerCase();

const App = () => {
  const [query, setQuery] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('theme');
    if (stored) {
      return stored === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const filteredLinks = useMemo(() => {
    const normalizedQuery = normalizeText(query.trim());
    const sorted = [...links].sort((a, b) => a.name.localeCompare(b.name));
    if (!normalizedQuery) {
      return sorted;
    }

    return sorted.filter((link) => {
      const haystack = [
        link.name,
        link.description,
        ...(link.tags || [])
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [query]);

  const groupedLinks = useMemo(() => {
    return filteredLinks.reduce((groups, link) => {
      const letter = link.name.charAt(0).toUpperCase();
      const existing = groups.find((group) => group.letter === letter);
      if (existing) {
        existing.items.push(link);
      } else {
        groups.push({ letter, items: [link] });
      }
      return groups;
    }, []);
  }, [filteredLinks]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-sky-500/30 blur-3xl" aria-hidden="true" />
      <div className="absolute right-0 top-10 h-40 w-40 rounded-full bg-indigo-500/30 blur-3xl" aria-hidden="true" />
      <header className="absolute right-6 top-6 z-10">
        <button
          type="button"
          onClick={() => setDarkMode((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 transition hover:border-slate-300 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 dark:border-white/20 dark:bg-white/5 dark:text-white/80 dark:hover:border-white/40 dark:hover:text-white dark:focus-visible:ring-white/70"
          aria-pressed={darkMode}
        >
          {darkMode ? 'Dark mode' : 'Light mode'}
        </button>
      </header>
      <main>
        <Hero />
        <section id="directory" className="relative px-6 pb-24">
          <div className="mx-auto w-full max-w-6xl">
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-soft sm:p-10 dark:border-white/10 dark:bg-slate-900/40">
              <div className="flex flex-col gap-6">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-200">
                    Directory
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
                    Explore curated answers
                  </h2>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                    Jump into trusted communities, research platforms, and learning hubs.
                  </p>
                </div>
                <SearchBar
                  value={query}
                  onChange={setQuery}
                  resultsCount={filteredLinks.length}
                />
              </div>
              {filteredLinks.length === 0 ? (
                <div className="mt-10 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-8 text-center dark:border-white/10 dark:bg-slate-950/60">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No results found</h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Try a different keyword or reset your search.
                  </p>
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="mt-6 inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 dark:bg-sky-400/90 dark:text-slate-900 dark:hover:bg-sky-300"
                  >
                    Reset search
                  </button>
                </div>
              ) : (
                <LinkList groupedLinks={groupedLinks} />
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;

import React from 'react';

const SearchBar = ({ value, onChange, resultsCount }) => {
  return (
    <div className="sticky top-4 z-10 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 backdrop-blur dark:border-white/10 dark:bg-slate-900/80">
      <label className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400" htmlFor="search">
        Search the directory
      </label>
      <div className="relative">
        <input
          id="search"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search titles, descriptions, or tags"
          className="w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-sm text-slate-700 shadow-soft placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 dark:border-white/10 dark:bg-slate-950/80 dark:text-slate-100 dark:placeholder:text-slate-500"
          aria-describedby="search-count"
        />
      </div>
      <p id="search-count" className="text-xs text-slate-500 dark:text-slate-400">
        {resultsCount} curated link{resultsCount === 1 ? '' : 's'}
      </p>
    </div>
  );
};

export default SearchBar;

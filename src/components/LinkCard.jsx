import React from 'react';

const ExternalIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="h-4 w-4"
  >
    <path d="M11 3a1 1 0 0 0 0 2h2.586l-6.95 6.95a1 1 0 1 0 1.414 1.414L15 6.414V9a1 1 0 1 0 2 0V3h-6z" />
    <path d="M5 5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-3a1 1 0 1 0-2 0v3H5V7h3a1 1 0 1 0 0-2H5z" />
  </svg>
);

const LinkCard = ({ link }) => {
  return (
    <article className="group flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-soft transition hover:-translate-y-1 hover:border-sky-400/60 hover:bg-white dark:border-white/10 dark:bg-slate-900/70 dark:hover:bg-slate-900/90">
      <div>
        <a
          href={link.url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-lg font-semibold text-slate-900 transition group-hover:text-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 dark:text-white dark:group-hover:text-sky-300"
        >
          {link.name}
          <span className="text-sky-500 dark:text-sky-300">
            <ExternalIcon />
          </span>
        </a>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{link.description}</p>
      </div>
      {link.tags?.length ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {link.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
};

export default LinkCard;

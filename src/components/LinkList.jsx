import React from 'react';
import LinkCard from './LinkCard';

const LinkList = ({ groupedLinks }) => {
  return (
    <div className="mt-8 space-y-10">
      {groupedLinks.map((group) => (
        <section key={group.letter} aria-labelledby={`group-${group.letter}`}>
          <div className="sticky top-28 z-0 mb-4 flex items-center gap-4">
            <h2
              id={`group-${group.letter}`}
              className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400"
            >
              {group.letter}
            </h2>
            <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" aria-hidden="true" />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {group.items.map((link) => (
              <LinkCard key={link.name} link={link} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default LinkList;

/* ==========================================================
   The Days — Countdown Logic
   ========================================================== */

/* ----------------------------------------------------------
   EDIT YOUR EVENTS HERE
   ----------------------------------------------------------
   Add, remove, or edit events in this array.
   - "name" is the event's display name.
   - "date" must be in "YYYY-MM-DD" format.
   - "until" is optional. By default the sentence reads
     "...until {name}." If you want different wording, add an
     "until" field with the exact phrase to use instead — see
     Graduation below for an example.

   You do not need to keep this list sorted — it is sorted
   automatically, soonest first. Events automatically drop off
   the page once their date has passed. No HTML or CSS edits
   are required to add or remove an event.
   ---------------------------------------------------------- */
const events = [
  {
    name: "Thanksgiving Leave",
    date: "2026-11-25"
  },
  {
    name: "Winter Leave",
    date: "2026-12-20"
  },
  {
    name: "500th Night",
    date: "2027-01-23"
  },
  {
    name: "100th Night",
    date: "2027-02-06"
  },
  {
    name: "Yearling Winter Weekend",
    date: "2027-02-20"
  },
  {
    name: "Graduation",
    date: "2027-05-27",
    until: "graduation and graduation leave for the class of 2027"
  }
  // Add more events below, following the same format:
  // {
  //     name: "Spring Break",
  //     date: "2027-03-14"
  // },
];
/* ---------------------------------------------------------- */


/* ----------------------------------------------------------
   ARMY-NAVY GAME — EDIT HERE
   ----------------------------------------------------------
   This countdown always stays on the page (as long as the
   date hasn't passed), regardless of which regular-season
   opponent is up next in the football schedule below. Update
   "date" each year once the Army-Navy game date is announced.
   ---------------------------------------------------------- */
const armyNavyGame = {
  date: "2026-12-12"
};
/* ---------------------------------------------------------- */


/* ----------------------------------------------------------
   ARMY FOOTBALL SCHEDULE — EDIT HERE
   ----------------------------------------------------------
   This is the full 2026 Army West Point football schedule.
   "opponent" is who Army plays, "date" is the game date in
   "YYYY-MM-DD" format. As each game's date passes, it drops
   off automatically and the next game on the list takes its
   place at the top of the page — nothing to update by hand
   during the season. If the schedule changes (bye weeks,
   rescheduled games, a bowl game added, etc.), just edit,
   add, or remove entries below.
   ---------------------------------------------------------- */
const footballGames = [
  { opponent: "Bryant", date: "2026-09-05" },
  { opponent: "South Florida", date: "2026-09-12" },
  { opponent: "Temple", date: "2026-09-25" },
  { opponent: "Louisiana Tech", date: "2026-10-03" },
  { opponent: "Tulane", date: "2026-10-10" },
  { opponent: "Florida Atlantic", date: "2026-10-17" },
  { opponent: "Tulsa", date: "2026-10-23" },
  { opponent: "Memphis", date: "2026-10-31" },
  { opponent: "Air Force", date: "2026-11-07" },
  { opponent: "East Carolina", date: "2026-11-21" },
  { opponent: "Rice", date: "2026-11-28" },
  { opponent: "Navy", date: "2026-12-12" }
  // Add future-season games below, following the same format:
  // { opponent: "Bryant", date: "2027-09-04" },
];
/* ---------------------------------------------------------- */


/**
 * Parses a "YYYY-MM-DD" string into a Date object set to local
 * midnight, avoiding the timezone shift that happens when a
 * date-only string is parsed as UTC by `new Date(str)`.
 */
function parseLocalDate(dateStr) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Returns today's date at local midnight, so time-of-day never
 * affects the day count.
 */
function getTodayAtMidnight() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/**
 * Returns the whole number of days between two midnight-aligned
 * Date objects.
 */
function daysBetween(startDate, endDate) {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((endDate - startDate) / msPerDay);
}

/**
 * Formats a Date object as "25 NOV 2026" for the ledger columns.
 */
function formatShortDate(date) {
  return date
    .toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric"
    })
    .toUpperCase();
}

/**
 * Basic HTML escaping so event names can't break the markup
 * if they ever contain special characters.
 */
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Computes the sorted list of events that have not yet occurred.
 */
function getUpcomingEvents() {
  const today = getTodayAtMidnight();

  return events
    .map((event) => {
      const eventDate = parseLocalDate(event.date);
      const daysRemaining = daysBetween(today, eventDate);
      return { ...event, eventDate, daysRemaining };
    })
    .filter((event) => event.daysRemaining >= 0)
    .sort((a, b) => a.daysRemaining - b.daysRemaining);
}

/**
 * Finds the next Army football game that hasn't happened yet.
 * Returns null once the season's final game has passed.
 */
function getNextFootballGame() {
  const today = getTodayAtMidnight();

  const upcomingGames = footballGames
    .map((game) => {
      const gameDate = parseLocalDate(game.date);
      const daysRemaining = daysBetween(today, gameDate);
      return { ...game, gameDate, daysRemaining };
    })
    .filter((game) => game.daysRemaining >= 0)
    .sort((a, b) => a.daysRemaining - b.daysRemaining);

  return upcomingGames[0] || null;
}

/**
 * Computes the Army-Navy countdown, if the game hasn't happened yet.
 */
function getArmyNavyCountdown() {
  const today = getTodayAtMidnight();
  const gameDate = parseLocalDate(armyNavyGame.date);
  const daysRemaining = daysBetween(today, gameDate);

  if (daysRemaining < 0) {
    return null;
  }

  return { gameDate, daysRemaining };
}
function renderTodayLine() {
  const todayEl = document.getElementById("today-date");
  const formatted = new Date().toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
  todayEl.textContent = `Today is ${formatted}!`;
}

/**
 * Builds a regular numbered event entry.
 */
function buildEventEntry(event, number) {
  const paddedNumber = String(number).padStart(2, "0");
  const dayWord = event.daysRemaining === 1 ? "day" : "days";
  const untilPhrase = event.until || escapeHtml(event.name);

  const entry = document.createElement("article");
  entry.className = "entry";

  entry.innerHTML = `
    <p class="entry-no">${paddedNumber}</p>
    <div class="entry-body">
      <p class="entry-sentence">
        There are <span class="entry-count">${event.daysRemaining}</span>
        and a butt ${dayWord} until
        <strong>${untilPhrase}</strong>.
      </p>
      <p class="entry-date">${formatShortDate(event.eventDate)}</p>
    </div>
  `;

  return entry;
}

/**
 * Builds the Army-Navy entry, with its own sentence template.
 * This one is not part of the regular football rotation — it
 * always shows the Army-Navy countdown specifically, regardless
 * of which other game is coming up next.
 */
function buildArmyNavyEntry(countdown, number) {
  const paddedNumber = String(number).padStart(2, "0");
  const dayWord = countdown.daysRemaining === 1 ? "day" : "days";

  const entry = document.createElement("article");
  entry.className = "entry";

  entry.innerHTML = `
    <p class="entry-no">${paddedNumber}</p>
    <div class="entry-body">
      <p class="entry-sentence">
        There are <span class="entry-count">${countdown.daysRemaining}</span>
        and a butt ${dayWord} until Army beats the
        <strong>HELL</strong> out of Navy in football!
      </p>
      <p class="entry-date">${formatShortDate(countdown.gameDate)}</p>
    </div>
  `;

  return entry;
}

/**
 * Builds the single football entry, with its own sentence
 * template ending in "!" instead of a period.
 */
function buildFootballEntry(game, number) {
  const paddedNumber = String(number).padStart(2, "0");
  const dayWord = game.daysRemaining === 1 ? "day" : "days";

  const entry = document.createElement("article");
  entry.className = "entry";

  entry.innerHTML = `
    <p class="entry-no">${paddedNumber}</p>
    <div class="entry-body">
      <p class="entry-sentence">
        There are <span class="entry-count">${game.daysRemaining}</span>
        and a butt ${dayWord} until Army beats
        <strong>${escapeHtml(game.opponent)}</strong> in Football!
      </p>
      <p class="entry-date">${formatShortDate(game.gameDate)}</p>
    </div>
  `;

  return entry;
}

/**
 * Renders one uniform-size entry per upcoming item — regular events,
 * the next Army football game, and the Army-Navy countdown — all
 * merged into a single list sorted chronologically, soonest first,
 * and numbered in that same order.
 */
function renderEvents() {
  renderTodayLine();

  const listEl = document.getElementById("event-list");
  const ledgerEl = document.querySelector(".ledger");
  const emptyMessageEl = document.getElementById("empty-message");
  const upcomingEvents = getUpcomingEvents();
  const nextGame = getNextFootballGame();
  const armyNavyCountdown = getArmyNavyCountdown();

  listEl.innerHTML = "";

  if (upcomingEvents.length === 0 && !nextGame && !armyNavyCountdown) {
    ledgerEl.hidden = true;
    emptyMessageEl.hidden = false;
    return;
  }

  ledgerEl.hidden = false;
  emptyMessageEl.hidden = true;

  // Combine every item into one list, each carrying its own
  // daysRemaining and a builder function so the whole set can be
  // sorted together and numbered afterward, in final order.
  const items = [];

  upcomingEvents.forEach((event) => {
    items.push({
      daysRemaining: event.daysRemaining,
      build: (number) => buildEventEntry(event, number)
    });
  });

  if (nextGame) {
    items.push({
      daysRemaining: nextGame.daysRemaining,
      build: (number) => buildFootballEntry(nextGame, number)
    });
  }

  if (armyNavyCountdown) {
    items.push({
      daysRemaining: armyNavyCountdown.daysRemaining,
      build: (number) => buildArmyNavyEntry(armyNavyCountdown, number)
    });
  }

  items
    .sort((a, b) => a.daysRemaining - b.daysRemaining)
    .forEach((item, index) => listEl.appendChild(item.build(index + 1)));
}

document.addEventListener("DOMContentLoaded", renderEvents);

/* ==========================================================
   The Days — Countdown Logic
   ========================================================== */

/* ----------------------------------------------------------
   EDIT YOUR EVENTS HERE
   ----------------------------------------------------------
   Add, remove, or edit events in this array.
   - "name" is the event's display name.
   - "date" must be in "YYYY-MM-DD" format.

   You do not need to keep this list sorted — it is sorted
   automatically, soonest first. Events automatically drop off
   the page once their date has passed. No HTML or CSS edits
   are required to add or remove an event.
   ---------------------------------------------------------- */
const events = [
  {
    name: "Thanksgiving Break",
    date: "2026-11-25"
  },
  {
    name: "Christmas Leave",
    date: "2026-12-18"
  }
  // Add more events below, following the same format:
  // {
  //     name: "Spring Break",
  //     date: "2027-03-14"
  // },
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
 * Renders one uniform-size entry per upcoming event, nearest first.
 */
function renderEvents() {
  const listEl = document.getElementById("event-list");
  const ledgerEl = document.querySelector(".ledger");
  const emptyMessageEl = document.getElementById("empty-message");
  const upcomingEvents = getUpcomingEvents();

  listEl.innerHTML = "";

  if (upcomingEvents.length === 0) {
    ledgerEl.hidden = true;
    emptyMessageEl.hidden = false;
    return;
  }

  ledgerEl.hidden = false;
  emptyMessageEl.hidden = true;

  upcomingEvents.forEach((event, index) => {
    const number = String(index + 1).padStart(2, "0");
    const dayWord = event.daysRemaining === 1 ? "day" : "days";

    const entry = document.createElement("article");
    entry.className = "entry";

    entry.innerHTML = `
      <p class="entry-no">${number}</p>
      <div class="entry-body">
        <p class="entry-sentence">
          There are <span class="entry-count">${event.daysRemaining}</span>
          and a butt ${dayWord} until
          <strong>${escapeHtml(event.name)}</strong>.
        </p>
        <p class="entry-date">${formatShortDate(event.eventDate)}</p>
      </div>
    `;

    listEl.appendChild(entry);
  });
}

document.addEventListener("DOMContentLoaded", renderEvents);

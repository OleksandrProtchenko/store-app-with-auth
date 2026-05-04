export function formatDate(now: Date) {
  const day = new Intl.DateTimeFormat("en-GB", { day: "2-digit" }).format(now);
  const month = new Intl.DateTimeFormat("en-GB", { month: "short" })
    .format(now)
    .toUpperCase();
  const year = new Intl.DateTimeFormat("en-GB", { year: "numeric" }).format(
    now,
  );
  return day + " " + month + ", " + year;
}

export function formatTime(now: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);
}

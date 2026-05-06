const clockDayFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
});

const clockMonthFormatter = new Intl.DateTimeFormat("en-GB", {
  month: "short",
});

const clockYearFormatter = new Intl.DateTimeFormat("en-GB", {
  year: "numeric",
});

const clockTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

const shortDateFormatter = new Intl.DateTimeFormat("uk-UA");

const longDateFormatter = new Intl.DateTimeFormat("uk-UA", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export function formatClockDate(now: Date) {
  const day = clockDayFormatter.format(now);
  const month = clockMonthFormatter.format(now).toUpperCase();
  const year = clockYearFormatter.format(now);

  return day + " " + month + ", " + year;
}

export function formatClockTime(now: Date) {
  return clockTimeFormatter.format(now);
}

export function formatDateShort(date: string) {
  return shortDateFormatter.format(new Date(date));
}

export function formatDateLong(date: string) {
  return longDateFormatter.format(new Date(date));
}

export function formatDateDmy(value?: string) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-GB").format(new Date(value));
}

export function formatDateMonthYear(value?: string) {
  if (!value) return "-";

  const date = new Date(value);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);

  return month + "/" + year;
}

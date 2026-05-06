import { useEffect, useState } from "react";
import { MdOutlineWatchLater } from "react-icons/md";
import css from "./Clock.module.css";
import { formatClockDate, formatClockTime } from "@/utils/formatDate";

export default function Clock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const startInterval = () => {
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(() => setNow(new Date()), 1000);
    };

    const offset = 1000 - (Date.now() % 1000);
    const timeoutId = setTimeout(() => {
      setNow(new Date());
      startInterval();
    }, offset);

    const onVisibilityChange = () => {
      if (!document.hidden) setNow(new Date());
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <div className={css.clockWrapper}>
      <span className={css.date}>{formatClockDate(now)}</span>
      <MdOutlineWatchLater className={css.icon} />
      <span className={css.time}>{formatClockTime(now)}</span>
    </div>
  );
}

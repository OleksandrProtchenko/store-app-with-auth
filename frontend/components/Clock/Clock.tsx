import { useEffect, useMemo, useState } from "react";
import { MdOutlineWatchLater } from "react-icons/md";
import css from "./Clock.module.css";
import { formatDate, formatTime } from "@/utils/normalizeDate";

export default function Clock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(timer);
  }, []);

  const dateText = useMemo(() => formatDate(now), [now]);
  const timeText = useMemo(() => formatTime(now), [now]);

  return (
    <div className={css.clockWrapper}>
      <span className={css.date}>{dateText}</span>
      <MdOutlineWatchLater className={css.icon} />
      <span className={css.time}>{timeText}</span>
    </div>
  );
}

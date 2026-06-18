"use client";

import { useMemo, useState } from "react";
import { MockIncident } from "@/types/mockIncident";
import styles from "./ActivityCalendar.module.scss";

interface Props {
  incidents: MockIncident[];
}

const WEEKDAYS = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"];
const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

export default function ActivityCalendar({ incidents }: Props) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const countsByDay = useMemo(() => {
    const map: Record<string, { count: number; maxPriority: string }> = {};
    incidents
      .filter((i) => !i.deleted)
      .forEach((inc) => {
        const d = new Date(inc.createdAt);
        if (d.getFullYear() === year && d.getMonth() === month) {
          const key = d.getDate().toString();
          if (!map[key]) {
            map[key] = { count: 0, maxPriority: "low" };
          }
          map[key].count++;
          if (inc.priority === "high") map[key].maxPriority = "high";
          else if (inc.priority === "medium" && map[key].maxPriority !== "high") {
            map[key].maxPriority = "medium";
          }
        }
      });
    return map;
  }, [incidents, year, month]);

  const firstDay = new Date(year, month, 1);
  let startDay = firstDay.getDay() - 1;
  if (startDay < 0) startDay = 6; // Domingo
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };

  const isToday = (day: number) => {
    return day === now.getDate() && month === now.getMonth() && year === now.getFullYear();
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>Calendario de actividad</div>
      <div className={styles.subtitle}>Incidencias creadas por día</div>

      <div className={styles.nav}>
        <button onClick={prevMonth}>‹</button>
        <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
          {[2025, 2026, 2027].map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
          {MONTHS.map((m, i) => (
            <option key={m} value={i}>{m}</option>
          ))}
        </select>
        <button onClick={nextMonth}>›</button>
      </div>

      <div className={styles.weekdays}>
        {WEEKDAYS.map((d) => <span key={d}>{d}</span>)}
      </div>

      <div className={styles.days}>
        {Array.from({ length: startDay }).map((_, i) => (
          <div key={`empty-${i}`} className={`${styles.day} ${styles.dayEmpty}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const data = countsByDay[day.toString()];
          return (
            <div
              key={day}
              className={`${styles.day} ${isToday(day) ? styles.dayToday : ""}`}
            >
              {day}
              {data && (
                <span className={`${styles.badge} ${
                  data.maxPriority === "high" ? styles.badgeHigh :
                  data.maxPriority === "medium" ? styles.badgeMedium :
                  styles.badgeLow
                }`}>
                  {data.count}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
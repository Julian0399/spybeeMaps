"use client";

import { useMemo } from "react";
import { MockIncident } from "@/types/mockIncident";
import styles from "./TeamPerformance.module.scss";

interface Props {
  incidents: MockIncident[];
}

interface UserStat {
  name: string;
  avatarUrl: string;
  count: number;
}

export default function TeamPerformance({ incidents }: Props) {
  const active = incidents.filter((i) => !i.deleted);

  const resolvers = useMemo(() => {
    const map: Record<string, UserStat> = {};
    active
      .filter((i) => i.status === "closed")
      .forEach((inc) => {
        inc.assignees.forEach((a) => {
          if (!map[a.id])
            map[a.id] = { name: a.name, avatarUrl: a.avatarUrl, count: 0 };
          map[a.id].count++;
        });
      });
    return Object.values(map)
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [active]);

  const reporters = useMemo(() => {
    const map: Record<string, UserStat> = {};
    active.forEach((inc) => {
      if (!inc.owner) return;
      const o = inc.owner;
      if (!map[o.id])
        map[o.id] = { name: o.name, avatarUrl: o.avatarUrl, count: 0 };
      map[o.id].count++;
    });
    return Object.values(map)
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [active]);

  const workload = useMemo(() => {
    const map: Record<string, UserStat> = {};
    active
      .filter((i) => i.status === "open" || i.status === "in_progress")
      .forEach((inc) => {
        inc.assignees.forEach((a) => {
          if (!map[a.id])
            map[a.id] = { name: a.name, avatarUrl: a.avatarUrl, count: 0 };
          map[a.id].count++;
        });
      });
    return Object.values(map)
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [active]);

  const renderList = (data: UserStat[], barClass: string) => {
    const max = data[0]?.count || 1;
    return (
      <div className={styles.list}>
        {data.map((user) => (
          <div key={user.name} className={styles.item}>
            <img
              src={user.avatarUrl}
              alt={user.name}
              className={styles.avatar}
            />
            <span className={styles.name} title={user.name}>
              {user.name}
            </span>
            <div className={styles.barWrapper}>
              <div
                className={`${styles.bar} ${styles[barClass]}`}
                style={{ width: `${(user.count / max) * 100}%` }}
              />
            </div>
            <span className={styles.count}>{user.count}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardTitle}>Quién resuelve más</div>
        <div className={styles.cardSubtitle}>Cerradas en el período</div>
        {renderList(resolvers, "barGreen")}
      </div>
      <div className={styles.card}>
        <div className={styles.cardTitle}>Quién reporta más</div>
        <div className={styles.cardSubtitle}>Creadores con más incidencias</div>
        {renderList(reporters, "barOrange")}
      </div>
      <div className={styles.card}>
        <div className={styles.cardTitle}>Carga actual de trabajo</div>
        <div className={styles.cardSubtitle}>
          Responsables con más incidencias abiertas
        </div>
        {renderList(workload, "barBlue")}
      </div>
    </div>
  );
}

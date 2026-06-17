"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import styles from "./Sidebar.module.scss";

const navItems = [
  { icon: "home", path: "/", label: "Inicio" },
  { icon: "pie_chart", path: "/dashboard", label: "Dashboard" },
  { icon: "location_on", path: "/", label: "Mapa" },
  { icon: "info", path: "/", label: "Info" },
  { icon: "schedule", path: "/", label: "Historial" },
  { icon: "calendar_month", path: "/", label: "Calendario" },
  { icon: "image", path: "/", label: "Galería" },
  { icon: "folder", path: "/", label: "Archivos" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  return (
    <aside className={`${styles.sidebar} ${expanded ? styles.sidebarExpanded : ""}`}>
      <div className={styles.top}>
        <div className={styles.logo} onClick={() => router.push("/")}>
          SB
        </div>
        <button
          className={styles.toggle}
          onClick={() => setExpanded(!expanded)}
        >
          <span className="material-icons-outlined">
            {expanded ? "chevron_left" : "chevron_right"}
          </span>
        </button>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item, i) => (
          <button
            key={i}
            className={`${styles.navItem} ${
              pathname === item.path && i <= 1 ? styles.navItemActive : ""
            }`}
            onClick={() => router.push(item.path)}
            title={item.label}
          >
            <span className="material-icons-outlined">{item.icon}</span>
            {expanded && <span className={styles.label}>{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className={styles.bottom}>
        <button className={styles.navItem} title="Configuración">
          <span className="material-icons-outlined">settings</span>
          {expanded && <span className={styles.label}>Configuración</span>}
        </button>
        <button className={styles.navItem} title="Compartir">
          <span className="material-icons-outlined">share</span>
          {expanded && <span className={styles.label}>Compartir</span>}
        </button>
      </div>
    </aside>
  );
}
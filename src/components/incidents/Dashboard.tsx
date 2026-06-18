"use client";

import { useMemo, useState } from "react";
import { MockIncident } from "@/types/mockIncident";
import mockData from "@/data/data.json";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import styles from "./Dashboard.module.scss";
import HeatMap from "./HeatMap";
import ActivityCalendar from "./ActivityCalendar";
import TeamPerformance from "./TeamPerformance";

const ITEMS_PER_PAGE = 10;
const STATUS_LABELS: Record<string, string> = {
  open: "Abierta",
  closed: "Cerrada",
  in_progress: "En progreso",
  assigned: "Asignada",
};

const PRIORITY_LABELS: Record<string, string> = {
  high: "Alta",
  medium: "Media",
  low: "Baja",
};

export default function Dashboard() {
  const incidents = mockData as unknown as MockIncident[];

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterProject, setFilterProject] = useState("");
  const [page, setPage] = useState(1);
  const [dateRange, setDateRange] = useState("all");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  const types = useMemo(
    () => [...new Set(incidents.map((i) => i.type.name))].sort(),
    [incidents],
  );

  const projects = useMemo(
    () => [...new Set(incidents.map((i) => i.project.name))].sort(),
    [incidents],
  );

  const filtered = useMemo(() => {
    const now = Date.now();
    const DAY = 24 * 60 * 60 * 1000;

    return incidents.filter((inc) => {
      if (inc.deleted) return false;

      const createdTime = new Date(inc.createdAt).getTime();

      if (dateRange !== "all") {
        const days = parseInt(dateRange);
        const cutoff = days === 1
          ? new Date().setHours(0, 0, 0, 0)
          : now - days * DAY;
        if (createdTime < cutoff) return false;
      }

      if (filterDateFrom) {
        const from = new Date(filterDateFrom + "T00:00:00").getTime();
        if (createdTime < from) return false;
      }
      if (filterDateTo) {
        const to = new Date(filterDateTo + "T23:59:59").getTime();
        if (createdTime > to) return false;
      }

      if (filterStatus && inc.status !== filterStatus) return false;
      if (filterPriority && inc.priority !== filterPriority) return false;
      if (filterType && inc.type.name !== filterType) return false;
      if (filterProject && inc.project.name !== filterProject) return false;
      if (search) {
        const s = search.toLowerCase();
        return (
          inc.title.toLowerCase().includes(s) ||
          inc.sequenceId.includes(s) ||
          (inc.owner?.name || "").toLowerCase().includes(s) ||
          inc.locationDescription.toLowerCase().includes(s)
        );
      }
      return true;
    });
  }, [
    incidents,
    search,
    filterStatus,
    filterPriority,
    filterType,
    filterProject,
    filterDateFrom,
    filterDateTo,
    dateRange,
  ]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const stats = useMemo(() => {
    const active = filtered;
    return {
      total: active.length,
      open: active.filter((i) => i.status === "open").length,
      closed: active.filter((i) => i.status === "closed").length,
      inProgress: active.filter(
        (i) => i.status === "in_progress" || i.status === "assigned",
      ).length,
    };
  }, [filtered]);

  const chartByType = useMemo(() => {
    const map: Record<string, number> = {};
      filtered.forEach((inc) => {
        map[inc.type.name] = (map[inc.type.name] || 0) + 1;
      });
    return Object.entries(map)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [filtered]);

  const chartByPriority = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.forEach((inc) => {
      const label = PRIORITY_LABELS[inc.priority] || inc.priority;
      map[label] = (map[label] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const PIE_COLORS = ["#ef4444", "#f59e0b", "#22c55e"];

  return (
    <div className={styles.dashboard}>
      <div className={styles.titleRow}>
        <h1 className={styles.title}>Incidencias</h1>
        <select
          className={styles.dateSelect}
          value={dateRange}
          onChange={(e) => {
            setDateRange(e.target.value);
            setPage(1);
          }}
        >
          <option value="1">Hoy</option>
          <option value="7">Últimos 7 días</option>
          <option value="15">Últimos 15 días</option>
          <option value="30">Últimos 30 días</option>
          <option value="all">Todo</option>
        </select>
      </div>

      <div className={styles.stats}>
        <div className={`${styles.statCard} ${styles["statCard--total"]}`}>
          <div className={styles.statCard__value}>{stats.total}</div>
          <div className={styles.statCard__label}>Total</div>
        </div>
        <div className={`${styles.statCard} ${styles["statCard--open"]}`}>
          <div className={styles.statCard__value}>{stats.open}</div>
          <div className={styles.statCard__label}>Abiertas</div>
        </div>
        <div
          className={`${styles.statCard} ${styles["statCard--in_progress"]}`}
        >
          <div className={styles.statCard__value}>{stats.inProgress}</div>
          <div className={styles.statCard__label}>En progreso</div>
        </div>
        <div className={`${styles.statCard} ${styles["statCard--closed"]}`}>
          <div className={styles.statCard__value}>{stats.closed}</div>
          <div className={styles.statCard__label}>Cerradas</div>
        </div>
      </div>

      <div className={styles.charts}>
        <div className={styles.chartCard}>
          <h3>Incidencias por tipo</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartByType}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11 }}
                angle={-20}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#f5a623" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className={styles.chartCard}>
          <h3>Incidencias por prioridad</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartByPriority}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {chartByPriority.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className={styles.charts}>
        <HeatMap incidents={filtered} />
        <ActivityCalendar incidents={filtered} />
      </div>

      <div style={{ marginBottom: 24 }}>
        <TeamPerformance incidents={filtered} />
      </div>

      <div className={styles.filters}>
        <input
          className={styles.searchInput}
          placeholder="🔍 Buscar por título, ID, responsable..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <select
          className={styles.filterSelect}
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Todos los estados</option>
          {Object.entries(STATUS_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        <select
          className={styles.filterSelect}
          value={filterPriority}
          onChange={(e) => {
            setFilterPriority(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Todas las prioridades</option>
          {Object.entries(PRIORITY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        <select
          className={styles.filterSelect}
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Todos los tipos</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          className={styles.filterSelect}
          value={filterProject}
          onChange={(e) => {
            setFilterProject(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Todos los proyectos</option>
          {projects.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <div className={styles.dateRange}>
          <span>Desde</span>
          <input
            type="date"
            className={styles.filterSelect}
            value={filterDateFrom}
            onChange={(e) => { setFilterDateFrom(e.target.value); setPage(1); }}
          />
          <span>Hasta</span>
          <input
            type="date"
            className={styles.filterSelect}
            value={filterDateTo}
            onChange={(e) => { setFilterDateTo(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <div className={styles.tableScroll}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Tipo</th>
                <th>Prioridad</th>
                <th>Estado</th>
                <th>Responsable</th>
                <th>Asignados</th>
                <th>Tags</th>
                <th>Ubicación</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((inc) => (
                <tr key={inc.id}>
                  <td style={{ fontWeight: 600, color: "#6b7280" }}>
                    #{inc.sequenceId}
                  </td>
                  <td style={{ fontWeight: 500, maxWidth: 250 }}>
                    {inc.title}
                  </td>
                  <td>{inc.type.name}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${styles[`badge--${inc.priority}`]}`}
                    >
                      {PRIORITY_LABELS[inc.priority]}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`${styles.badge} ${styles[`badge--${inc.status}`]}`}
                    >
                      {STATUS_LABELS[inc.status] || inc.status}
                    </span>
                  </td>
                  <td>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <img
                        src={inc.owner.avatarUrl}
                        alt={inc.owner.name}
                        style={{ width: 24, height: 24, borderRadius: "50%" }}
                      />
                      <span style={{ fontSize: 12 }}>{inc.owner.name}</span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.assignees}>
                      {inc.assignees.slice(0, 3).map((a) => (
                        <img
                          key={a.id}
                          src={a.avatarUrl}
                          alt={a.name}
                          title={a.name}
                        />
                      ))}
                      {inc.assignees.length > 3 && (
                        <span
                          style={{
                            fontSize: 11,
                            color: "#6b7280",
                            marginLeft: 4,
                          }}
                        >
                          +{inc.assignees.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    {inc.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className={styles.tag}
                        style={{ background: tag.color }}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </td>
                  <td style={{ fontSize: 12 }}>{inc.locationDescription}</td>
                  <td style={{ fontSize: 12, whiteSpace: "nowrap" }}>
                    {new Date(inc.createdAt).toLocaleDateString("es-CO", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={10} className={styles.empty}>
                    No se encontraron incidencias
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.pagination}>
          <span>
            Mostrando {(page - 1) * ITEMS_PER_PAGE + 1}-
            {Math.min(page * ITEMS_PER_PAGE, filtered.length)} de{" "}
            {filtered.length}
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className={styles.pageBtn}
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Anterior
            </button>
            <button
              className={styles.pageBtn}
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

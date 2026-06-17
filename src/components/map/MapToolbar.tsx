"use client";

import { useIncidentStore } from "@/store/incidentStore";
import styles from "./MapToolbar.module.scss";

export default function MapToolbar() {
  const { isCreating, setIsCreating } = useIncidentStore();

  return (
    <div className={styles.toolbar}>
      <div className={styles.group}>
        <button
          className={styles.btnAdd}
          onClick={() => setIsCreating(!isCreating)}
          title={isCreating ? "Cancelar" : "Crear incidencia"}
        >
          <span className="material-icons-outlined">
            {isCreating ? "close" : "add"}
          </span>

          <span className={styles.tooltip}>
            {isCreating ? "Cancelar" : "Crear incidencia"}
          </span>
        </button>

        <button className={styles.btn} title="Capas">
          <span className="material-icons-outlined">straighten</span>
        </button>
        <button className={styles.btn} title="Filtrar">
          <span className="material-icons-outlined">folder_special</span>
        </button>
        <button className={styles.btn} title="Mi ubicación">
          <span className="material-icons-outlined">location_on</span>
        </button>

        <div className={styles.divider} />

        <button className={styles.btn} title="Capas del mapa">
          <span className="material-icons-outlined">layers</span>
        </button>

        <button className={styles.btn} title="Medir">
          <span className="material-icons-outlined">image</span>
        </button>
        <button className={styles.btn} title="Zoom in">
          <span className="material-icons-outlined">brush</span>
        </button>
        <button className={styles.btn} title="Galería">
          <span className="material-icons-outlined">upload</span>
        </button>
      </div>
    </div>
  );
}

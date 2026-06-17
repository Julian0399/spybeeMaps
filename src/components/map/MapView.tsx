"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import styles from "./MapView.module.scss";
import MapToolbar from "./MapToolbar";
import MapStyles from "./MapStyles";
import { useIncidentStore } from "@/store/incidentStore";

export default function MapView() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mapStyle, setMapStyle] = useState<"2D" | "3D">("2D");
  const [is360, setIs360] = useState(false);
  const [currentMapStyle, setCurrentMapStyle] = useState(
    "mapbox://styles/mapbox/streets-v12",
  );
  const { incidents, isCreating, setClickedLocation, setShowCreateModal } =
    useIncidentStore();
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-74.0596, 4.7066],
      zoom: 16,
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.easeTo({
      pitch: mapStyle === "3D" ? 60 : 0,
      duration: 500,
    });
  }, [mapStyle]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    incidents.forEach((inc) => {
      const colors: Record<string, string> = {
        alta: "#ef4444",
        media: "#f59e0b",
        baja: "#22c55e",
      };

      const el = document.createElement("div");
    el.style.width = "36px";
    el.style.height = "36px";
    el.style.borderRadius = "50%";
    el.style.background = "#f5a623";
    el.style.display = "flex";
    el.style.alignItems = "center";
    el.style.justifyContent = "center";
    el.style.cursor = "pointer";
    el.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";

    const icon = document.createElement("span");
    icon.className = "material-icons-outlined";
    icon.style.fontSize = "20px";
    icon.style.color = "#000";
    icon.textContent = "warning";
    el.appendChild(icon);

      const popup = new mapboxgl.Popup({ offset: 25, closeButton: true })
        .setHTML(`
      <div style="padding: 8px; min-width: 200px">
        <div style="font-weight: 600; font-size: 14px; margin-bottom: 8px">${inc.title}</div>
        <div style="display: flex; align-items: center; gap: 6px; font-size: 12px; color: #6b7280; margin-bottom: 6px">
          <span class="material-icons-outlined" style="font-size: 14px">calendar_today</span>
          ${new Date(inc.dueDate).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })}
        </div>
        <div style="display: flex; align-items: center; gap: 6px; font-size: 12px; color: #6b7280; margin-bottom: 8px">
          <span class="material-icons-outlined" style="font-size: 14px">location_on</span>
          ${inc.location.details || "Sin detalles de ubicación"}
        </div>
      </div>
    `);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([inc.location.lng, inc.location.lat])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [incidents]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.getCanvas().style.cursor = isCreating ? "crosshair" : "";
  }, [isCreating]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleClick = (e: mapboxgl.MapMouseEvent) => {
      if (!useIncidentStore.getState().isCreating) return;

      setClickedLocation({ lat: e.lngLat.lat, lng: e.lngLat.lng });
      setShowCreateModal(true);
    };

    map.on("click", handleClick);

    return () => {
      map.off("click", handleClick);
    };
  }, [setClickedLocation, setShowCreateModal]);

  const handleStyleChange = (style: string, is3D?: boolean) => {
    const map = mapRef.current;
    if (!map) return;

    setCurrentMapStyle(style);
    map.setStyle(style);

    map.once("style.load", () => {
      if (is3D) {
        map.easeTo({ pitch: 60, duration: 500 });
        setMapStyle("3D");
      } else {
        map.easeTo({ pitch: 0, duration: 500 });
        setMapStyle("2D");
      }
    });
  };

  return (
    <div className={styles.mapContainer}>
      <div ref={mapContainer} className={styles.map} />
      <MapToolbar />
      <MapStyles
        currentStyle={currentMapStyle}
        onChangeStyle={handleStyleChange}
      />

      <div className={styles.viewToggleContainer}>
        <div className={styles.viewToggle}>
          <button
            className={mapStyle === "2D" ? styles.active : undefined}
            onClick={() => setMapStyle("2D")}
          >
            2D
          </button>
          <button
            className={mapStyle === "3D" ? styles.active : undefined}
            onClick={() => setMapStyle("3D")}
          >
            3D
          </button>
        </div>

        <button className={styles.toolBtn} title="Timelapse">
          <span className="material-icons-outlined">history_toggle_off</span>
        </button>
        <button className={styles.toolBtn} title="Video">
          <span className="material-icons-outlined">movie</span>
        </button>

        <div className={styles.degree}>
          360°
          <button
            className={`${styles.toggle} ${is360 ? styles.toggleActive : ""}`}
            onClick={() => setIs360(!is360)}
          />
        </div>
      </div>
    </div>
  );
}

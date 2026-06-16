"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import styles from "./MapView.module.scss";
import MapToolbar from "./MapToolbar";
import MapStyles from "./MapStyles";

export default function MapView() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mapStyle, setMapStyle] = useState<"2D" | "3D">("2D");
  const [is360, setIs360] = useState(false);
  const [currentMapStyle, setCurrentMapStyle] = useState(
    "mapbox://styles/mapbox/streets-v12",
  );

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

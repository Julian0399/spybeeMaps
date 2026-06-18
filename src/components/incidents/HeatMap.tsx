"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MockIncident } from "@/types/mockIncident";
import styles from "./HeatMap.module.scss";

interface Props {
  incidents: MockIncident[];
}

export default function HeatMap({ incidents }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-74.06, 4.653],
      zoom: 14,
    });

    map.on("load", () => {
      const geojson = {
        type: "FeatureCollection" as const,
        features: incidents
          .filter((i) => !i.deleted && i.coordinates)
          .map((inc) => ({
            type: "Feature" as const,
            properties: { priority: inc.priority },
            geometry: {
              type: "Point" as const,
              coordinates: [inc.coordinates.lng, inc.coordinates.lat],
            },
          })),
      };

      map.addSource("incidents-heat", {
        type: "geojson",
        data: geojson,
      });

      map.addLayer({
        id: "incidents-heat-layer",
        type: "heatmap",
        source: "incidents-heat",
        paint: {
          "heatmap-weight": 1,
          "heatmap-intensity": 1.5,
          "heatmap-radius": 30,
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0, "rgba(0,0,0,0)",
            0.2, "#ffffb2",
            0.4, "#fecc5c",
            0.6, "#fd8d3c",
            0.8, "#e31a1c",
            1, "#800026",
          ],
          "heatmap-opacity": 0.8,
        },
      });

      map.addLayer({
        id: "incidents-points",
        type: "circle",
        source: "incidents-heat",
        paint: {
          "circle-radius": 5,
          "circle-color": "#f5a623",
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
        },
      });
    });

    return () => map.remove();
  }, [incidents]);

  return (
    <div className={styles.container}>
      <div className={styles.title}>Mapa de calor geográfico</div>
      <div className={styles.subtitle}>Zonas con más incidencias dentro de la obra</div>
      <div ref={mapContainer} className={styles.map} />
    </div>
  );
}
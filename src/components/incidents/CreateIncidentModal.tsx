"use client";

import { useState, useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { useIncidentStore } from "@/store/incidentStore";
import { IncidentFormData, CATEGORIES, PRIORITIES } from "@/types/incident";
import styles from "./CreateIncidentModal.module.scss";
import Select from "react-select";
import TagTreeSelect from "./TagTreeSelect";
import { USERS } from "@/data/users";
import FileUpload from "./FileUpload";
import MapStyles from "../map/MapStyles";

export default function CreateIncidentModal() {
  const { clickedLocation, setShowCreateModal, addIncident, setIsCreating } =
    useIncidentStore();

  const miniMapRef = useRef<HTMLDivElement>(null);

  const [miniMapStyle, setMiniMapStyle] = useState("mapbox://styles/mapbox/streets-v12");
  const [form, setForm] = useState<IncidentFormData>({
    title: "",
    description: "",
    dueDate: "",
    category: "" as IncidentFormData["category"],
    priority: "" as IncidentFormData["priority"],
    tags: [],
    assignees: [],
    observers: [],
    location: {
      lat: clickedLocation?.lat || 0,
      lng: clickedLocation?.lng || 0,
      details: "",
    },
    attachments: { images: [], videos: [], documents: [] },
  });

  const miniMapInstance = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!miniMapRef.current || !clickedLocation) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

    const map = new mapboxgl.Map({
      container: miniMapRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [clickedLocation.lng, clickedLocation.lat],
      zoom: 17,
    });

    map.addControl(new mapboxgl.FullscreenControl(), "top-right");
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    const marker = new mapboxgl.Marker({ color: "#f5a623", draggable: true })
      .setLngLat([clickedLocation.lng, clickedLocation.lat])
      .addTo(map);

     marker.on("dragend", () => {
      const lngLat = marker.getLngLat();
      setForm((prev) => ({
        ...prev,
        location: { ...prev.location, lat: lngLat.lat, lng: lngLat.lng },
      }));
    });

    map.on("click", (e) => {
      marker.setLngLat(e.lngLat);
      setForm((prev) => ({
        ...prev,
        location: { ...prev.location, lat: e.lngLat.lat, lng: e.lngLat.lng },
      }));
    });

    miniMapInstance.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
      miniMapInstance.current = null;
      markerRef.current = null;
    };
  }, [clickedLocation]);

  const changeMiniMapStyle = (style: string, is3D?: boolean) => {
    const map = miniMapInstance.current;
    const marker = markerRef.current;
    if (!map || !marker) return;

    setMiniMapStyle(style);
    map.setStyle(style);

    map.once("style.load", () => {
      if (is3D) {
        map.easeTo({ pitch: 60, duration: 500 });
      } else {
        map.easeTo({ pitch: 0, duration: 500 });
      }
    });
  };
  const update = (key: keyof IncidentFormData, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleClose = () => {
    setShowCreateModal(false);
    setIsCreating(false);
  };

  const handleSubmit = () => {
    if (!form.title || !form.description || !form.dueDate || !form.category)
      return;
    addIncident(form);
  };

  const isValid =
    form.title && form.description && form.dueDate && form.category;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Crear Incidencia</h2>
          <button className={styles.closeBtn} onClick={handleClose}>
            <span className="material-icons-outlined">close</span>
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.field}>
            <label className={styles.label}>
              <span>* </span>Título
            </label>
            <input
              className={styles.input}
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              <span>* </span>Descripción
            </label>
            <textarea
              className={styles.textarea}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              <span>* </span>Fecha de vencimiento
            </label>
            <input
              className={styles.input}
              type="date"
              value={form.dueDate}
              onChange={(e) => update("dueDate", e.target.value)}
            />
          </div>

          <div className={styles.fieldRow}>
            <div style={{ flex: 1 }}>
              <Select
                placeholder="Seleccionar categoría"
                options={CATEGORIES}
                formatOptionLabel={(option) => (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: option?.color ?? "transparent",
                      }}
                    />
                    {option?.label ?? ""}
                  </div>
                )}
                value={
                  CATEGORIES.find(
                    (c) => (c.value as string) === form.category,
                  ) || null
                }
                onChange={(option) => update("category", option?.value ?? "")}
              />
            </div>
            <button className={styles.manageBtn}>Gestionar categorías</button>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              <span>* </span>Prioridad
            </label>
            <select
              className={styles.select}
              value={form.priority}
              onChange={(e) =>
                update("priority", e.target.value as "baja" | "media" | "alta")
              }
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Etiquetas</label>
            <div className={styles.fieldRow}>
              <TagTreeSelect
                selected={form.tags}
                onChange={(tags) => update("tags", tags)}
              />
              <button className={styles.manageBtn}>Manage</button>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Asignados</label>
            <Select
              isMulti
              placeholder="Buscar y seleccionar asignados..."
              options={USERS}
              value={USERS.filter((u) => form.assignees.includes(u.value))}
              onChange={(selected) =>
                update(
                  "assignees",
                  selected.map((s) => s.value),
                )
              }
              styles={{
                multiValue: (base) => ({
                  ...base,
                  borderRadius: 12,
                }),
              }}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Observadores</label>
            <Select
              isMulti
              placeholder="Seleccionar observadores..."
              options={USERS}
              value={USERS.filter((u) => form.observers.includes(u.value))}
              onChange={(selected) =>
                update(
                  "observers",
                  selected.map((s) => s.value),
                )
              }
              styles={{
                multiValue: (base) => ({
                  ...base,
                  borderRadius: 12,
                }),
              }}
            />
          </div>

          <div className={styles.coords}>
            <input
              className={styles.input}
              value={form.location.lat.toFixed(6)}
              readOnly
              placeholder="Latitud"
            />
            <input
              className={styles.input}
              value={form.location.lng.toFixed(6)}
              readOnly
              placeholder="Longitud"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Detalles de localización</label>
            <input
              className={styles.input}
              value={form.location.details}
              onChange={(e) =>
                update("location", {
                  ...form.location,
                  details: e.target.value,
                })
              }
            />
          </div>

           <div className={styles.field}>
            <label className={styles.label}>Vista previa del mapa</label>
            <div className={styles.miniMapWrapper}>
              <div ref={miniMapRef} className={styles.miniMap} />
              <MapStyles
                currentStyle={miniMapStyle}
                onChangeStyle={changeMiniMapStyle}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.labelAdd}>Archivos adjuntos</label>
            <FileUpload onFilesChange={(files) => console.log(files)} />
          </div>

   
        </div>

        <div className={styles.footer}>
          <button className={styles.btn} onClick={handleClose}>
            Cancelar
          </button>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={handleSubmit}
            disabled={!isValid}
          >
            Crear Incidencia
          </button>
        </div>
      </div>
    </div>
  );
}

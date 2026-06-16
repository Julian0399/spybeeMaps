"use client";

import styles from "./MapStyles.module.scss";

const mapStyles = [
  {
    icon: "settings_input_antenna",
    label: "Satélite",
    style: "mapbox://styles/mapbox/satellite-streets-v12",
  },
  {
    icon: "location_city",
    label: "3D Edificios",
    style: "mapbox://styles/mapbox/standard",
    is3D: true,
  },
  {
    icon: "map",
    label: "Normal",
    style: "mapbox://styles/mapbox/streets-v12",
  },
  {
    icon: "terrain",
    label: "Relieve",
    style: "mapbox://styles/mapbox/outdoors-v12",
  },
];

interface Props {
  currentStyle: string;
  onChangeStyle: (style: string, is3D?: boolean) => void;
}

export default function MapStyles({ currentStyle, onChangeStyle }: Props) {
  return (
    <div className={styles.container}>
      {mapStyles.map((item) => (
        <button
          key={item.label}
          className={`${styles.btn} ${
            currentStyle === item.style ? styles.btnActive : ""
          }`}
          onClick={() => onChangeStyle(item.style, item.is3D)}
          title={item.label}
        >
          <span className="material-icons-outlined">{item.icon}</span>
        </button>
      ))}
    </div>
  );
}
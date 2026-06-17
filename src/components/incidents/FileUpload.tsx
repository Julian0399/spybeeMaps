"use client";

import { useRef, useState } from "react";
import styles from "./FileUpload.module.scss";

interface UploadedFile {
  file: File;
  preview: string;
  type: "image" | "video" | "document";
}

interface Props {
  onFilesChange: (files: UploadedFile[]) => void;
}

export default function FileUpload({ onFilesChange }: Props) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [activeTab, setActiveTab] = useState<"media" | "docs">("media");
  const inputRef = useRef<HTMLInputElement>(null);

  const getFileType = (file: File): UploadedFile["type"] => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    return "document";
  };

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;

    const uploaded: UploadedFile[] = Array.from(newFiles).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      type: getFileType(file),
    }));

    const updated = [...files, ...uploaded];
    setFiles(updated);
    onFilesChange(updated);
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onFilesChange(updated);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const mediaFiles = files.filter((f) => f.type === "image" || f.type === "video");
  const docFiles = files.filter((f) => f.type === "document");

  return (
    <div>
      <div
        className={styles.dropzone}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <span className="material-icons-outlined" style={{ fontSize: 28, color: "#9ca3af" }}>
          cloud_upload
        </span>
        <p>Arrastra archivos aquí o haz clic para seleccionar</p>
        <p className={styles.hint}>Imágenes, videos o documentos</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx"
          onChange={(e) => handleFiles(e.target.files)}
          style={{ display: "none" }}
        />
      </div>

      <div className={styles.tabs}>
        <button
          className={activeTab === "media" ? styles.tabActive : undefined}
          onClick={() => setActiveTab("media")}
        >
          Imágenes y Videos ({mediaFiles.length})
        </button>
        <button
          className={activeTab === "docs" ? styles.tabActive : undefined}
          onClick={() => setActiveTab("docs")}
        >
          Documentos ({docFiles.length})
        </button>
      </div>

      <div className={styles.fileGrid}>
        {activeTab === "media" ? (
          mediaFiles.length > 0 ? (
            mediaFiles.map((f, i) => (
              <div key={i} className={styles.fileCard}>
                {f.type === "image" ? (
                  <img src={f.preview} alt={f.file.name} className={styles.preview} />
                ) : (
                  <video src={f.preview} className={styles.preview} />
                )}
                <span className={styles.fileName}>{f.file.name}</span>
                <button
                  className={styles.removeBtn}
                  onClick={() => removeFile(files.indexOf(f))}
                >
                  <span className="material-icons-outlined" style={{ fontSize: 16 }}>close</span>
                </button>
              </div>
            ))
          ) : (
            <p className={styles.empty}>No hay medios disponibles</p>
          )
        ) : docFiles.length > 0 ? (
          docFiles.map((f, i) => (
            <div key={i} className={styles.docCard}>
              <span className="material-icons-outlined" style={{ fontSize: 24, color: "#6b7280" }}>
                description
              </span>
              <span className={styles.fileName}>{f.file.name}</span>
              <button
                className={styles.removeBtn}
                onClick={() => removeFile(files.indexOf(f))}
              >
                <span className="material-icons-outlined" style={{ fontSize: 16 }}>close</span>
              </button>
            </div>
          ))
        ) : (
          <p className={styles.empty}>No hay documentos adjuntos</p>
        )}
      </div>
    </div>
  );
}
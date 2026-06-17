"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./TagTreeSelect.module.scss";
import { TAG_TREE } from "@/data/tags";

interface Props {
  selected: string[];
  onChange: (tags: string[]) => void;
}

export default function TagTreeSelect({ selected, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleExpand = (label: string) => {
    setExpanded((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const toggleTag = (tag: string) => {
    onChange(
      selected.includes(tag)
        ? selected.filter((t) => t !== tag)
        : [...selected, tag]
    );
  };

  const toggleParent = (parent: (typeof TAG_TREE)[0]) => {
    const allChildren = parent.children || [];
    const allSelected = allChildren.every((c) => selected.includes(c));

    if (allSelected) {
      onChange(selected.filter((t) => !allChildren.includes(t) && t !== parent.label));
    } else {
      const newTags = [...selected];
      allChildren.forEach((c) => {
        if (!newTags.includes(c)) newTags.push(c);
      });
      onChange(newTags);
    }
  };

  const removeTag = (tag: string) => {
    onChange(selected.filter((t) => t !== tag));
  };

  const filtered = TAG_TREE.filter((group) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      group.label.toLowerCase().includes(s) ||
      (group.children ?? []).some((c) => c.toLowerCase().includes(s))
    );
  });

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.inputWrapper} onClick={() => setIsOpen(true)}>
        {selected.map((tag) => (
          <span key={tag} className={styles.selectedTag}>
            {tag}
            <button onClick={(e) => { e.stopPropagation(); removeTag(tag); }}>×</button>
          </span>
        ))}
        <input
          className={styles.searchInput}
          placeholder={selected.length === 0 ? "Selecciona etiquetas" : ""}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
        />
        <span className={`material-icons-outlined ${styles.searchIcon}`}>search</span>
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          {filtered.map((group) => (
            <div key={group.label}>
              <div className={styles.treeItem}>
                {group.children ? (
                  <button
                    className={styles.expandBtn}
                    onClick={() => toggleExpand(group.label)}
                  >
                    <span className="material-icons-outlined" style={{ fontSize: 18 }}>
                      {expanded.includes(group.label) ? "indeterminate_check_box" : "add_box"}
                    </span>
                  </button>
                ) : (
                  <span style={{ width: 20 }} />
                )}
                <div
                  className={`${styles.checkbox} ${
                    group.children
                      ? group.children.every((c) => selected.includes(c))
                        ? styles.checkboxChecked
                        : ""
                      : selected.includes(group.label)
                        ? styles.checkboxChecked
                        : ""
                  }`}
                  onClick={() =>
                    group.children ? toggleParent(group) : toggleTag(group.label)
                  }
                >
                  {(group.children
                    ? group.children.every((c) => selected.includes(c))
                    : selected.includes(group.label)) && "✓"}
                </div>
                <span className={styles.dot} />
                <span
                  className={styles.itemLabel}
                  onClick={() =>
                    group.children ? toggleExpand(group.label) : toggleTag(group.label)
                  }
                >
                  {group.label}
                </span>
              </div>

              {group.children &&
                expanded.includes(group.label) &&
                group.children
                  .filter((c) => !search || c.toLowerCase().includes(search.toLowerCase()))
                  .map((child) => (
                    <div
                      key={child}
                      className={`${styles.treeItem} ${styles.treeChild}`}
                      onClick={() => toggleTag(child)}
                    >
                      <div
                        className={`${styles.checkbox} ${
                          selected.includes(child) ? styles.checkboxChecked : ""
                        }`}
                      >
                        {selected.includes(child) && "✓"}
                      </div>
                      <span className={styles.dot} />
                      <span className={styles.itemLabel}>{child}</span>
                    </div>
                  ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
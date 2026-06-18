"use client";

import { useState, useRef, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import styles from "./Header.module.scss";

export default function Header() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    signOut(() => router.push("/sign-in"));
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <img
          src="https://framerusercontent.com/images/TTtZTL2AMihMgjjJZiD92s2wS0Q.png?scale-down-to=512&width=1818&height=900 512w,https://framerusercontent.com/images/TTtZTL2AMihMgjjJZiD92s2wS0Q.png?scale-down-to=1024&width=1818&height=900 1024w,https://framerusercontent.com/images/TTtZTL2AMihMgjjJZiD92s2wS0Q.png?width=1818&height=900 1818w"
          alt="Spybee"
          className={styles.logo}
        />
      </div>

      <span className={styles.project}>Proyecto Onboarding</span>

      <div className={styles.right}>
        <button className={styles.iconBtn} title="Idioma">
          <img
            src="https://flagcdn.com/w40/co.png"
            alt="Colombia"
            style={{ width: 24, height: 16, borderRadius: 2 }}
          />
        </button>

        <div className={styles.userMenu} ref={menuRef}>
          <div
            className={styles.userInfo}
            onClick={() => setShowMenu(!showMenu)}
          >
            <div className={styles.avatar}>
              <span className="material-icons-outlined" style={{ fontSize: 18 }}>
                person
              </span>
            </div>
            <div className={styles.userName}>
              <span>{user?.fullName || "Usuario"}</span>
              <span>Superadmin</span>
            </div>
            <span className="material-icons-outlined" style={{ fontSize: 18 }}>
              {showMenu ? "expand_less" : "expand_more"}
            </span>
          </div>

          {showMenu && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownUser}>
                <span>{user?.fullName || "Usuario"}</span>
                <span>{user?.primaryEmailAddress?.emailAddress || ""}</span>
              </div>
              <button className={styles.dropdownItem} onClick={handleSignOut}>
                <span className="material-icons-outlined" style={{ fontSize: 18 }}>
                  logout
                </span>
                Cerrar sesión
              </button>
            </div>
          )}
        </div>

        <button className={styles.iconBtn} title="Ayuda">
          <span className="material-icons-outlined">help_outline</span>
        </button>
      </div>
    </header>
  );
}
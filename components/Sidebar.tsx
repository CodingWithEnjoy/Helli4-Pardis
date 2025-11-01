"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EmojiProvider, Emoji } from "react-apple-emojis";
import emojiData from "react-apple-emojis/src/data.json";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/login") return null;

  // --- Dark mode state ---
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) return saved === "true";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem("pardis_cookie");
    router.push("/login");
  };

  // 🦖 Double click handler — open /dino
  const handleDoubleClickTop = () => {
    router.push("/dino");
  };

  return (
    <EmojiProvider data={emojiData}>
      <div className={styles.sidebar}>
        {/* Top Section */}
        <div className={styles.top} onDoubleClick={handleDoubleClickTop}>
          <h2>پردیس حلی ۴</h2>
        </div>

        {/* Middle Section */}
        <div className={styles.middle}>
          <ul>
            <li className={pathname === "/dashboard" ? styles.activeLink : ""}>
              <Link href="/dashboard">
                <Image src="/img/home.svg" height={20} width={20} alt="Home" />{" "}
                خانه
              </Link>
            </li>
            <li
              className={pathname.startsWith("/exams") ? styles.activeLink : ""}
            >
              <Link href="/exams">
                <Image
                  src="/img/award.svg"
                  height={20}
                  width={20}
                  alt="Exams"
                />{" "}
                آزمون‌ها
              </Link>
            </li>
            <li
              className={
                pathname.startsWith("/fooladi") ? styles.activeLink : ""
              }
            >
              <Link href="/fooladi">
                <Image
                  src="/img/check-circle.svg"
                  height={20}
                  width={20}
                  alt="Fooladi"
                />{" "}
                خشم فولادی
              </Link>
            </li>
            <li
              className={pathname.startsWith("/pack") ? styles.activeLink : ""}
            >
              <Link href="/pack">
                <Image
                  src="/img/package.svg"
                  height={20}
                  width={20}
                  alt="pack"
                />{" "}
                پک 2.5
              </Link>
            </li>
            <li
              className={
                pathname.startsWith("/gallery") ? styles.activeLink : ""
              }
            >
              <Link href="/gallery">
                <Image
                  src="/img/image.svg"
                  height={20}
                  width={20}
                  alt="gallery"
                />{" "}
                گالری
              </Link>
            </li>
          </ul>
        </div>

        {/* Bottom Section */}
        <div className={styles.bottom}>
          {/* Dark Mode Toggle */}
          <button className={styles.toggleButton} onClick={toggleDarkMode}>
            {darkMode ? (
              <>
                لایت مود{" "}
                <Emoji
                  className={styles.emoji}
                  name="full-moon-face"
                  width={22}
                />
              </>
            ) : (
              <>
                دارک مود{" "}
                <Emoji
                  className={styles.emoji}
                  name="new-moon-face"
                  width={22}
                />
              </>
            )}
          </button>

          {/* Logout */}
          <button onClick={handleLogout} className={styles.logoutButton}>
            خروج{" "}
            <Image src="/img/log-out.svg" height={20} width={20} alt="Logout" />
          </button>
        </div>
      </div>
    </EmojiProvider>
  );
}

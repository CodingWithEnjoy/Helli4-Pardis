"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getExams } from "@/lib/api";
import ExamCard from "@/components/ExamCard";
import styles from "./page.module.css";

interface Exam {
  eid: string;
  title: string;
  date: string; // format: ۱۴۰۳/۰۹/۱۸
}

export default function ExamsPage() {
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"dahom" | "yazdahom">("yazdahom");

  useEffect(() => {
    const cookie = localStorage.getItem("pardis_cookie");
    if (!cookie) {
      router.push("/login");
      return;
    }

    getExams(cookie)
      .then((res: any[]) => {
        const sortedExams: Exam[] = res
          .map((item) => ({
            eid: item.eid,
            title: item.title,
            date: item.date,
          }))
          .sort((a, b) => {
            const da = persianDateToNumber(a.date);
            const db = persianDateToNumber(b.date);
            return db - da; // latest first
          });
        setExams(sortedExams);
      })
      .catch((e) => alert(e.message))
      .finally(() => setLoading(false));
  }, [router]);

  const handleSelectExam = (eid: string) => {
    router.push(`/exams/${eid}`);
  };

  // --- Utility: Convert Persian digits to English digits ---
  const toEnglishDigits = (str: string) =>
    str.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));

  // --- Convert Persian date (۱۴۰۳/۰۹/۱۸) → comparable number like 14030918 ---
  const persianDateToNumber = (persianDate: string) => {
    const eng = toEnglishDigits(persianDate);
    const parts = eng.split("/");
    if (parts.length !== 3) return 0;
    const [y, m, d] = parts.map((p) => p.padStart(2, "0"));
    return Number(`${y}${m}${d}`);
  };

  const cutoff = persianDateToNumber("1404/01/30");

  const dahomExams = exams.filter((e) => persianDateToNumber(e.date) < cutoff);
  const yazdahomExams = exams.filter(
    (e) => persianDateToNumber(e.date) >= cutoff
  );

  const shownExams = activeTab === "yazdahom" ? yazdahomExams : dahomExams;

  return (
    <div className={styles.containerWrapper}>
      <h1 className={styles.title}>آزمون‌ها</h1>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${
            activeTab === "yazdahom" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("yazdahom")}
        >
          یازدهم
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === "dahom" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("dahom")}
        >
          دهم
        </button>
      </div>

      {/* Exam grid */}
      <div className={styles.examGrid}>
        {loading && <p>در حال بارگذاری آزمون‌ها...</p>}
        {!loading && shownExams.length === 0 && <p>آزمونی یافت نشد.</p>}
        {shownExams.map((exam) => (
          <ExamCard
            key={exam.eid}
            eid={exam.eid}
            title={exam.title}
            date={exam.date}
            onClick={() => handleSelectExam(exam.eid)}
          />
        ))}
      </div>
    </div>
  );
}

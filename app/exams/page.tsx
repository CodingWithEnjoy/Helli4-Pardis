"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getExams } from "@/lib/api";
import ExamCard from "@/components/ExamCard";
import styles from "./page.module.css";
import { EmojiProvider, Emoji } from "react-apple-emojis";
import emojiData from "react-apple-emojis/src/data.json";

interface Exam {
  eid: string;
  title: string;
  date: string;
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
            return db - da;
          });
        setExams(sortedExams);
      })
      .catch((e) => alert(e.message))
      .finally(() => setLoading(false));
  }, [router]);

  const handleSelectExam = (eid: string) => {
    router.push(`/exams/${eid}`);
  };

  const toEnglishDigits = (str: string) =>
    str.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));

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
      <h1 className={styles.title}>
        آزمون ها
        <EmojiProvider data={emojiData}>
          <Emoji className={styles.emoji} name="cold-face" width={32} />
        </EmojiProvider>
      </h1>

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

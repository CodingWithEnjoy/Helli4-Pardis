"use client";

import React, { useEffect, useState } from "react";
import styles from "./exam.module.css";

type Exam = {
  meta: {
    student: string;
    exam: string;
    class: string;
    school: string;
  };
  courses: {
    index: string;
    name: string;
    score: string;
    type: string;
    tscore: string;
    q_from: string;
    q_to: string;
    coefficient: string;
    avg_class: string;
    avg_school: string;
    avg_total: string;
    rank_class: string;
    rank_school: string;
    rank_total: string;
    maxScore: string;
    firstScore: string;
    correct: string;
    wrong: string;
    unanswered: string;
    deleted: string;
    links: string[];
  }[];
  overall: {
    score: { total: string; public: string; private: string };
    tscore: { total: string; public: string; private: string };
  };
  participants: { total: string; school: string; class: string };
  questionGrid: {
    questionNumbers: string[];
    yourAnswers: string[];
    correctAnswers: string[];
    statuses: string[];
  };
};

export default function ExamPageClient({ examId }: { examId: string }) {
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchExam() {
      try {
        const cookie = localStorage.getItem("pardis_cookie");
        console.log("کوکی از localStorage:", cookie);
        console.log("در حال دریافت آزمون با شناسه:", examId);

        if (!cookie) throw new Error("کوکی یافت نشد. لطفاً وارد شوید.");

        const res = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_BASE
          }/get-exam?cookie=${encodeURIComponent(
            cookie
          )}&eid=${encodeURIComponent(examId)}`
        );

        const data = await res.json();
        console.log("داده خام دریافت شده از API:", data);

        if (!res.ok || !data.success)
          throw new Error(data.error || "بارگیری اطلاعات آزمون ناموفق بود");

        console.log("اطلاعات آزمون با موفقیت دریافت شد:", data.exam);
        setExam(data.exam);
      } catch (err: any) {
        console.error("خطا در دریافت آزمون:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchExam();
  }, [examId]);

  if (loading) return <p className={styles.center}>در حال بارگیری آزمون…</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!exam) return null;

  return (
    <div className={styles.container}>
      <h1>{exam.meta.exam}</h1>
      <p>
        <strong>دانش‌آموز:</strong> {exam.meta.student} | <strong>کلاس:</strong>{" "}
        {exam.meta.class} | <strong>مدرسه:</strong> {exam.meta.school}
      </p>

      <section>
        <h2>نتایج کلی</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th></th>
              <th>کل</th>
              <th>عمومی</th>
              <th>خصوصی</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>نمره</td>
              <td>{exam.overall.score.total}</td>
              <td>{exam.overall.score.public}</td>
              <td>{exam.overall.score.private}</td>
            </tr>
            <tr>
              <td>تراز</td>
              <td>{exam.overall.tscore.total}</td>
              <td>{exam.overall.tscore.public}</td>
              <td>{exam.overall.tscore.private}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>دروس</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>نام درس</th>
              <th>نمره</th>
              <th>میانگین کلاس</th>
              <th>میانگین مدرسه</th>
              <th>رتبه کلاس</th>
              <th>رتبه مدرسه</th>
              <th>صحیح</th>
              <th>غلط</th>
              <th>پاسخ داده نشده</th>
            </tr>
          </thead>
          <tbody>
            {exam.courses.map((c) => (
              <tr key={c.index}>
                <td>{c.index}</td>
                <td>{c.name}</td>
                <td>{c.score}</td>
                <td>{c.avg_class}</td>
                <td>{c.avg_school}</td>
                <td>{c.rank_class}</td>
                <td>{c.rank_school}</td>
                <td>{c.correct}</td>
                <td>{c.wrong}</td>
                <td>{c.unanswered}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>جدول سوالات</h2>
        <div className={styles.grid}>
          {exam.questionGrid.questionNumbers.map((q, i) => (
            <div
              key={i}
              className={`${styles.cell} ${
                exam.questionGrid.statuses[i] === "ص"
                  ? styles.correct
                  : exam.questionGrid.statuses[i] === "غ"
                  ? styles.wrong
                  : ""
              }`}
            >
              <span className={styles.qnum}>{q}</span>
              <span className={styles.ans}>
                {exam.questionGrid.yourAnswers[i] || "-"}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

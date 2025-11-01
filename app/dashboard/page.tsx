"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getExams, getUserData } from "@/lib/api";
import ExamCard from "@/components/ExamCard";
import styles from "./page.module.css";

interface Exam {
  eid: string;
  date: string;
  title: string;
}

interface UserData {
  profileImage?: string;
  userId?: string;
  fullName?: string;
  role?: string;
  group?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [cookie, setCookie] = useState<string | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const ck = localStorage.getItem("pardis_cookie");
    if (!ck) {
      router.push("/login");
      return;
    }

    setCookie(ck);
    setLoading(true);

    Promise.all([getUserData(ck), getExams(ck)])
      .then(([userRes, examRes]) => {
        setUserData(userRes);
        const exams: Exam[] = examRes.map((item: any) => ({
          eid: item.eid,
          title: item.title,
          date: item.date,
        }));
        setExams(exams);
      })
      .catch((e) => alert(e.message))
      .finally(() => setLoading(false));
  }, [router]);

  const handleSelectExam = (eid: string) => {
    router.push(`/exams/${eid}`);
  };

  if (!mounted) return null;

  return (
    <div className={styles.containerWrapper}>
      {/* Left side extra cards */}
      <div className={styles.sideCards}>
        <div className={styles.socialCard}>
          <h2>کانال های تلگرام</h2>

          <div className={styles.socialButtons}>
            <a href="">
              <Image
                src="/img/telegram.svg"
                height={20}
                width={20}
                alt="Picture of the author"
              />{" "}
              دهم (Helli 4 Club)
            </a>
            <a href="">
              <Image
                src="/img/telegram.svg"
                height={20}
                width={20}
                alt="Picture of the author"
              />{" "}
              یازدهم (Hell 4)
            </a>
            <a href="">
              <Image
                src="/img/telegram.svg"
                height={20}
                width={20}
                alt="Picture of the author"
              />{" "}
              دوازدهم (Helli 4 core)
            </a>
            <a href="">
              <Image
                src="/img/telegram.svg"
                height={20}
                width={20}
                alt="Picture of the author"
              />{" "}
              کلاس های علامه حلی 4
            </a>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={styles.container}>
        {/* User Info */}
        {userData && (
          <div className={styles.userInfo}>
            {userData.profileImage && (
              <img
                src={userData.profileImage}
                alt="Profile"
                className={styles.profileImage}
              />
            )}
            <div className={styles.userData}>
              <h2 className={styles.fullName}>{userData.fullName}</h2>
              <p>
                <b>کد ملی:</b> {userData.userId}
              </p>
              <p>
                <b>کلاس:</b> {userData.group}
              </p>
              {userData.role && (
                <p>
                  <b>سمت:</b> {userData.role}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Exams Section */}
        <div className={styles.examGrid}>
          {loading && <p>Loading exams...</p>}
          {!loading && exams.length === 0 && <p>No exams found.</p>}

          {exams
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            ) // latest first
            .slice(0, 3) // only latest 3
            .map((exam) => (
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
    </div>
  );
}

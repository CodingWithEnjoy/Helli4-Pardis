// lib/api.ts

export interface Exam {
  id: string;
  name?: string;
  date?: string;
  [key: string]: unknown;
}

export interface UserData {
  profileImage?: string;
  userId?: string;
  fullName?: string;
  role?: string;
  group?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://helli4-pardis-backend.onrender.com/";

/**
 * 🔑 Get authentication cookie/token
 */
export async function getCookie(name: string, pass: string): Promise<string> {
  const res = await fetch(
    `${API_BASE}/get-cookie?name=${encodeURIComponent(
      name
    )}&pass=${encodeURIComponent(pass)}`
  );
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error("نام کاربری یا رمز عبور اشتباهه");
  return data.token;
}

/**
 * 📋 Get list of exams
 */
export async function getExams(cookie: string): Promise<Exam[]> {
  const res = await fetch(
    `${API_BASE}/get-exams?cookie=${encodeURIComponent(cookie)}`
  );
  const data = await res.json();
  if (!res.ok || !data.success)
    throw new Error(data.error || "Failed to get exams");
  return data.exams;
}

/**
 * 📄 Get single exam details
 */
export async function getExam(cookie: string, eid: string) {
  const res = await fetch(
    `${API_BASE}/get-exam?cookie=${encodeURIComponent(
      cookie
    )}&eid=${encodeURIComponent(eid)}`
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch exam: ${res.status} - ${text}`);
  }

  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Invalid response");
  return data.exam;
}

/**
 * 👤 Get user dashboard info (profile)
 */
export async function getUserData(cookie: string): Promise<UserData> {
  const res = await fetch(
    `${API_BASE}/user-data?cookie=${encodeURIComponent(cookie)}`
  );
  const data = await res.json();
  if (!res.ok || !data.success)
    throw new Error(data.error || "Failed to fetch user data");
  return data.user;
}

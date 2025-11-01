"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const cookie = localStorage.getItem("pardis_cookie");

    if (cookie) {
      // ✅ Already logged in
      router.replace("/dashboard");
    } else {
      // 🚪 Not logged in
      router.replace("/login");
    }
  }, [router]);

  // Optionally render a loading state
  return (
    <div className="flex items-center justify-center min-h-screen text-lg text-gray-600">
      Redirecting...
    </div>
  );
}

"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "@/lib/api";
import styles from "./page.module.css";

interface Account {
  name: string;
  pass: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [recentAccounts, setRecentAccounts] = useState<Account[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("pardis_recent_accounts");
    if (stored) setRecentAccounts(JSON.parse(stored));
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const cookie = await getCookie(name, pass);
      localStorage.setItem("pardis_cookie", cookie);

      const updatedAccounts = [
        { name, pass },
        ...recentAccounts.filter((a) => a.name !== name),
      ];
      setRecentAccounts(updatedAccounts);
      localStorage.setItem(
        "pardis_recent_accounts",
        JSON.stringify(updatedAccounts.slice(0, 5))
      );

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRecent = (account: Account) => {
    setName(account.name);
    setPass(account.pass);
  };

  return (
    <div className={styles.pageWrapper}>
      <form className={styles.form} onSubmit={handleLogin}>
        <h1 className={styles.title}>Pardis Login</h1>

        {recentAccounts.length > 0 && (
          <div className={styles.recentAccounts}>
            {recentAccounts.map((account) => (
              <button
                type="button"
                key={account.name}
                onClick={() => handleSelectRecent(account)}
                className={styles.recentBtn}
              >
                {account.name}
              </button>
            ))}
          </div>
        )}

        <label className={styles.label}>
          Username
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={styles.input}
          />
        </label>

        <label className={styles.label}>
          Password
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
            className={styles.input}
          />
        </label>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" disabled={loading} className={styles.submitBtn}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

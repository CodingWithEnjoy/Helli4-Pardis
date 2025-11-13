"use client";

import Image from "next/image";
import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { User, Lock } from "lucide-react";
import { getCookie } from "@/lib/api";
import { quotes } from "@/lib/quotes";
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

  const [randomQuote] = useState(
    () => quotes[Math.floor(Math.random() * quotes.length)]
  );

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
      <div className={styles.blob + " " + styles.blob1}></div>
      <div className={styles.blob + " " + styles.blob2}></div>
      <div className={styles.blob + " " + styles.blob3}></div>

      <div className={styles.formContainer}>
        <form className={styles.form} onSubmit={handleLogin}>
          <Image
            src="/img/logo.png"
            height={110}
            width={110}
            alt="Picture of the author"
            className={styles.logo}
          />

          <h1 className={styles.title}>پردیس دانش</h1>

          <p className={styles.description}>
            به پردیس دانش علامه حلی 4 خوش اومدی !
          </p>

          <div className={styles.inputGroup}>
            <User className={styles.inputIcon} size={18} />
            <input
              type="text"
              placeholder="نام کاربری"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <Lock className={styles.inputIcon} size={18} />
            <input
              type="password"
              placeholder="رمز عبور"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
              className={styles.input}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? "در حال ورود ..." : "ورود"}
          </button>

          {recentAccounts.length > 0 && (
            <div className={styles.recentAccountsSection}>
              <div className={styles.recentAccountsTitle}>
                <span></span> یا ورود با <span></span>
              </div>

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
            </div>
          )}
        </form>
      </div>

      <div className={styles.imageSide}>
        <div className={styles.imageSideDescription}>
          <h2 className={styles.quoteText}>“{randomQuote.content}”</h2>

          <p className={styles.quoteAuthor}>- {randomQuote.author}</p>
        </div>
      </div>
    </div>
  );
}

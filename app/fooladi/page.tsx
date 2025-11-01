"use client";

import { JSX, useState } from "react";
import Image from "next/image";
import { EmojiProvider, Emoji } from "react-apple-emojis";
import emojiData from "react-apple-emojis/src/data.json";
import styles from "./page.module.css";

export default function FooladiPage() {
  const [value, setValue] = useState<number | "">("");
  const [result, setResult] = useState<JSX.Element | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (typeof value !== "number") return;

    if (value >= -33 && value <= 10) {
      setResult(
        <Image
          src="/img/go-out.gif"
          alt="Range -33 to 10"
          width={250}
          height={250}
        />
      );
    } else if (value >= 11 && value <= 50) {
      setResult(
        <Image
          src="/img/11-50.jpg"
          alt="Range 11 to 50"
          width={250}
          height={250}
        />
      );
    } else if (value >= 51 && value <= 99) {
      setResult(
        <Image
          src="/img/51-99.jpg"
          alt="Range 51 to 99"
          width={250}
          height={250}
        />
      );
    } else if (value === 100) {
      setResult(<p className={styles.barakala}>باریکلا</p>);
    } else {
      setResult(<p>عدد خارج از بازه معتبر است</p>);
    }
  };

  return (
    <div className={styles.containerWrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>درصد خشم فولادی</h1>
        <p className={styles.info}>
          میتونی بفهمی با درصدی که زدی ، فولادی قراره چیکارت کنه{" "}
          <EmojiProvider data={emojiData}>
            <Emoji className={styles.emoji} name="smiling face with hearts" width={22} />
          </EmojiProvider>
        </p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputWrapper}>
            <input
              type="number"
              min={-33}
              max={100}
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className={styles.input}
              placeholder="درصدت رو وارد کن"
            />
            <button type="submit" className={styles.buttonInside}>
              چک
            </button>
          </div>
        </form>

        {submitted && <div className={styles.result}>{result}</div>}
      </div>
    </div>
  );
}

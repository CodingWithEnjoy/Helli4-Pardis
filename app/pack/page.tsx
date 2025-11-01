"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Confetti from "react-confetti";
import { EmojiProvider, Emoji } from "react-apple-emojis";
import emojiData from "react-apple-emojis/src/data.json";

interface PackSection {
  id: number;
  duration: string;
  content: string;
}

interface Pack {
  packId: string;
  sections: PackSection[];
}

export default function PackPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  // ✅ Helper to save everything
  const saveToLocalStorage = (data: Pack[]) => {
    localStorage.setItem("pack25_multi", JSON.stringify(data));
  };

  // ✅ Load from localStorage when page loads
  useEffect(() => {
    const saved = localStorage.getItem("pack25_multi");
    if (saved) {
      try {
        setPacks(JSON.parse(saved));
      } catch {
        console.error("Error parsing saved packs");
      }
    }
  }, []);

  // ✅ Create new pack
  const createPack = () => {
    const newPack: Pack = {
      packId: Date.now().toString(),
      sections: [
        { id: 1, duration: "۱ ساعت", content: "" },
        { id: 2, duration: "۳۰ دقیقه", content: "" },
        { id: 3, duration: "۱ ساعت", content: "" },
      ],
    };
    const updated = [...packs, newPack];
    setPacks(updated);
    saveToLocalStorage(updated);
  };

  // ✅ Handle typing inside sections
  const handleChange = (
    packId: string,
    sectionId: number,
    newContent: string
  ) => {
    const updated = packs.map((pack) =>
      pack.packId === packId
        ? {
            ...pack,
            sections: pack.sections.map((s) =>
              s.id === sectionId ? { ...s, content: newContent } : s
            ),
          }
        : pack
    );
    setPacks(updated);
    saveToLocalStorage(updated);
  };

  // ✅ Delete a pack
  const deletePack = (packId: string) => {
    const updated = packs.filter((p) => p.packId !== packId);
    setPacks(updated);
    saveToLocalStorage(updated);
  };

  // ✅ Complete a pack (celebration + delete)
  const completePack = (packId: string) => {
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 4000);
    const updated = packs.filter((p) => p.packId !== packId);
    setPacks(updated);
    saveToLocalStorage(updated);
  };

  return (
    <div className={styles.container}>
      {/* Celebration Popup + Confetti */}
      {showCelebration && (
        <>
          <div className={styles.overlay}>
            <img
              src="/img/mazloomi.jpeg"
              alt="Congrats"
              className={styles.gif}
            />
          </div>
          <Confetti width={window.innerWidth} height={window.innerHeight} />
        </>
      )}

      <h1 className={styles.title}>
        پــک ۲.۵{" "}
        <EmojiProvider data={emojiData}>
          <Emoji className={styles.emoji} name="books" width={32} />
        </EmojiProvider>
      </h1>

      <button className={styles.createButton} onClick={createPack}>
        ساخت پک ۲.۵ جدید
      </button>

      {packs.length === 0 && <p className={styles.packPlaceholder}>هنوز پکی ساخته نشده است.</p>}

      <div className={styles.packList}>
        {packs.map((pack) => (
          <div key={pack.packId} className={styles.packCard}>
            <h2 className={styles.packHeader}>🎯 پک جدید</h2>

            {pack.sections.map((section) => (
              <div key={section.id} className={styles.sectionCard}>
                <h3 className={styles.sectionTitle}>{section.duration}</h3>
                <textarea
                  className={styles.textarea}
                  placeholder="نام درس رو بنویس ... "
                  value={section.content}
                  onChange={(e) =>
                    handleChange(pack.packId, section.id, e.target.value)
                  }
                />
              </div>
            ))}

            <div className={styles.packButtons}>
              <button
                className={styles.completeButton}
                onClick={() => completePack(pack.packId)}
              >
                انجام شد{" "}
                <EmojiProvider data={emojiData}>
                  <Emoji
                    className={styles.emoji}
                    name="check-mark-button"
                    width={18}
                  />
                </EmojiProvider>
              </button>
              <button
                className={styles.deleteButton}
                onClick={() => deletePack(pack.packId)}
              >
                حذف{" "}
                <EmojiProvider data={emojiData}>
                  <Emoji
                    className={styles.emoji}
                    name="cross-mark"
                    width={18}
                  />
                </EmojiProvider>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

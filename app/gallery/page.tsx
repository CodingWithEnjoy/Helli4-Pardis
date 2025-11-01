"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { EmojiProvider, Emoji } from "react-apple-emojis";
import emojiData from "react-apple-emojis/src/data.json";

export default function GalleryPage() {
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const context = require.context(
      "../../public/uploads",
      false,
      /\.(png|jpe?g|gif|webp)$/
    );
    const imgs = context
      .keys()
      .map((key: string) => key.replace("./", "/uploads/"));
    setImages(imgs);
  }, []);

  // Close fullscreen with fade-out animation
  const closeFullscreen = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedImage(null);
      setIsClosing(false);
    }, 300); // match CSS fade-out duration
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedImage) closeFullscreen();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [selectedImage]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        گالری تصاویر
        <EmojiProvider data={emojiData}>
          <Emoji
            className={styles.emoji}
            name="camera-with-flash"
            width={32}
          />
        </EmojiProvider>
      </h1>

      {images.length === 0 ? (
        <p>هیچ عکسی یافت نشد.</p>
      ) : (
        <div className={styles.grid}>
          {images.map((src, index) => (
            <div key={index} className={styles.card}>
              <img
                src={src}
                alt={`upload-${index}`}
                className={styles.image}
                onClick={() => setSelectedImage(src)}
              />
            </div>
          ))}
        </div>
      )}

      {selectedImage && (
        <div
          className={`${styles.fullscreenOverlay} ${
            isClosing ? styles.fadeOut : ""
          }`}
          onClick={closeFullscreen}
        >
          <img
            src={selectedImage}
            alt="fullscreen"
            className={styles.fullscreenImage}
          />
        </div>
      )}
    </div>
  );
}

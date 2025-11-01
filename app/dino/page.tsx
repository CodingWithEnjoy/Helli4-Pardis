"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

interface DinoOption {
  name: string;
  image: string;
}

export default function DinoPage() {
  const dinoOptions: DinoOption[] = [
    { name: "جناب فولادی", image: "/img/dino1.png" },
    { name: "مستر یزر", image: "/img/dino2.png" },
    { name: "آقای قلی نژاد", image: "/img/dino3.png" },
    { name: "آقای کرمی", image: "/img/dino4.png" },
  ];

  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedDino, setSelectedDino] = useState<DinoOption>(dinoOptions[0]);
  const [jumping, setJumping] = useState(false);

  const dinoRef = useRef<HTMLDivElement>(null);
  const cactusRef = useRef<HTMLDivElement>(null);
  const gameInterval = useRef<NodeJS.Timeout | null>(null);

  // Load saved dino choice
  useEffect(() => {
    const saved = localStorage.getItem("selectedDino");
    if (saved) {
      const found = dinoOptions.find((d) => d.image === saved);
      if (found) setSelectedDino(found);
    }
  }, []);

  // Save selected dino
  useEffect(() => {
    localStorage.setItem("selectedDino", selectedDino.image);
  }, [selectedDino]);

  // Jump logic
  const handleJump = () => {
    if (!isPlaying || jumping) return;
    setJumping(true);
    dinoRef.current?.classList.add(styles.jump);
    setTimeout(() => {
      dinoRef.current?.classList.remove(styles.jump);
      setJumping(false);
    }, 500);
  };

  // Start / Restart game
  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);

    const cactus = cactusRef.current;
    if (cactus)
      cactus.style.animation = `${styles.moveCactus} 1.8s infinite linear`;

    if (gameInterval.current) clearInterval(gameInterval.current);

    gameInterval.current = setInterval(() => {
      const dino = dinoRef.current;
      const cactus = cactusRef.current;
      if (!dino || !cactus) return;

      const dinoRect = dino.getBoundingClientRect();
      const cactusRect = cactus.getBoundingClientRect();

      // Simple hit detection: only check when cactus near dino bottom
      if (
        cactusRect.left < dinoRect.right - 20 &&
        cactusRect.left > dinoRect.left &&
        dinoRect.bottom > cactusRect.top + 20 &&
        !jumping
      ) {
        if (gameInterval.current) clearInterval(gameInterval.current);
        cactus.style.animation = "none";
        setIsPlaying(false);
        setGameOver(true);
      } else {
        setScore((prev) => prev + 1);
      }
    }, 80);
  };

  // Stop interval on unmount
  useEffect(() => {
    return () => {
      if (gameInterval.current) clearInterval(gameInterval.current);
    };
  }, []);

  // Space key jump
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space") handleJump();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🦖 بازی داینو</h1>

      {!isPlaying && (
        <div className={styles.settings}>
          <label className={styles.label}>انتخاب داینو:</label>
          <select
            className={styles.dropdown}
            value={selectedDino.image}
            onChange={(e) => {
              const chosen = dinoOptions.find(
                (d) => d.image === e.target.value
              );
              if (chosen) setSelectedDino(chosen);
            }}
          >
            {dinoOptions.map((dino) => (
              <option key={dino.image} value={dino.image}>
                {dino.name}
              </option>
            ))}
          </select>

          <div className={styles.preview}>
            <img src={selectedDino.image} alt={selectedDino.name} />
            <p>{selectedDino.name}</p>
          </div>
        </div>
      )}

      <div className={styles.game} onClick={handleJump}>
        <div
          ref={dinoRef}
          className={styles.dino}
          style={{ backgroundImage: `url(${selectedDino.image})` }}
        />
        <div ref={cactusRef} className={styles.cactus} />
      </div>

      <p className={styles.score}>امتیاز: {score}</p>

      <div className={styles.controls}>
        {!isPlaying && !gameOver && (
          <button onClick={startGame} className={styles.startButton}>
            شروع 🕹️
          </button>
        )}
        {gameOver && (
          <button onClick={startGame} className={styles.restartButton}>
            دوباره تلاش کن 🔁
          </button>
        )}
      </div>
    </div>
  );
}

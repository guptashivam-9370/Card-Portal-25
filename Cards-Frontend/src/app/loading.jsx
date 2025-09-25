"use client";
import React, { useState, useEffect } from "react";
import styles from "./_components/loading.module.css";

export default function Loading() {
  const [dots, setDots] = useState("");
  const [loadTime, setLoadTime] = useState(500); // Default load time for fallback
  const [progress, setProgress] = useState(0); // Dynamic progress for the bar

  useEffect(() => {
    // Calculate load time on page load
    const calculateLoadTime = () => {
      // console.log("loading")
      if (window.performance) {
        const navigationEntry = window.performance.getEntriesByType("navigation")[0];
        const totalLoadTime = (navigationEntry?.loadEventEnd - navigationEntry?.startTime ); // Ensure at least 1s
        setLoadTime(totalLoadTime);
      }
    };

    // Trigger when the window finishes loading
    window.addEventListener("load", calculateLoadTime);

    return () => {
      window.removeEventListener("load", calculateLoadTime);
    };
  });

  useEffect(() => {
    // Simulate progress bar filling based on loadTime
    let progressInterval;
    if (loadTime > 0) {
      const stepTime = loadTime / 100; // Divide into 100 steps
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + 1;
          if (next > 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return next;
        });
      }, stepTime);
    }
    return () => clearInterval(progressInterval);
  }, [loadTime]);

  useEffect(() => {
    // Update dots every 0.3 seconds
    // console.log("...");
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 300);
    return () => clearInterval(interval);
  }, []);
  // console.log(".i.");
  return (
    <div className={styles.loadingOverlay}>
      <div className="flex flex-col justify-center items-center h-screen bg-#00001F font-stone text-[#FFEBD3]">
        <div className="flex flex-col">
          <h1 className="text-5xl font-semibold self-start">Loading{dots}</h1>
          <div className={styles.frame}>
            {/* Progress bar animation */}
            <div
              className={styles.bar}
              style={{
                width: `${(progress / 100) * 330}px`, // Dynamic width based on progress
              }}
            ></div>
          </div>
          <div className={styles.textbox}>
            {/* Typing animation */}
            <p
              className={styles.text1}
              style={{
                animation: `typing ${loadTime / 1000}s steps(28, end)`,
              }}
            >
              Hey, hope it will start soon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

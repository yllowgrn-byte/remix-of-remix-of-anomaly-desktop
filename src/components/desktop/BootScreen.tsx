import { useState, useEffect } from "react";

interface BootScreenProps {
  onComplete: () => void;
}

const TOTAL_DURATION = 2600;

const BootScreen = ({ onComplete }: BootScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);
  const [titleRevealed, setTitleRevealed] = useState(0);
  const titleText = "AGENT  ANOMALY";

  useEffect(() => {
    // Reveal title characters one by one
    const charInterval = setInterval(() => {
      setTitleRevealed((prev) => {
        if (prev >= titleText.length) {
          clearInterval(charInterval);
          return titleText.length;
        }
        return prev + 1;
      });
    }, 60);

    // Progress bar with slight delay
    const barTimeout = setTimeout(() => {
      const barInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(barInterval);
            return 100;
          }
          return prev + 3;
        });
      }, 45);
      return () => clearInterval(barInterval);
    }, 400);

    setTimeout(() => setFading(true), TOTAL_DURATION - 350);
    setTimeout(onComplete, TOTAL_DURATION);

    return () => {
      clearInterval(charInterval);
      clearTimeout(barTimeout);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-secondary flex flex-col items-center justify-center transition-opacity duration-300 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-full max-w-xs px-6 font-mono space-y-4">
        {/* Title with character reveal */}
        <div className="text-center text-sm tracking-[0.25em] font-bold text-foreground select-none">
          {titleText.split("").map((char, i) => (
            <span
              key={i}
              className="inline-block transition-opacity duration-150"
              style={{ opacity: i < titleRevealed ? 1 : 0 }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>

        {/* Progress bar */}
        <div className="bevel-sunken h-4 bg-window-bg overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default BootScreen;

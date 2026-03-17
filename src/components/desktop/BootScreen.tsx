import { useState, useEffect } from "react";

interface BootScreenProps {
  onComplete: () => void;
}

const TOTAL_DURATION = 2600;

const BootScreen = ({ onComplete }: BootScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);
  const [titleRevealed, setTitleRevealed] = useState(0);
  const titleText = "AGENT  KERNEL";

  useEffect(() => {
    const charInterval = setInterval(() => {
      setTitleRevealed((prev) => {
        if (prev >= titleText.length) {
          clearInterval(charInterval);
          return titleText.length;
        }
        return prev + 1;
      });
    }, 60);

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
      className={`fixed inset-0 z-[9999] bg-desktop flex flex-col items-center justify-center transition-opacity duration-300 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="crt-overlay" />

      {/* Window frame */}
      <div className="bevel-raised bg-secondary w-full max-w-xs">
        {/* Title bar */}
        <div className="titlebar-gradient flex items-center justify-between px-2 py-0.5 select-none">
          <div className="flex items-center gap-1.5">
            <span className="text-xs">⚙️</span>
            <span className="text-xs font-bold text-window-titlebar-text tracking-wide">system.boot</span>
          </div>
          <div className="flex gap-0.5">
            <div className="bevel-raised bg-secondary w-4 h-3.5 flex items-center justify-center text-[8px] font-bold leading-none">_</div>
            <div className="bevel-raised bg-secondary w-4 h-3.5 flex items-center justify-center text-[8px] font-bold leading-none">□</div>
            <div className="bevel-raised bg-secondary w-4 h-3.5 flex items-center justify-center text-[8px] font-bold leading-none">×</div>
          </div>
        </div>

        {/* Content */}
        <div className="bevel-sunken bg-window-bg m-0.5 p-4 font-mono space-y-4">
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

        {/* Bottom status bar */}
        <div className="bg-secondary px-2 py-[2px] m-0.5 mt-0 flex items-center justify-between text-[8px] text-muted-foreground font-mono select-none">
          <span>initializing</span>
          <span>{Math.min(progress, 100)}%</span>
        </div>
      </div>
    </div>
  );
};

export default BootScreen;

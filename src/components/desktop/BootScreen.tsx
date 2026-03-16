import { useState, useEffect } from "react";

interface BootScreenProps {
  onComplete: () => void;
}

const TOTAL_DURATION = 2800;

const BootScreen = ({ onComplete }: BootScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const barInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(barInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    setTimeout(() => setFading(true), TOTAL_DURATION - 400);
    setTimeout(onComplete, TOTAL_DURATION);

    return () => clearInterval(barInterval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-secondary flex flex-col items-center justify-center transition-opacity duration-400 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-full max-w-sm px-6 font-mono space-y-5">
        {/* Title */}
        <div className="text-center space-y-1">
          <div className="text-foreground text-sm tracking-[0.3em] font-bold">
            A G E N T &nbsp; A N O M A L Y
          </div>
          <div className="text-[10px] text-muted-foreground tracking-wider">
            system loading
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="bevel-sunken h-5 bg-window-bg overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-[10px] text-muted-foreground text-right font-mono">
            {Math.min(progress, 100)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default BootScreen;

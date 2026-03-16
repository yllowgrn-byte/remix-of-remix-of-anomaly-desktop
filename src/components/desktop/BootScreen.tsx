import { useState, useEffect } from "react";

interface BootScreenProps {
  onComplete: () => void;
}

const bootLines = [
  { text: "BIOS v3.41 — anomaly systems inc.", delay: 0 },
  { text: "memory check ............ 2048MB OK", delay: 300 },
  { text: "loading kernel .......... anomaly_core.sys", delay: 600 },
  { text: "initializing sensors .... 6 modules found", delay: 900 },
  { text: "mounting archive ........ /dev/archive0", delay: 1150 },
  { text: "signal calibration ...... 78% baseline", delay: 1400 },
  { text: "network handshake ....... CONNECTED", delay: 1650 },
  { text: "threat assessment ........ ELEVATED", delay: 1900 },
  { text: "", delay: 2100 },
  { text: "all systems nominal. booting desktop...", delay: 2300 },
];

const TOTAL_DURATION = 3200;
const BAR_START = 200;
const BAR_END = 2800;

const BootScreen = ({ onComplete }: BootScreenProps) => {
  const [visibleLines, setVisibleLines] = useState(0);
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Reveal lines
    bootLines.forEach((line, i) => {
      setTimeout(() => setVisibleLines(i + 1), line.delay);
    });

    // Animate progress bar
    const barInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(barInterval);
          return 100;
        }
        return prev + 2;
      });
    }, (BAR_END - BAR_START) / 50);

    setTimeout(() => clearInterval(barInterval), BAR_END);

    // Start fade out
    setTimeout(() => setFading(true), TOTAL_DURATION - 400);

    // Complete
    setTimeout(onComplete, TOTAL_DURATION);

    return () => clearInterval(barInterval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-terminal-bg flex flex-col items-center justify-center transition-opacity duration-400 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-full max-w-lg px-6 font-mono">
        {/* Logo */}
        <div className="text-terminal-text text-center mb-6 text-sm tracking-[0.3em] font-bold opacity-80">
          A G E N T &nbsp; A N O M A L Y
        </div>

        {/* Boot log */}
        <div className="space-y-1 mb-6 min-h-[200px]">
          {bootLines.slice(0, visibleLines).map((line, i) => (
            <div
              key={i}
              className="text-[11px] leading-relaxed animate-fade-in"
              style={{ animationDuration: "0.15s" }}
            >
              {line.text === "" ? (
                <br />
              ) : line.text.includes("CONNECTED") || line.text.includes("OK") ? (
                <span>
                  <span className="text-muted-foreground">{line.text.split("...")[0]}...</span>
                  <span className="text-terminal-text font-bold">{line.text.split("... ")[1]}</span>
                </span>
              ) : line.text.includes("ELEVATED") ? (
                <span>
                  <span className="text-muted-foreground">{line.text.split("...")[0]}...</span>
                  <span className="text-amber-status font-bold">{line.text.split("... ")[1]}</span>
                </span>
              ) : line.text.includes("booting") ? (
                <span className="text-terminal-text font-bold">{line.text}</span>
              ) : line.text.includes("BIOS") ? (
                <span className="text-accent">{line.text}</span>
              ) : (
                <span className="text-muted-foreground">{line.text}</span>
              )}
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="bevel-sunken h-4 bg-terminal-bg overflow-hidden">
            <div
              className="h-full bg-terminal-text transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>loading system</span>
            <span>{Math.min(progress, 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BootScreen;

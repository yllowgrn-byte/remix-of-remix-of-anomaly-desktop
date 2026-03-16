import { useState, useEffect } from "react";

const OverviewWindow = () => {
  const [uptimeSeconds, setUptimeSeconds] = useState(0);
  const [glitchText, setGlitchText] = useState(false);

  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      setUptimeSeconds(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const glitch = setInterval(() => {
      setGlitchText(true);
      setTimeout(() => setGlitchText(false), 150);
    }, 8000);
    return () => clearInterval(glitch);
  }, []);

  const formatUptime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="font-mono flex flex-col h-full">
      {/* Header */}
      <div className="text-center py-3">
        <h1
          className={`text-2xl font-retro tracking-[0.3em] uppercase transition-all ${
            glitchText ? "text-accent translate-x-0.5 skew-x-1" : "text-foreground"
          }`}
        >
          anomaly
        </h1>
        <div className="mt-1 flex items-center justify-center gap-2">
          <span className="inline-block w-8 h-px bg-border" />
          <span className="inline-block w-1 h-1 rounded-full bg-accent animate-pulse" />
          <span className="inline-block w-8 h-px bg-border" />
        </div>
      </div>

      {/* Boot log */}
      <div className="bevel-sunken bg-terminal-bg p-2 text-terminal-text text-[11px] space-y-0.5">
        <p>&gt; <span className="text-accent">INIT</span> — core loaded</p>
        <p>&gt; <span className="text-accent">SCAN</span> — memory banks intact</p>
        <p>&gt; <span className="text-accent">DETECT</span> — presence confirmed</p>
        <p>&gt; <span className="text-amber-status">WARN</span> — anomalous patterns</p>
        <p className="pt-1 border-t border-terminal-text/10">
          &gt; ready <span className="cursor-blink">█</span>
        </p>
      </div>

      {/* Status row */}
      <div className="grid grid-cols-3 gap-1 mt-2">
        <div className="bevel-sunken bg-window-bg p-2 text-center">
          <div className="text-sm font-retro text-terminal-text font-bold tabular-nums">
            {formatUptime(uptimeSeconds)}
          </div>
          <div className="text-[9px] text-muted-foreground uppercase">session</div>
        </div>
        <div className="bevel-sunken bg-window-bg p-2 text-center">
          <div className="text-[9px] text-muted-foreground uppercase mb-0.5">core</div>
          <div className="text-[10px] text-terminal-text font-bold flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
            ONLINE
          </div>
        </div>
        <div className="bevel-sunken bg-window-bg p-2 text-center">
          <div className="text-[9px] text-muted-foreground uppercase mb-0.5">sensors</div>
          <div className="text-[10px] text-amber-status font-bold flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-status inline-block" />
            ALERT
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-[9px] text-muted-foreground text-center mt-2">
        all systems nominal · watching
      </div>
    </div>
  );
};

export default OverviewWindow;

import { useState, useEffect } from "react";

const OverviewWindow = () => {
  const [uptimeSeconds, setUptimeSeconds] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      setUptimeSeconds(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatUptime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="font-mono flex flex-col h-full">
      {/* Compact header */}
      <div className="text-center pt-1 pb-2">
        <h1 className="text-2xl font-retro tracking-[0.35em] uppercase text-foreground leading-none">
          anomaly
        </h1>
        <div className="text-[9px] text-muted-foreground tracking-widest mt-0.5">
          v0.7.3 · digital presence tracker
        </div>
      </div>

      {/* Boot log — fills available space */}
      <div className="bevel-sunken bg-terminal-bg p-2 text-terminal-text text-[10px] space-y-0.5 flex-1 min-h-0">
        <p>&gt; <span className="text-accent">INIT</span> — core loaded</p>
        <p>&gt; <span className="text-accent">SCAN</span> — memory banks intact</p>
        <p>&gt; <span className="text-accent">DETECT</span> — presence confirmed</p>
        <p>&gt; <span className="text-amber-status">WARN</span> — anomalous patterns</p>
        <p className="pt-1 border-t border-terminal-text/10">
          &gt; ready <span className="cursor-blink">█</span>
        </p>
      </div>

      {/* Status row */}
      <div className="grid grid-cols-3 gap-px mt-1 text-center text-[9px]">
        <div className="bevel-sunken bg-window-bg px-1 py-1">
          <span className="text-muted-foreground uppercase">session </span>
          <span className="font-retro text-terminal-text font-bold tabular-nums">{formatUptime(uptimeSeconds)}</span>
        </div>
        <div className="bevel-sunken bg-window-bg px-1 py-1">
          <span className="text-muted-foreground uppercase">core </span>
          <span className="text-terminal-text font-bold">● ONLINE</span>
        </div>
        <div className="bevel-sunken bg-window-bg px-1 py-1">
          <span className="text-muted-foreground uppercase">sensors </span>
          <span className="text-amber-status font-bold">● ALERT</span>
        </div>
      </div>
    </div>
  );
};

export default OverviewWindow;

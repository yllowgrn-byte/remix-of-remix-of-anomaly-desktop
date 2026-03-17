import { useState, useEffect } from "react";

const OverviewWindow = () => {
  const [uptimeSeconds, setUptimeSeconds] = useState(0);
  const [signalBars, setSignalBars] = useState([4, 7, 3, 8, 5, 6, 2, 9, 4, 7, 6, 3, 8, 5, 7, 4]);

  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      setUptimeSeconds(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSignalBars(prev => prev.map(() => Math.floor(Math.random() * 10) + 1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="font-mono flex flex-col h-full gap-1">
      {/* Header */}
      <div className="text-center py-1">
        <h1 className="text-2xl font-retro tracking-[0.35em] uppercase text-foreground leading-none">
          anomaly
        </h1>
        <div className="text-[9px] text-muted-foreground tracking-widest mt-0.5">
          v0.7.3 · digital presence tracker
        </div>
      </div>

      {/* Boot log */}
      <div className="bevel-sunken bg-terminal-bg p-2 text-terminal-text text-[10px] space-y-0.5">
        <p>&gt; <span className="text-accent">INIT</span> — core loaded</p>
        <p>&gt; <span className="text-accent">SCAN</span> — memory banks intact</p>
        <p>&gt; <span className="text-accent">DETECT</span> — presence confirmed</p>
        <p>&gt; <span className="text-amber-status">WARN</span> — kernel anomalies</p>
        <p className="pt-1 border-t border-terminal-text/10">
          &gt; ready <span className="cursor-blink">█</span>
        </p>
      </div>

      {/* Signal visualizer — fills remaining space */}
      <div className="bevel-sunken bg-terminal-bg p-2 flex-1 min-h-[60px] flex flex-col">
        <div className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">◈ signal monitor</div>
        <div className="flex-1 flex items-end gap-[3px]" style={{ minHeight: 40 }}>
          {signalBars.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col justify-end h-full">
              <div
                className="transition-all duration-700 ease-in-out"
                style={{
                  height: `${v * 10}%`,
                  background: v > 7
                    ? "hsl(var(--status-amber))"
                    : v > 4
                    ? "hsl(var(--accent))"
                    : "hsl(var(--terminal-text))",
                  opacity: 0.8,
                }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[8px] text-terminal-text/40 mt-1">
          <span>18.9Hz</span>
          <span>42.0Hz</span>
          <span>77.7Hz</span>
          <span>120Hz</span>
        </div>
      </div>

      {/* Live ticker */}
      <div className="bevel-sunken bg-terminal-bg px-2 py-1 text-[9px] text-terminal-text overflow-hidden">
        <div className="flex gap-4 animate-pulse">
          <span>▸ 3 signals active</span>
          <span className="text-amber-status">▸ sector 7-G flagged</span>
          <span>▸ signal: 18.9Hz subsonic</span>
        </div>
      </div>

      {/* Status row */}
      <div className="grid grid-cols-3 gap-px text-center text-[9px]">
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

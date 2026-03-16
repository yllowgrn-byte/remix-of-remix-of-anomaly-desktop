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
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center py-4">
        <h1 className={`text-3xl font-retro tracking-[0.3em] uppercase transition-all ${glitchText ? "text-accent translate-x-0.5" : ""}`}>
          anomaly
        </h1>
        <div className="mt-2 flex items-center justify-center gap-2">
          <span className="inline-block w-8 h-px bg-border" />
          <p className="text-[10px] text-muted-foreground tracking-widest uppercase">digital presence tracker</p>
          <span className="inline-block w-8 h-px bg-border" />
        </div>
      </div>

      {/* Boot log */}
      <div className="bevel-sunken bg-terminal-bg p-3 font-mono">
        <div className="text-terminal-text text-xs space-y-1">
          <p className="text-muted-foreground text-[10px]">// boot sequence v0.0.7</p>
          <p>&gt; <span className="text-accent">INIT</span> — core loaded</p>
          <p>&gt; <span className="text-accent">SCAN</span> — memory banks... intact</p>
          <p>&gt; <span className="text-accent">DETECT</span> — presence confirmed</p>
          <p>&gt; <span className="text-amber-status">WARN</span> — anomalous patterns detected</p>
          <p>&gt; <span className="text-accent">STATUS</span> — monitoring active</p>
          <p className="mt-2 pt-2 border-t border-terminal-text/10">
            &gt; ready <span className="cursor-blink">█</span>
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bevel-sunken bg-window-bg p-2 text-center">
          <div className="text-sm font-retro text-terminal-text font-bold tabular-nums">{formatUptime(uptimeSeconds)}</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">session</div>
          <div className="text-[9px] text-accent mt-0.5">● live</div>
        </div>
        <div className="bevel-sunken bg-window-bg p-2 text-center">
          <div className="text-lg font-retro text-amber-status">47</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">signals</div>
          <div className="text-[9px] text-muted-foreground mt-0.5">intercepted</div>
        </div>
        <div className="bevel-sunken bg-window-bg p-2 text-center">
          <div className="text-lg font-retro text-destructive">3</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">breaches</div>
          <div className="text-[9px] text-muted-foreground mt-0.5">contained</div>
        </div>
      </div>

      {/* Activity bar */}
      <div className="bevel-sunken bg-window-bg p-2">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Signal Strength</span>
          <span className="text-[10px] text-terminal-text font-bold">78%</span>
        </div>
        <div className="h-2 bg-terminal-bg bevel-sunken">
          <div className="h-full bg-accent transition-all" style={{ width: "78%" }} />
        </div>
      </div>

      <div className="text-[10px] text-muted-foreground text-center border-t border-border/30 pt-2">
        monitoring since epoch · all systems nominal · signal stable
      </div>
    </div>
  );
};

export default OverviewWindow;

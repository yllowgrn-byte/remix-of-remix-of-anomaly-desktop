import { useState, useEffect } from "react";

const OverviewWindow = () => {
  const [uptimeSeconds, setUptimeSeconds] = useState(0);
  const [glitchText, setGlitchText] = useState(false);
  const [signalPulse, setSignalPulse] = useState(0);

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

  useEffect(() => {
    const pulse = setInterval(() => {
      setSignalPulse((p) => p + 1);
    }, 3000);
    return () => clearInterval(pulse);
  }, []);

  const formatUptime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const signalStrength = 72 + Math.sin(signalPulse * 0.7) * 14;
  const threatLevel = signalStrength > 80 ? "HIGH" : signalStrength > 60 ? "ELEVATED" : "LOW";
  const threatColor = signalStrength > 80 ? "text-destructive" : signalStrength > 60 ? "text-amber-status" : "text-terminal-text";

  return (
    <div className="space-y-4 font-mono">
      {/* Hero header */}
      <div className="text-center py-6 relative">
        <div className="text-[10px] text-muted-foreground tracking-[0.5em] uppercase mb-2">
          // digital presence tracker
        </div>
        <h1
          className={`text-4xl font-retro tracking-[0.4em] uppercase transition-all ${
            glitchText ? "text-accent translate-x-0.5 skew-x-1" : "text-foreground"
          }`}
        >
          anomaly
        </h1>
        <div className="mt-3 flex items-center justify-center gap-3">
          <span className="inline-block w-12 h-px bg-border" />
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="inline-block w-12 h-px bg-border" />
        </div>
        <p className="text-[10px] text-muted-foreground mt-2">
          v0.7.3 · monitoring since epoch
        </p>
      </div>

      {/* Boot sequence */}
      <div className="bevel-sunken bg-terminal-bg p-3">
        <div className="text-terminal-text text-xs space-y-0.5">
          <p className="text-muted-foreground text-[10px] mb-1">// boot sequence v0.0.7</p>
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

      {/* Live metrics grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="bevel-sunken bg-window-bg p-3 text-center">
          <div className="text-lg font-retro text-terminal-text font-bold tabular-nums leading-tight">
            {formatUptime(uptimeSeconds)}
          </div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">session</div>
          <div className="text-[9px] text-accent mt-0.5 flex items-center justify-center gap-1">
            <span className="inline-block w-1 h-1 rounded-full bg-accent animate-pulse" />
            live
          </div>
        </div>
        <div className="bevel-sunken bg-window-bg p-3 text-center">
          <div className="text-lg font-retro text-amber-status font-bold leading-tight">47</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">signals</div>
          <div className="text-[9px] text-muted-foreground mt-0.5">intercepted</div>
        </div>
        <div className="bevel-sunken bg-window-bg p-3 text-center">
          <div className="text-lg font-retro text-destructive font-bold leading-tight">3</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">breaches</div>
          <div className="text-[9px] text-muted-foreground mt-0.5">contained</div>
        </div>
        <div className="bevel-sunken bg-window-bg p-3 text-center">
          <div className={`text-lg font-retro font-bold leading-tight ${threatColor}`}>
            {threatLevel}
          </div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">threat</div>
          <div className="text-[9px] text-muted-foreground mt-0.5">assessment</div>
        </div>
      </div>

      {/* Signal strength bar */}
      <div className="bevel-sunken bg-window-bg p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Signal Strength</span>
          <span className="text-[10px] text-terminal-text font-bold tabular-nums">
            {signalStrength.toFixed(1)}%
          </span>
        </div>
        <div className="h-2 bg-terminal-bg bevel-sunken rounded-sm overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-700"
            style={{ width: `${signalStrength}%` }}
          />
        </div>
      </div>

      {/* Quick status row */}
      <div className="bevel-sunken bg-window-bg p-3">
        <div className="grid grid-cols-3 gap-3 text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="text-terminal-text">●</span>
            <span className="text-muted-foreground">Core</span>
            <span className="text-terminal-text font-bold ml-auto">ONLINE</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-terminal-text">●</span>
            <span className="text-muted-foreground">Network</span>
            <span className="text-terminal-text font-bold ml-auto">LINKED</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-amber-status">▲</span>
            <span className="text-muted-foreground">Sensors</span>
            <span className="text-amber-status font-bold ml-auto">ALERT</span>
          </div>
        </div>
      </div>

      <div className="text-[10px] text-muted-foreground text-center border-t border-border/30 pt-2">
        all systems nominal · signal stable · watching
      </div>
    </div>
  );
};

export default OverviewWindow;

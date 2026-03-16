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
    <div className="font-mono flex flex-col h-full justify-between">
      {/* Header */}
      <div className="text-center py-2">
        <div className="text-[10px] text-muted-foreground tracking-[0.5em] uppercase mb-1">
          ◄ system active ►
        </div>
        <h1 className="text-3xl font-retro tracking-[0.4em] uppercase text-foreground leading-none">
          anomaly
        </h1>
        <div className="text-[10px] text-muted-foreground tracking-[0.2em] mt-1">
          v0.7.3 · digital presence tracker
        </div>
      </div>

      {/* Boot log */}
      <div className="bevel-sunken bg-terminal-bg p-2 text-terminal-text text-[10px] space-y-0.5">
        <p>&gt; <span className="text-accent">INIT</span> — core loaded</p>
        <p>&gt; <span className="text-accent">SCAN</span> — memory banks intact</p>
        <p>&gt; <span className="text-accent">DETECT</span> — presence confirmed</p>
        <p>&gt; <span className="text-amber-status">WARN</span> — anomalous patterns</p>
        <p className="pt-1 border-t border-terminal-text/10">
          &gt; ready <span className="cursor-blink">█</span>
        </p>
      </div>

      {/* Status row */}
      <div className="grid grid-cols-3 gap-1 mt-1">
        <div className="bevel-sunken bg-window-bg p-1.5 text-center">
          <div className="text-[9px] text-muted-foreground uppercase">session</div>
          <div className="text-xs font-retro text-terminal-text font-bold tabular-nums">
            {formatUptime(uptimeSeconds)}
          </div>
        </div>
        <div className="bevel-sunken bg-window-bg p-1.5 text-center">
          <div className="text-[9px] text-muted-foreground uppercase">core</div>
          <div className="text-[10px] text-terminal-text font-bold flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
            ONLINE
          </div>
        </div>
        <div className="bevel-sunken bg-window-bg p-1.5 text-center">
          <div className="text-[9px] text-muted-foreground uppercase">sensors</div>
          <div className="text-[10px] text-amber-status font-bold flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-status inline-block" />
            ALERT
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewWindow;

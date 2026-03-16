const OverviewWindow = () => {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="text-center py-6">
        <h1 className="text-4xl font-retro tracking-[0.3em] uppercase">anomaly</h1>
        <div className="mt-2 flex items-center justify-center gap-2">
          <span className="inline-block w-8 h-px bg-border" />
          <p className="text-xs text-muted-foreground tracking-widest uppercase">digital presence tracker</p>
          <span className="inline-block w-8 h-px bg-border" />
        </div>
      </div>

      {/* Boot log */}
      <div className="bevel-sunken bg-terminal-bg p-4 font-mono">
        <div className="text-terminal-text text-xs space-y-1.5">
          <p className="text-muted-foreground text-[10px]">// boot sequence v0.0.7</p>
          <p>&gt; <span className="text-accent">INIT</span> — core loaded</p>
          <p>&gt; <span className="text-accent">SCAN</span> — memory banks... weird</p>
          <p>&gt; <span className="text-accent">DETECT</span> — presence confirmed</p>
          <p>&gt; <span className="text-amber-status">WARN</span> — nothing has been fixed</p>
          <p>&gt; <span className="text-accent">STATUS</span> — operational (debatable)</p>
          <p className="mt-3 pt-2 border-t border-border/20">
            &gt; ready <span className="cursor-blink">█</span>
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "uptime", value: "∞", sub: "way too long" },
          { label: "entries", value: "??", sub: "and counting" },
          { label: "anomalies", value: "1", sub: "that we know of" },
        ].map((stat) => (
          <div key={stat.label} className="bevel-sunken bg-window-bg p-2 text-center">
            <div className="text-lg font-retro text-accent">{stat.value}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</div>
            <div className="text-[9px] text-muted-foreground mt-0.5">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="text-[10px] text-muted-foreground text-center border-t border-border/30 pt-3">
        this thing has been online way too long · nobody asked for this · here we are
      </div>
    </div>
  );
};

export default OverviewWindow;

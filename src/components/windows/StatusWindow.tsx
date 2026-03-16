import { useState, useEffect } from "react";

const StatusWindow = () => {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 2000);
    return () => clearInterval(t);
  }, []);

  // Simulated fluctuating values
  const cpuLoad = 12 + Math.sin(tick * 0.3) * 8;
  const memUsage = 42 + Math.cos(tick * 0.2) * 5;
  const signalStrength = 78 + Math.sin(tick * 0.5) * 12;
  const temp = 37 + Math.sin(tick * 0.4) * 3;

  const statusItems = [
    { label: "Core", value: "ONLINE", color: "text-terminal-text", icon: "●" },
    { label: "Network", value: "CONNECTED", color: "text-terminal-text", icon: "●" },
    { label: "Sensors", value: "ACTIVE", color: "text-terminal-text", icon: "●" },
    { label: "Containment", value: "HOLDING", color: "text-amber-status", icon: "▲" },
    { label: "Archive", value: "SYNCED", color: "text-accent", icon: "◈" },
    { label: "Threat Level", value: "ELEVATED", color: "text-amber-status", icon: "⚠" },
  ];

  const renderBar = (value: number, max: number, color: string) => {
    const pct = Math.min(100, (value / max) * 100);
    return (
      <div className="h-1.5 bg-terminal-bg bevel-sunken flex-1">
        <div className={`h-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    );
  };

  return (
    <div className="space-y-3 font-mono text-xs">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] text-accent uppercase tracking-wider font-bold">System Diagnostics</span>
        <span className="flex-1" />
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-terminal-text animate-pulse" />
        <span className="text-[10px] text-muted-foreground">LIVE</span>
      </div>

      {/* Status list */}
      <div className="space-y-1.5">
        {statusItems.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className={`${item.color} text-[10px]`}>{item.icon}</span>
            <span className="text-muted-foreground w-20 shrink-0">{item.label}</span>
            <span className="text-border flex-1 text-[10px] leading-none overflow-hidden whitespace-nowrap">·····················</span>
            <span className={`${item.color} font-bold text-[10px]`}>{item.value}</span>
          </div>
        ))}
      </div>

      {/* Performance meters */}
      <div className="border-t border-border/30 pt-2 space-y-2">
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mb-1">Performance</div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground w-16 shrink-0 text-[10px]">CPU</span>
          {renderBar(cpuLoad, 100, "bg-terminal-text")}
          <span className="text-[10px] text-terminal-text w-10 text-right">{cpuLoad.toFixed(1)}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground w-16 shrink-0 text-[10px]">Memory</span>
          {renderBar(memUsage, 100, "bg-accent")}
          <span className="text-[10px] text-accent w-10 text-right">{memUsage.toFixed(1)}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground w-16 shrink-0 text-[10px]">Signal</span>
          {renderBar(signalStrength, 100, signalStrength > 70 ? "bg-terminal-text" : "bg-amber-status")}
          <span className="text-[10px] text-terminal-text w-10 text-right">{signalStrength.toFixed(0)}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground w-16 shrink-0 text-[10px]">Temp</span>
          {renderBar(temp, 80, temp > 40 ? "bg-amber-status" : "bg-accent")}
          <span className="text-[10px] text-accent w-10 text-right">{temp.toFixed(1)}°C</span>
        </div>
      </div>

      <div className="border-t border-border/30 pt-2 text-[10px] text-muted-foreground space-y-0.5">
        <p>last refresh: just now · auto-updating</p>
        <p>next scheduled maintenance: indefinitely postponed</p>
      </div>
    </div>
  );
};

export default StatusWindow;

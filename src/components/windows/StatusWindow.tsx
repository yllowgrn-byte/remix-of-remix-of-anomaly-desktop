import { useState, useEffect } from "react";

const StatusWindow = () => {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 2000);
    return () => clearInterval(t);
  }, []);

  const cpuLoad = 12 + Math.sin(tick * 0.3) * 8;
  const memUsage = 42 + Math.cos(tick * 0.2) * 5;
  const signalStrength = 78 + Math.sin(tick * 0.5) * 12;
  const temp = 37 + Math.sin(tick * 0.4) * 3;
  const diskUsage = 64 + Math.sin(tick * 0.15) * 3;
  const netLatency = 14 + Math.cos(tick * 0.6) * 8;

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
    <div className="font-mono text-xs flex flex-col h-full gap-2">
      <div className="flex items-center gap-2">
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
        {[
          { label: "CPU", value: cpuLoad, max: 100, color: "bg-terminal-text", textColor: "text-terminal-text", unit: "%" },
          { label: "Memory", value: memUsage, max: 100, color: "bg-accent", textColor: "text-accent", unit: "%" },
          { label: "Signal", value: signalStrength, max: 100, color: signalStrength > 70 ? "bg-terminal-text" : "bg-amber-status", textColor: "text-terminal-text", unit: "%" },
          { label: "Temp", value: temp, max: 80, color: temp > 40 ? "bg-amber-status" : "bg-accent", textColor: "text-accent", unit: "°C" },
          { label: "Disk", value: diskUsage, max: 100, color: "bg-accent", textColor: "text-accent", unit: "%" },
          { label: "Latency", value: netLatency, max: 100, color: netLatency > 18 ? "bg-amber-status" : "bg-terminal-text", textColor: "text-terminal-text", unit: "ms" },
        ].map((m) => (
          <div key={m.label} className="flex items-center gap-2">
            <span className="text-muted-foreground w-16 shrink-0 text-[10px]">{m.label}</span>
            {renderBar(m.value, m.max, m.color)}
            <span className={`text-[10px] ${m.textColor} w-12 text-right`}>{m.value.toFixed(m.unit === "%" ? 1 : m.unit === "ms" ? 0 : 1)}{m.unit}</span>
          </div>
        ))}
      </div>

      {/* Process list */}
      <div className="border-t border-border/30 pt-2 space-y-1">
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mb-1">Active Processes</div>
        {[
          { pid: "001", name: "anomaly_core.exe", cpu: "3.2%" },
          { pid: "014", name: "signal_watch.sys", cpu: "1.8%" },
          { pid: "027", name: "mem_defrag.bin", cpu: "0.4%" },
          { pid: "033", name: "sector_scan.dll", cpu: "2.1%" },
          { pid: "041", name: "archive_sync.io", cpu: "0.9%" },
        ].map((p) => (
          <div key={p.pid} className="flex items-center gap-2 text-[10px]">
            <span className="text-muted-foreground w-8">{p.pid}</span>
            <span className="text-terminal-text flex-1 truncate">{p.name}</span>
            <span className="text-muted-foreground">{p.cpu}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-border/30 pt-2 text-[10px] text-muted-foreground space-y-0.5 mt-auto">
        <p>last refresh: just now · auto-updating</p>
        
        <p>build: 0.7.3-unstable · pid: {Math.floor(Math.random() * 9000) + 1000}</p>
      </div>
    </div>
  );
};

export default StatusWindow;

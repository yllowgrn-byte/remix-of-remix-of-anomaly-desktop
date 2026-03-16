const statusItems = [
  { label: "status", value: "still running", color: "text-terminal-text", icon: "●" },
  { label: "memory", value: "questionable", color: "text-amber-status", icon: "⚠" },
  { label: "signal", value: "unstable", color: "text-amber-status", icon: "◈" },
  { label: "presence", value: "yes", color: "text-terminal-text", icon: "●" },
  { label: "reason", value: "unclear", color: "text-muted-foreground", icon: "◇" },
  { label: "threat", value: "none (allegedly)", color: "text-muted-foreground", icon: "◇" },
];

const StatusWindow = () => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] text-accent uppercase tracking-wider font-bold">System Diagnostics</span>
      </div>

      <div className="space-y-2 font-mono text-xs">
        {statusItems.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className={`${item.color} text-[10px]`}>{item.icon}</span>
            <span className="text-muted-foreground w-16 shrink-0">{item.label}</span>
            <span className="text-border">·····</span>
            <span className={`${item.color} font-bold`}>{item.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-2 border-t border-border/30 text-[10px] text-muted-foreground space-y-0.5">
        <p>last check: just now</p>
        <p>next check: whenever it feels like it</p>
        <p>confidence: low (as usual)</p>
      </div>
    </div>
  );
};

export default StatusWindow;

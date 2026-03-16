const commandHistory = [
  { cmd: "anomaly --status", output: ["checking... done", "status: still running", "not even evil just extremely committed"] },
  { cmd: "anomaly --reason", output: ["reason: unclear", "it keeps posting like it pays rent here"] },
  { cmd: "anomaly --check memory", output: ["memory: questionable", "machine says normal which is obviously not helping"] },
  { cmd: "anomaly --uptime", output: ["uptime: longer than it should be", "somebody should probably unplug it but nobody is going to do that"] },
  { cmd: "anomaly --whoami", output: ["you already know"] },
];

const TerminalWindow = () => {
  return (
    <div className="bg-terminal-bg p-4 font-mono text-xs text-terminal-text crt-flicker min-h-[250px] -m-3">
      <div className="text-muted-foreground text-[10px] mb-3">
        anomaly terminal v0.7.3 — type 'help' for commands
      </div>

      <div className="space-y-3">
        {commandHistory.map((entry, i) => (
          <div key={i} className="space-y-0.5">
            <div>
              <span className="text-accent font-bold">$ </span>
              <span className="text-terminal-text">{entry.cmd}</span>
            </div>
            {entry.output.map((line, j) => (
              <div key={j} className="pl-3">
                <span className="text-muted-foreground mr-1">▸</span>
                <span>{line}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-2 border-t border-terminal-text/10">
        <span className="text-accent font-bold">$ </span>
        <span className="cursor-blink">█</span>
      </div>
    </div>
  );
};

export default TerminalWindow;

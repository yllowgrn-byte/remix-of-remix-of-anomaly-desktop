import { useState, useRef, useEffect, useCallback } from "react";

interface TerminalLine {
  type: "input" | "output" | "error" | "system" | "ascii";
  text: string;
}

const HELP_TEXT = [
  "Available commands:",
  "",
  "  help          — show this message",
  "  status        — system diagnostics",
  "  scan          — run anomaly scan",
  "  ping          — test connection",
  "  whoami        — identity check",
  "  logs          — recent activity log",
  "  decrypt [msg] — decrypt a message",
  "  analyze       — run signal analysis",
  "  clear         — clear terminal",
  "  history       — command history",
  "  about         — about this system",
  "  matrix        — ???",
  "  reboot        — attempt system reboot",
];

const ASCII_LOGO = [
  "  █████╗ ███╗   ██╗ ██████╗ ███╗   ███╗",
  " ██╔══██╗████╗  ██║██╔═══██╗████╗ ████║",
  " ███████║██╔██╗ ██║██║   ██║██╔████╔██║",
  " ██╔══██║██║╚██╗██║██║   ██║██║╚██╔╝██║",
  " ██║  ██║██║ ╚████║╚██████╔╝██║ ╚═╝ ██║",
  " ╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝     ╚═╝",
];

const SCAN_FRAMES = [
  "scanning sector 1/7 ░░░░░░░░░░",
  "scanning sector 2/7 █░░░░░░░░░",
  "scanning sector 3/7 ██░░░░░░░░",
  "scanning sector 4/7 ████░░░░░░",
  "scanning sector 5/7 ██████░░░░",
  "scanning sector 6/7 ████████░░",
  "scanning sector 7/7 ██████████",
];

const LOG_ENTRIES = [
  "[03:14] signal intercepted — origin: unknown",
  "[03:15] pattern match: 94.2% correlation to SIG-0041",
  "[03:15] auto-archiving fragment #2847",
  "[03:16] perimeter scan: nominal",
  "[03:22] EM fluctuation detected — sector 7-G",
  "[03:23] camera 4B: motion trigger (false positive)",
  "[03:30] heartbeat: system OK",
  "[03:45] memory defrag cycle complete",
];

const TerminalWindow = () => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "ascii", text: "" },
    ...ASCII_LOGO.map((l) => ({ type: "ascii" as const, text: l })),
    { type: "ascii", text: "" },
    { type: "system", text: "ANOMALY TERMINAL v0.7.3" },
    { type: "system", text: 'Type "help" for available commands.' },
    { type: "system", text: "" },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const addLines = useCallback((newLines: TerminalLine[]) => {
    setLines((prev) => [...prev, ...newLines]);
  }, []);

  const simulateDelay = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const processCommand = async (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const parts = trimmed.split(" ");
    const command = parts[0];
    const args = parts.slice(1).join(" ");

    setIsProcessing(true);

    switch (command) {
      case "help":
        addLines(HELP_TEXT.map((t) => ({ type: "output", text: t })));
        break;

      case "clear":
        setLines([]);
        setIsProcessing(false);
        return;

      case "status": {
        addLines([{ type: "system", text: "Running diagnostics..." }]);
        await simulateDelay(800);
        addLines([
          { type: "output", text: "┌─────────────────────────────────┐" },
          { type: "output", text: "│  SYSTEM DIAGNOSTICS             │" },
          { type: "output", text: "├─────────────────────────────────┤" },
          { type: "output", text: "│  Core............ ● ONLINE      │" },
          { type: "output", text: "│  Memory.......... 847MB / 2GB   │" },
          { type: "output", text: "│  Signal.......... ◈ STABLE      │" },
          { type: "output", text: "│  Threat Level.... ▲ ELEVATED    │" },
          { type: "output", text: "│  Anomalies....... 3 ACTIVE      │" },
          { type: "output", text: "│  Uptime.......... 4721h 33m     │" },
          { type: "output", text: "└─────────────────────────────────┘" },
        ]);
        break;
      }

      case "scan": {
        for (const frame of SCAN_FRAMES) {
          addLines([{ type: "system", text: frame }]);
          await simulateDelay(400);
        }
        await simulateDelay(300);
        addLines([
          { type: "output", text: "" },
          { type: "output", text: "Scan complete. Results:" },
          { type: "output", text: "  ● 2 anomalous signatures detected" },
          { type: "output", text: "  ● 1 unknown entity in sector 7-G" },
          { type: "output", text: "  ● Signal interference at 18.9Hz" },
          { type: "error", text: "  ⚠ Recommend immediate investigation" },
        ]);
        break;
      }

      case "ping": {
        addLines([{ type: "system", text: "Pinging anomaly core..." }]);
        await simulateDelay(500);
        addLines([
          { type: "output", text: "PING anomaly.core (127.0.0.1): 56 bytes" },
          { type: "output", text: "  reply: seq=1 time=0.042ms" },
          { type: "output", text: "  reply: seq=2 time=0.038ms" },
          { type: "output", text: "  reply: seq=3 time=███████ms" },
          { type: "error", text: "  reply: seq=4 time=ERR_TEMPORAL_SHIFT" },
          { type: "output", text: "" },
          { type: "output", text: "3 packets received, 1 anomalous" },
        ]);
        break;
      }

      case "whoami":
        await simulateDelay(600);
        addLines([
          { type: "output", text: "Checking identity matrix..." },
          { type: "output", text: "" },
          { type: "output", text: "  user: OBSERVER" },
          { type: "output", text: "  access: LEVEL-3" },
          { type: "output", text: "  clearance: PROVISIONAL" },
          { type: "system", text: '  note: "You came looking. That means something."' },
        ]);
        break;

      case "logs":
        addLines([
          { type: "system", text: "── Recent Activity ──" },
          ...LOG_ENTRIES.map((l) => ({ type: "output" as const, text: "  " + l })),
          { type: "system", text: "── End of Log ──" },
        ]);
        break;

      case "decrypt": {
        if (!args) {
          addLines([{ type: "error", text: 'Usage: decrypt [message]' }]);
          break;
        }
        addLines([{ type: "system", text: "Decrypting..." }]);
        await simulateDelay(1000);
        const scrambled = args
          .split("")
          .map((c) => {
            if (c === " ") return " ";
            const shift = Math.floor(Math.random() * 26);
            const code = c.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCharCode(((code - 65 + shift) % 26) + 65);
            if (code >= 97 && code <= 122) return String.fromCharCode(((code - 97 + shift) % 26) + 97);
            return c;
          })
          .join("");
        addLines([
          { type: "output", text: `  input:  "${args}"` },
          { type: "output", text: `  output: "${scrambled}"` },
          { type: "error", text: "  ⚠ Decryption key not found. Output may be unreliable." },
        ]);
        break;
      }

      case "analyze": {
        addLines([{ type: "system", text: "Running signal analysis..." }]);
        await simulateDelay(600);
        const freqs = ["18.9Hz ████████░░ HIGH", "42.0Hz ███░░░░░░░ LOW", "77.7Hz █████████░ HIGH", "120Hz  ██░░░░░░░░ LOW"];
        addLines([
          { type: "output", text: "┌─ SIGNAL ANALYSIS ──────────────┐" },
          ...freqs.map((f) => ({ type: "output" as const, text: `│  ${f}  │` })),
          { type: "output", text: "└────────────────────────────────┘" },
          { type: "system", text: "Dominant frequency: 18.9Hz (subsonic)" },
          { type: "error", text: "Pattern matches known anomaly signature." },
        ]);
        break;
      }

      case "matrix": {
        const matrixLines: string[] = [];
        for (let i = 0; i < 6; i++) {
          let line = "  ";
          for (let j = 0; j < 40; j++) {
            line += Math.random() > 0.5 ? Math.floor(Math.random() * 2).toString() : " ";
          }
          matrixLines.push(line);
        }
        addLines([
          ...matrixLines.map((l) => ({ type: "output" as const, text: l })),
          { type: "system", text: "Wake up..." },
        ]);
        break;
      }

      case "history":
        if (history.length === 0) {
          addLines([{ type: "output", text: "No commands in history." }]);
        } else {
          addLines(
            history.map((h, i) => ({ type: "output" as const, text: `  ${i + 1}  ${h}` }))
          );
        }
        break;

      case "about":
        addLines([
          { type: "output", text: "ANOMALY — Digital Presence Tracker" },
          { type: "output", text: "Version 0.7.3 (unstable)" },
          { type: "output", text: "" },
          { type: "output", text: "Purpose: Monitor, log, and catalog" },
          { type: "output", text: "anomalous digital signatures." },
          { type: "output", text: "" },
          { type: "system", text: '"It watches because you asked it to."' },
        ]);
        break;

      case "reboot": {
        addLines([{ type: "error", text: "Initiating reboot sequence..." }]);
        await simulateDelay(500);
        addLines([{ type: "system", text: "Shutting down services..." }]);
        await simulateDelay(700);
        addLines([{ type: "error", text: "ERROR: Permission denied." }]);
        await simulateDelay(300);
        addLines([
          { type: "error", text: "ERROR: Something is preventing shutdown." },
          { type: "system", text: '"Nice try."' },
        ]);
        break;
      }

      default:
        addLines([
          { type: "error", text: `Command not found: ${command}` },
          { type: "output", text: 'Type "help" for available commands.' },
        ]);
    }

    setIsProcessing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    const cmd = input.trim();
    addLines([{ type: "input", text: `$ ${cmd}` }]);
    setHistory((prev) => [...prev, cmd]);
    setHistoryIdx(-1);
    setInput("");
    processCommand(cmd);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const newIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(newIdx);
      setInput(history[newIdx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx === -1) return;
      const newIdx = historyIdx + 1;
      if (newIdx >= history.length) {
        setHistoryIdx(-1);
        setInput("");
      } else {
        setHistoryIdx(newIdx);
        setInput(history[newIdx]);
      }
    }
  };

  const lineColor = (type: string) => {
    switch (type) {
      case "input": return "text-terminal-text font-bold";
      case "error": return "text-amber-status";
      case "system": return "text-accent";
      case "ascii": return "text-terminal-text/60";
      default: return "text-terminal-text";
    }
  };

  return (
    <div
      className="bg-terminal-bg font-mono text-xs crt-flicker -m-3 flex flex-col"
      style={{ minHeight: 300 }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Output area */}
      <div className="flex-1 overflow-auto p-3 space-y-0.5">
        {lines.map((line, i) => (
          <div key={i} className={lineColor(line.type)}>
            {line.text || "\u00A0"}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input line */}
      <form onSubmit={handleSubmit} className="flex items-center px-3 pb-3 pt-1 border-t border-terminal-text/10">
        <span className="text-accent font-bold mr-1">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isProcessing}
          className="flex-1 bg-transparent text-terminal-text outline-none caret-terminal-text"
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
        {isProcessing && <span className="text-accent animate-pulse ml-2">⏳</span>}
      </form>
    </div>
  );
};

export default TerminalWindow;

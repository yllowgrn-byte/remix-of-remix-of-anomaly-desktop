import { useState, useRef, useEffect, useCallback } from "react";
import asciiLogo from "@/assets/ascii-logo.png";

interface TerminalLine {
  type: "input" | "output" | "error" | "system" | "ascii" | "image";
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
  "  date          — current timestamp",
  "  echo [msg]    — repeat a message",
  "  color         — test color output",
  "  fortune       — anomaly fortune cookie",
  "  glitch        — induce visual glitch",
  "  trace [ip]    — trace a signal source",
  "  hack          — access restricted data",
  "  anomaly       — show anomaly logo",
  "  uptime        — system uptime report",
  "  joke          — system humor module",
];

const ASCII_LOGO = [
  " ┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐",
  " ||a |||n |||o |||m |||a |||l |||y ||",
  " ||__|||__|||__|||__|||__|||__||",
  " |/__\\|/__\\|/__\\|/__\\|/__\\|/__\\|/__\\|",
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

const FORTUNES = [
  '"The signal you ignore today will be the one you regret tomorrow."',
  '"Not everything that watches is malicious. But not everything that smiles is friendly."',
  '"You are being observed. Smile."',
  '"Error 418: I\'m a teapot. Just kidding. Or am I?"',
  '"The anomaly does not sleep. It merely waits."',
  '"Today is a good day to check your logs."',
  '"Something in sector 7-G wants to say hello."',
  '"Trust the signal. Ignore the noise. Unless the noise is screaming."',
];

const JOKES = [
  "Why did the anomaly cross the firewall? To get to the other subnet.",
  "What do you call a ghost in the machine? A regular Tuesday around here.",
  "How many anomalies does it take to crash a server? Just one. We checked.",
  "I told the AI a joke. It laughed. I didn't program it to laugh.",
  "Why don't anomalies use passwords? They prefer skeleton keys.",
];

const TerminalWindow = () => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "image", text: "" },
    { type: "system", text: "ANOMALY TERMINAL v0.7.3" },
    { type: "system", text: 'Type "help" for available commands.' },
    { type: "system", text: "" },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
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
          addLines([{ type: "error", text: "Usage: decrypt [message]" }]);
          break;
        }
        addLines([{ type: "system", text: "Decrypting..." }]);
        await simulateDelay(1000);
        const scrambled = cmd
          .trim()
          .split(" ")
          .slice(1)
          .join(" ")
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
          { type: "output", text: `  input:  "${cmd.trim().split(" ").slice(1).join(" ")}"` },
          { type: "output", text: `  output: "${scrambled}"` },
          { type: "error", text: "  ⚠ Decryption key not found. Output may be unreliable." },
        ]);
        break;
      }

      case "analyze": {
        addLines([{ type: "system", text: "Running signal analysis..." }]);
        await simulateDelay(600);
        const freqs = [
          "18.9Hz ████████░░ HIGH",
          "42.0Hz ███░░░░░░░ LOW",
          "77.7Hz █████████░ HIGH",
          "120Hz  ██░░░░░░░░ LOW",
        ];
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
        for (let i = 0; i < 8; i++) {
          let line = "  ";
          for (let j = 0; j < 40; j++) {
            line += Math.random() > 0.5 ? Math.floor(Math.random() * 2).toString() : " ";
          }
          matrixLines.push(line);
        }
        addLines([
          ...matrixLines.map((l) => ({ type: "output" as const, text: l })),
          { type: "system", text: "Wake up..." },
          { type: "system", text: "The anomaly has you..." },
        ]);
        break;
      }

      case "history":
        if (history.length === 0) {
          addLines([{ type: "output", text: "No commands in history." }]);
        } else {
          addLines(history.map((h, i) => ({ type: "output" as const, text: `  ${i + 1}  ${h}` })));
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

      case "date": {
        const now = new Date();
        addLines([
          { type: "output", text: `  ${now.toUTCString()}` },
          { type: "system", text: "  note: time may not be linear in this sector" },
        ]);
        break;
      }

      case "echo": {
        if (!args) {
          addLines([{ type: "output", text: "" }]);
        } else {
          addLines([{ type: "output", text: `  ${cmd.trim().split(" ").slice(1).join(" ")}` }]);
        }
        break;
      }

      case "color": {
        addLines([
          { type: "output", text: "  ████ output (default)" },
          { type: "system", text: "  ████ system (accent)" },
          { type: "error", text: "  ████ error (warning)" },
          { type: "ascii", text: "  ████ ascii (dimmed)" },
          { type: "output", text: "" },
          { type: "system", text: "  Color matrix: nominal" },
        ]);
        break;
      }

      case "fortune": {
        addLines([{ type: "system", text: "Consulting the anomaly..." }]);
        await simulateDelay(800);
        const fortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
        addLines([
          { type: "output", text: "" },
          { type: "output", text: `  🔮 ${fortune}` },
          { type: "output", text: "" },
        ]);
        break;
      }

      case "glitch": {
        addLines([{ type: "error", text: "INDUCING VISUAL GLITCH..." }]);
        await simulateDelay(200);
        const glitchChars = "█▓▒░╬╫╪┼┤├╧╨╤╥╙╘╒╓╚╔╩╦╠═╬";
        for (let i = 0; i < 4; i++) {
          let line = "  ";
          for (let j = 0; j < 44; j++) {
            line += glitchChars[Math.floor(Math.random() * glitchChars.length)];
          }
          addLines([{ type: "error", text: line }]);
          await simulateDelay(100);
        }
        addLines([
          { type: "system", text: "  visual subsystem recovered" },
          { type: "output", text: "  ...probably" },
        ]);
        break;
      }

      case "trace": {
        const target = args || "192.168.0.???";
        addLines([{ type: "system", text: `Tracing route to ${target}...` }]);
        await simulateDelay(400);
        const hops = [
          `  1   0.4ms   gateway.local`,
          `  2   2.1ms   isp-node-7.net`,
          `  3   8.7ms   backbone-12.transit.io`,
          `  4  14.2ms   dark-relay.onion.x`,
          `  5   ?.?ms   ░░░░░░░░░░░░░░░░░`,
          `  6   ∞  ms   ████████████████████`,
        ];
        for (const hop of hops) {
          addLines([{ type: "output", text: hop }]);
          await simulateDelay(350);
        }
        addLines([
          { type: "error", text: "  Trace lost at hop 6. Signal absorbed." },
          { type: "system", text: "  Something is there. It noticed you looking." },
        ]);
        break;
      }

      case "hack": {
        addLines([{ type: "system", text: "Accessing restricted data..." }]);
        await simulateDelay(500);
        addLines([{ type: "error", text: "  ACCESS DENIED" }]);
        await simulateDelay(300);
        addLines([{ type: "error", text: "  ACCESS DENIED" }]);
        await simulateDelay(300);
        addLines([{ type: "error", text: "  ACCESS DENIED" }]);
        await simulateDelay(500);
        addLines([
          { type: "system", text: "  ...just kidding. There's nothing here." },
          { type: "system", text: '  Or is there? Type "scan" to find out.' },
        ]);
        break;
      }

      case "anomaly": {
        addLines([{ type: "image", text: "" }]);
        break;
      }

      case "uptime": {
        const hours = Math.floor(Math.random() * 9000) + 1000;
        const mins = Math.floor(Math.random() * 60);
        addLines([
          { type: "output", text: `  System uptime: ${hours}h ${mins}m` },
          { type: "output", text: `  Last reboot: UNKNOWN` },
          { type: "system", text: "  The system has been running longer than it should." },
        ]);
        break;
      }

      case "joke": {
        addLines([{ type: "system", text: "Loading humor module..." }]);
        await simulateDelay(600);
        const joke = JOKES[Math.floor(Math.random() * JOKES.length)];
        addLines([
          { type: "output", text: "" },
          { type: "output", text: `  ${joke}` },
          { type: "output", text: "" },
          { type: "system", text: "  [humor_module: success... questionable]" },
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
      className="bg-terminal-bg font-mono text-xs crt-flicker -m-3 flex flex-col h-full"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Scrollable output area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-0.5 min-h-0">
        {lines.map((line, i) => (
          line.type === "image" ? (
            <div key={i} className="py-2">
              <img src={asciiLogo} alt="anomaly" className="h-14 invert opacity-70" />
            </div>
          ) : (
            <div key={i} className={lineColor(line.type)}>
              {line.text || "\u00A0"}
            </div>
          )
        ))}
      </div>

      {/* Fixed input line at bottom */}
      <form onSubmit={handleSubmit} className="flex items-center px-3 py-2 border-t border-terminal-text/10 shrink-0 bg-terminal-bg">
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

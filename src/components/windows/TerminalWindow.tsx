import { useState, useRef, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TerminalLine {
  type: "input" | "output" | "error" | "system" | "ascii" | "highlight" | "dim" | "warn" | "info" | "header";
  text: string;
}

const HELP_TEXT: TerminalLine[] = [
  { type: "header", text: "┌─── COMMAND REFERENCE ───────────────────┐" },
  { type: "output", text: "│                                         │" },
  { type: "info",   text: "│  help          — show this message      │" },
  { type: "info",   text: "│  status        — system diagnostics     │" },
  { type: "info",   text: "│  scan          — run anomaly scan       │" },
  { type: "info",   text: "│  ping          — test connection        │" },
  { type: "info",   text: "│  whoami        — identity check         │" },
  { type: "info",   text: "│  logs          — recent activity log    │" },
  { type: "info",   text: "│  decrypt [msg] — decrypt a message      │" },
  { type: "info",   text: "│  analyze       — run signal analysis    │" },
  { type: "info",   text: "│  clear         — clear terminal         │" },
  { type: "info",   text: "│  history       — command history        │" },
  { type: "info",   text: "│  about         — about this system      │" },
  { type: "info",   text: "│  matrix        — ???                    │" },
  { type: "info",   text: "│  reboot        — attempt system reboot  │" },
  { type: "info",   text: "│  date          — current timestamp      │" },
  { type: "info",   text: "│  echo [msg]    — repeat a message       │" },
  { type: "info",   text: "│  color         — test color output      │" },
  { type: "info",   text: "│  fortune       — anomaly fortune cookie │" },
  { type: "info",   text: "│  glitch        — induce visual glitch   │" },
  { type: "info",   text: "│  trace [ip]    — trace a signal source  │" },
  { type: "info",   text: "│  hack          — access restricted data │" },
  { type: "info",   text: "│  anomaly       — show anomaly logo      │" },
  { type: "info",   text: "│  uptime        — system uptime report   │" },
  { type: "info",   text: "│  joke          — system humor module    │" },
  { type: "info",   text: "│  story         — fetch transmissions    │" },
  { type: "output", text: "│                                         │" },
  { type: "header", text: "└─────────────────────────────────────────┘" },
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
    { type: "dim", text: "" },
    { type: "highlight", text: "  A G E N T  A N O M A L Y" },
    { type: "dim", text: "" },
    { type: "header", text: "  ANOMALY TERMINAL v0.7.3" },
    { type: "dim", text: "  ─────────────────────────────────────────" },
    { type: "system", text: "  > booting core systems..." },
    { type: "info", text: "  > scanning memory banks.......... OK" },
    { type: "info", text: "  > initializing signal monitor.... OK" },
    { type: "system", text: "  > loading anomaly database....... OK" },
    { type: "info", text: "  > calibrating sensors............ OK" },
    { type: "warn",  text: "  > threat assessment.............. ELEVATED" },
    { type: "dim", text: "  ─────────────────────────────────────────" },
    { type: "highlight", text: "  All systems online. 3 anomalies tracked." },
    { type: "output", text: '  Type "help" for commands. Try "story" for transmissions.' },
    { type: "dim", text: "" },
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
        addLines(HELP_TEXT);
        break;

      case "clear":
        setLines([]);
        setIsProcessing(false);
        return;

      case "status": {
        addLines([{ type: "system", text: "Running diagnostics..." }]);
        await simulateDelay(800);
        addLines([
          { type: "header", text: "┌─── SYSTEM DIAGNOSTICS ─────────────────┐" },
          { type: "info",   text: "│  Core............  ●  ONLINE            │" },
          { type: "info",   text: "│  Memory..........  847MB / 2GB          │" },
          { type: "info",   text: "│  Signal..........  ◈  STABLE            │" },
          { type: "warn",   text: "│  Threat Level....  ▲  ELEVATED          │" },
          { type: "error",  text: "│  Anomalies.......  3  ACTIVE            │" },
          { type: "info",   text: "│  Uptime..........  4721h 33m            │" },
          { type: "header", text: "└─────────────────────────────────────────┘" },
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
          { type: "dim", text: "" },
          { type: "header", text: "Scan complete. Results:" },
          { type: "info",   text: "  ● 2 anomalous signatures detected" },
          { type: "warn",   text: "  ● 1 unknown entity in sector 7-G" },
          { type: "info",   text: "  ● Signal interference at 18.9Hz" },
          { type: "error",  text: "  ⚠ Recommend immediate investigation" },
        ]);
        break;
      }

      case "ping": {
        addLines([{ type: "system", text: "Pinging anomaly core..." }]);
        await simulateDelay(500);
        addLines([
          { type: "output", text: "PING anomaly.core (127.0.0.1): 56 bytes" },
          { type: "info",   text: "  reply: seq=1 time=0.042ms" },
          { type: "info",   text: "  reply: seq=2 time=0.038ms" },
          { type: "warn",   text: "  reply: seq=3 time=███████ms" },
          { type: "error",  text: "  reply: seq=4 time=ERR_TEMPORAL_SHIFT" },
          { type: "dim", text: "" },
          { type: "output", text: "3 packets received, 1 anomalous" },
        ]);
        break;
      }

      case "whoami":
        await simulateDelay(600);
        addLines([
          { type: "system", text: "Checking identity matrix..." },
          { type: "dim", text: "" },
          { type: "info",      text: "  user:      OBSERVER" },
          { type: "info",      text: "  access:    LEVEL-3" },
          { type: "warn",      text: "  clearance: PROVISIONAL" },
          { type: "highlight", text: '  note: "You came looking. That means something."' },
        ]);
        break;

      case "logs":
        addLines([
          { type: "header", text: "┌─── Recent Activity ─────────────────────┐" },
          ...LOG_ENTRIES.map((l) => ({ type: "info" as const, text: `│  ${l}` })),
          { type: "header", text: "└─────────────────────────────────────────┘" },
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
          .trim().split(" ").slice(1).join(" ")
          .split("").map((c) => {
            if (c === " ") return " ";
            const shift = Math.floor(Math.random() * 26);
            const code = c.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCharCode(((code - 65 + shift) % 26) + 65);
            if (code >= 97 && code <= 122) return String.fromCharCode(((code - 97 + shift) % 26) + 97);
            return c;
          }).join("");
        addLines([
          { type: "info",  text: `  input:  "${cmd.trim().split(" ").slice(1).join(" ")}"` },
          { type: "highlight", text: `  output: "${scrambled}"` },
          { type: "warn",  text: "  ⚠ Decryption key not found. Output may be unreliable." },
        ]);
        break;
      }

      case "analyze": {
        addLines([{ type: "system", text: "Running signal analysis..." }]);
        await simulateDelay(600);
        addLines([
          { type: "header", text: "┌─── SIGNAL ANALYSIS ─────────────────────┐" },
          { type: "error",  text: "│  18.9Hz  ████████░░  HIGH               │" },
          { type: "info",   text: "│  42.0Hz  ███░░░░░░░  LOW                │" },
          { type: "error",  text: "│  77.7Hz  █████████░  HIGH               │" },
          { type: "info",   text: "│  120Hz   ██░░░░░░░░  LOW                │" },
          { type: "header", text: "└─────────────────────────────────────────┘" },
          { type: "system", text: "Dominant frequency: 18.9Hz (subsonic)" },
          { type: "warn",   text: "Pattern matches known anomaly signature." },
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
          ...matrixLines.map((l) => ({ type: "info" as const, text: l })),
          { type: "highlight", text: "Wake up..." },
          { type: "highlight", text: "The anomaly has you..." },
        ]);
        break;
      }

      case "history":
        if (history.length === 0) {
          addLines([{ type: "dim", text: "No commands in history." }]);
        } else {
          addLines(history.map((h, i) => ({ type: "info" as const, text: `  ${String(i + 1).padStart(3)}  ${h}` })));
        }
        break;

      case "about":
        addLines([
          { type: "header",    text: "ANOMALY — Digital Presence Tracker" },
          { type: "dim",       text: "Version 0.7.3 (unstable)" },
          { type: "dim",       text: "" },
          { type: "output",    text: "Purpose: Monitor, log, and catalog" },
          { type: "output",    text: "anomalous digital signatures." },
          { type: "dim",       text: "" },
          { type: "highlight", text: '"It watches because you asked it to."' },
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
          { type: "error",     text: "ERROR: Something is preventing shutdown." },
          { type: "highlight", text: '"Nice try."' },
        ]);
        break;
      }

      case "date": {
        const now = new Date();
        addLines([
          { type: "info",   text: `  ${now.toUTCString()}` },
          { type: "warn",   text: "  note: time may not be linear in this sector" },
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
          { type: "output",    text: "  ████ output    — default text" },
          { type: "system",    text: "  ████ system    — system messages" },
          { type: "info",      text: "  ████ info      — data & values" },
          { type: "warn",      text: "  ████ warn      — caution" },
          { type: "error",     text: "  ████ error     — alerts & danger" },
          { type: "highlight", text: "  ████ highlight — emphasis" },
          { type: "header",    text: "  ████ header    — borders & titles" },
          { type: "dim",       text: "  ████ dim       — faded / metadata" },
          { type: "dim",       text: "" },
          { type: "system",    text: "  Color matrix: nominal" },
        ]);
        break;
      }

      case "fortune": {
        addLines([{ type: "system", text: "Consulting the anomaly..." }]);
        await simulateDelay(800);
        const fortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
        addLines([
          { type: "dim", text: "" },
          { type: "highlight", text: `  🔮 ${fortune}` },
          { type: "dim", text: "" },
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
          addLines([{ type: i % 2 === 0 ? "error" : "warn", text: line }]);
          await simulateDelay(100);
        }
        addLines([
          { type: "system", text: "  visual subsystem recovered" },
          { type: "dim",    text: "  ...probably" },
        ]);
        break;
      }

      case "trace": {
        const target = args || "192.168.0.???";
        addLines([{ type: "system", text: `Tracing route to ${target}...` }]);
        await simulateDelay(400);
        const hops: TerminalLine[] = [
          { type: "info",  text: `  1   0.4ms   gateway.local` },
          { type: "info",  text: `  2   2.1ms   isp-node-7.net` },
          { type: "info",  text: `  3   8.7ms   backbone-12.transit.io` },
          { type: "warn",  text: `  4  14.2ms   dark-relay.onion.x` },
          { type: "error", text: `  5   ?.?ms   ░░░░░░░░░░░░░░░░░` },
          { type: "error", text: `  6   ∞  ms   ████████████████████` },
        ];
        for (const hop of hops) {
          addLines([hop]);
          await simulateDelay(350);
        }
        addLines([
          { type: "error",     text: "  Trace lost at hop 6. Signal absorbed." },
          { type: "highlight", text: "  Something is there. It noticed you looking." },
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
          { type: "dim",       text: "  ...just kidding. There's nothing here." },
          { type: "highlight", text: '  Or is there? Type "scan" to find out.' },
        ]);
        break;
      }

      case "anomaly": {
        addLines([
          { type: "dim", text: "" },
          { type: "ascii", text: "  A G E N T  A N O M A L Y" },
          { type: "dim", text: "" },
        ]);
        break;
      }

      case "uptime": {
        const hours = Math.floor(Math.random() * 9000) + 1000;
        const mins = Math.floor(Math.random() * 60);
        addLines([
          { type: "info",      text: `  System uptime: ${hours}h ${mins}m` },
          { type: "warn",      text: `  Last reboot: UNKNOWN` },
          { type: "highlight", text: "  The system has been running longer than it should." },
        ]);
        break;
      }

      case "joke": {
        addLines([{ type: "system", text: "Loading humor module..." }]);
        await simulateDelay(600);
        const joke = JOKES[Math.floor(Math.random() * JOKES.length)];
        addLines([
          { type: "dim", text: "" },
          { type: "output", text: `  ${joke}` },
          { type: "dim", text: "" },
          { type: "dim",  text: "  [humor_module: success... questionable]" },
        ]);
        break;
      }

      case "story": {
        addLines([{ type: "system", text: "Fetching anomaly transmissions..." }]);
        await simulateDelay(600);
        const { data, error: dbError } = await supabase
          .from("story_entries")
          .select("*")
          .in("status", ["live", "pinned"])
          .order("sort_order", { ascending: true })
          .limit(20);
        if (dbError || !data || data.length === 0) {
          addLines([
            { type: "error", text: "  ⚠ No transmissions found in the archive." },
            { type: "dim",   text: "  The signal is quiet... for now." },
          ]);
        } else {
          addLines([
            { type: "header", text: "┌─── ANOMALY TRANSMISSIONS ───────────────┐" },
          ]);
          data.forEach((entry, idx) => {
            const typeColor: TerminalLine["type"] = 
              ["signal", "trace", "memory_leak"].includes(entry.entry_type) ? "error" : 
              ["system_remark", "witness_line"].includes(entry.entry_type) ? "highlight" : 
              "info";
            addLines([
              { type: typeColor, text: `│ ${String(idx + 1).padStart(2, "0")}. [${entry.entry_type}]` },
              { type: "output",  text: `│     ${entry.content}` },
              { type: "dim",     text: `│     ${entry.published_at ? new Date(entry.published_at).toLocaleString() : "unpublished"}` },
            ]);
          });
          addLines([
            { type: "header", text: "└─────────────────────────────────────────┘" },
            { type: "system", text: `  ${data.length} transmission(s) recovered.` },
          ]);
        }
        break;
      }

      default:
        addLines([
          { type: "error",  text: `Command not found: ${command}` },
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
      case "input":     return "text-[hsl(210,60%,75%)] font-bold";        // cool blue for user input
      case "output":    return "text-[hsl(40,10%,72%)]";                    // warm neutral for general output
      case "error":     return "text-destructive font-bold";                // red for errors/alerts
      case "warn":      return "text-amber-status";                         // amber for warnings
      case "system":    return "text-accent";                               // teal for system messages
      case "info":      return "text-[hsl(200,40%,68%)]";                   // soft blue for data
      case "header":    return "text-[hsl(280,30%,70%)] font-bold";         // muted purple for borders/titles
      case "ascii":     return "text-[hsl(40,10%,72%)]/60";                 // dimmed neutral
      case "highlight": return "text-[hsl(45,80%,70%)] font-bold";         // warm gold for emphasis
      case "dim":       return "text-[hsl(40,10%,72%)]/35 italic";         // very faded
      default:          return "text-[hsl(40,10%,72%)]";
    }
  };

  return (
    <div
      className="bg-terminal-bg font-mono text-xs crt-flicker -m-3 flex flex-col"
      style={{ height: "calc(100% + 24px)" }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Scrollable output area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-0.5 min-h-0 hide-scrollbar">
        {lines.map((line, i) => (
          <div
            key={i}
            className={`${lineColor(line.type)} ${
              line.type === "ascii" && line.text.includes("A G E N T")
                ? "text-lg font-retro tracking-[0.3em] text-[hsl(45,80%,70%)]"
                : ""
            }`}
          >
            {line.text || "\u00A0"}
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="border-t border-[hsl(200,20%,20%)] shrink-0 bg-terminal-bg">
        <form onSubmit={handleSubmit} className="flex items-center px-3 py-1.5">
          <span className="text-[hsl(210,60%,75%)] font-bold mr-1.5">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            className="flex-1 bg-transparent text-[hsl(40,10%,78%)] outline-none caret-accent placeholder:text-[hsl(40,10%,72%)]/20"
            placeholder={isProcessing ? "" : "enter command..."}
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
          {isProcessing && <span className="text-amber-status animate-pulse ml-2">●</span>}
        </form>
      </div>
    </div>
  );
};

export default TerminalWindow;

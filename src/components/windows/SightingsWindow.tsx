import { useState } from "react";

interface Sighting {
  id: string;
  timestamp: string;
  location: string;
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  status: "confirmed" | "unverified" | "disputed";
}

const sightingsData: Sighting[] = [
  {
    id: "SIG-0041",
    timestamp: "2026-03-15 23:47:12",
    location: "Sector 7-G",
    type: "Visual Distortion",
    severity: "high",
    description: "Repeating shadow pattern detected in surveillance feed. No physical source identified. Pattern matches previous incident SIG-0038.",
    status: "confirmed",
  },
  {
    id: "SIG-0040",
    timestamp: "2026-03-14 04:12:55",
    location: "Sub-level B2",
    type: "Audio Fragment",
    severity: "medium",
    description: "Low-frequency hum recorded at 18.9Hz. Duration: 47 seconds. Subsonic range — inaudible to staff on site.",
    status: "confirmed",
  },
  {
    id: "SIG-0039",
    timestamp: "2026-03-12 19:33:08",
    location: "External Perimeter",
    type: "EM Spike",
    severity: "critical",
    description: "Electromagnetic burst registered at 340mT. All nearby electronics temporarily disrupted. Source direction: unknown.",
    status: "unverified",
  },
  {
    id: "SIG-0038",
    timestamp: "2026-03-10 11:05:44",
    location: "Sector 7-G",
    type: "Visual Distortion",
    severity: "high",
    description: "First occurrence of shadow pattern. Camera 4B captured 12 frames of anomalous movement. No personnel in area at the time.",
    status: "confirmed",
  },
  {
    id: "SIG-0037",
    timestamp: "2026-03-08 02:21:17",
    location: "Data Core",
    type: "Data Corruption",
    severity: "medium",
    description: "Sector logs from 01:00-02:00 replaced with repeating hex sequence. Backup intact. Origin of modification unknown.",
    status: "disputed",
  },
];

const severityColors: Record<string, string> = {
  low: "text-muted-foreground",
  medium: "text-amber-status",
  high: "text-destructive",
  critical: "text-destructive",
};

const severityBg: Record<string, string> = {
  low: "bg-muted",
  medium: "bg-amber-status/10",
  high: "bg-destructive/10",
  critical: "bg-destructive/20",
};

const statusColors: Record<string, string> = {
  confirmed: "text-terminal-text",
  unverified: "text-amber-status",
  disputed: "text-muted-foreground",
};

const SightingsWindow = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>("all");

  const filtered = filterSeverity === "all"
    ? sightingsData
    : sightingsData.filter((s) => s.severity === filterSeverity);

  const selected = sightingsData.find((s) => s.id === selectedId);

  return (
    <div className="flex flex-col gap-3 font-mono text-xs">
      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Sightings Log</span>
        <span className="flex-1" />
        {["all", "critical", "high", "medium", "low"].map((sev) => (
          <button
            key={sev}
            onClick={() => setFilterSeverity(sev)}
            className={`px-2 py-0.5 text-[10px] uppercase tracking-wide ${
              filterSeverity === sev
                ? "bevel-sunken bg-window-bg font-bold"
                : "bevel-raised bg-secondary hover:bg-muted"
            }`}
          >
            {sev}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bevel-sunken bg-window-bg">
        {/* Header */}
        <div className="grid grid-cols-[70px_140px_1fr_80px_80px] gap-1 px-2 py-1 border-b border-border text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
          <span>ID</span>
          <span>Timestamp</span>
          <span>Type / Location</span>
          <span>Severity</span>
          <span>Status</span>
        </div>

        {/* Rows */}
        {filtered.map((s) => (
          <div
            key={s.id}
            onClick={() => setSelectedId(selectedId === s.id ? null : s.id)}
            className={`grid grid-cols-[70px_140px_1fr_80px_80px] gap-1 px-2 py-1.5 border-b border-border/20 cursor-pointer transition-colors ${
              selectedId === s.id ? "bg-primary/10" : "hover:bg-primary/5"
            }`}
          >
            <span className="text-accent font-bold">{s.id}</span>
            <span className="text-muted-foreground">{s.timestamp}</span>
            <span className="truncate">
              <span className="text-foreground">{s.type}</span>
              <span className="text-muted-foreground"> · {s.location}</span>
            </span>
            <span className={`font-bold uppercase ${severityColors[s.severity]}`}>{s.severity}</span>
            <span className={`uppercase ${statusColors[s.status]}`}>{s.status}</span>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center text-muted-foreground py-6">
            No sightings match this filter.
          </div>
        )}
      </div>

      {/* Detail Panel */}
      {selected && (
        <div className={`bevel-sunken p-3 space-y-2 ${severityBg[selected.severity]}`}>
          <div className="flex items-center justify-between">
            <span className="text-accent font-bold text-sm">{selected.id}</span>
            <span className={`text-[10px] uppercase font-bold ${severityColors[selected.severity]}`}>
              ● {selected.severity}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
            <div><span className="text-muted-foreground">location:</span> <span className="text-foreground">{selected.location}</span></div>
            <div><span className="text-muted-foreground">type:</span> <span className="text-foreground">{selected.type}</span></div>
            <div><span className="text-muted-foreground">recorded:</span> <span className="text-foreground">{selected.timestamp}</span></div>
            <div><span className="text-muted-foreground">status:</span> <span className={statusColors[selected.status]}>{selected.status}</span></div>
          </div>
          <p className="text-[11px] text-foreground leading-relaxed border-t border-border/30 pt-2">
            {selected.description}
          </p>
        </div>
      )}

      <div className="text-[10px] text-muted-foreground text-right">
        {filtered.length} record(s) · click row for details
      </div>
    </div>
  );
};

export default SightingsWindow;

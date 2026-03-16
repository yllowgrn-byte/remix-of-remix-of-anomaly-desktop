import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Sighting {
  id: string;
  sig_id: string;
  timestamp: string;
  location: string;
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  status: "confirmed" | "unverified" | "disputed";
}

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
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSightings = async () => {
      const { data } = await supabase
        .from("sightings")
        .select("*")
        .order("timestamp", { ascending: false });
      if (data) setSightings(data as unknown as Sighting[]);
      setLoading(false);
    };
    fetchSightings();

    const channel = supabase
      .channel("sightings-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "sightings" }, () => {
        fetchSightings();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const filtered = filterSeverity === "all"
    ? sightings
    : sightings.filter((s) => s.severity === filterSeverity);

  const selected = sightings.find((s) => s.id === selectedId);

  if (loading) {
    return <div className="text-xs text-muted-foreground font-mono p-4">loading sightings data...</div>;
  }

  return (
    <div className="flex flex-col gap-3 font-mono text-xs h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap shrink-0 sticky top-0 bg-window-bg z-10 pb-1">
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
            <span className="text-accent font-bold">{s.sig_id}</span>
            <span className="text-muted-foreground">{new Date(s.timestamp).toLocaleString("en-CA", { hour12: false }).replace(",", "")}</span>
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
            <span className="text-accent font-bold text-sm">{selected.sig_id}</span>
            <span className={`text-[10px] uppercase font-bold ${severityColors[selected.severity]}`}>
              ● {selected.severity}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
            <div><span className="text-muted-foreground">location:</span> <span className="text-foreground">{selected.location}</span></div>
            <div><span className="text-muted-foreground">type:</span> <span className="text-foreground">{selected.type}</span></div>
            <div><span className="text-muted-foreground">recorded:</span> <span className="text-foreground">{new Date(selected.timestamp).toLocaleString("en-CA", { hour12: false })}</span></div>
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

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface StoryEntry {
  id: string;
  entry_type: string;
  content: string;
  status: string;
  published_at: string | null;
  created_at: string;
}

const typeColors: Record<string, string> = {
  log: "text-terminal-text",
  note: "text-amber-status",
  trace: "text-accent",
  fragment: "text-muted-foreground",
  archive_pull: "text-primary",
  witness_line: "text-destructive",
  system_remark: "text-terminal-text",
  memory_leak: "text-amber-status",
  signal: "text-accent",
};

const typeIcons: Record<string, string> = {
  log: "▸",
  note: "◆",
  trace: "◇",
  fragment: "░",
  archive_pull: "▪",
  witness_line: "▹",
  system_remark: "●",
  memory_leak: "⚠",
  signal: "◈",
};

const LiveFeedWindow = () => {
  const [entries, setEntries] = useState<StoryEntry[]>([]);

  const fetchEntries = async () => {
    const { data } = await supabase
      .from("story_entries")
      .select("*")
      .in("status", ["live", "pinned"])
      .order("published_at", { ascending: false })
      .limit(20);
    if (data) setEntries(data);
  };

  useEffect(() => {
    fetchEntries();

    const channel = supabase
      .channel("live-feed")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "story_entries" },
        () => fetchEntries()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const formatTime = (ts: string | null) => {
    if (!ts) return "??:??:??";
    return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  const formatDate = (ts: string | null) => {
    if (!ts) return "??/??";
    return new Date(ts).toLocaleDateString([], { month: "2-digit", day: "2-digit" });
  };

  return (
    <div className="space-y-3">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-terminal-text animate-pulse" />
          <span className="text-[10px] text-terminal-text uppercase tracking-wider font-bold">Live Feed</span>
        </div>
        <span className="text-[10px] text-muted-foreground">{entries.length} entries · auto-refresh</span>
      </div>

      <div className="border-t border-border/30" />

      {/* Feed entries */}
      <div className="space-y-1 font-mono text-xs">
        {entries.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center space-y-1">
            <p className="text-sm">⊘</p>
            <p>no entries yet</p>
            <p className="text-[10px]">the machine is quiet. for now.</p>
          </div>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="flex gap-2 py-1.5 px-1 border-b border-border/20 hover:bg-primary/5 transition-colors"
            >
              <span className="text-muted-foreground text-[10px] whitespace-nowrap shrink-0 pt-0.5">
                {formatDate(entry.published_at)} {formatTime(entry.published_at)}
              </span>
              <span className={`shrink-0 ${typeColors[entry.entry_type] || "text-foreground"}`}>
                {typeIcons[entry.entry_type] || "▸"}
              </span>
              <span className={`uppercase text-[10px] font-bold whitespace-nowrap shrink-0 pt-px ${typeColors[entry.entry_type] || "text-foreground"}`}>
                {entry.entry_type.replace("_", " ")}
              </span>
              <span className="text-foreground flex-1">{entry.content}</span>
              {entry.status === "pinned" && <span className="text-amber-status shrink-0">📌</span>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LiveFeedWindow;

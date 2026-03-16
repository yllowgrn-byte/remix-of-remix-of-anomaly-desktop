import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ArchiveEntry {
  id: string;
  entry_type: string;
  content: string;
  created_at: string;
}

const typeIcons: Record<string, string> = {
  log: "📄",
  note: "📝",
  trace: "🔍",
  fragment: "🧩",
  archive_pull: "📦",
  witness_line: "👁",
  system_remark: "💻",
  memory_leak: "🧠",
  signal: "📡",
};

const ArchiveWindow = () => {
  const [entries, setEntries] = useState<ArchiveEntry[]>([]);

  useEffect(() => {
    const fetchArchive = async () => {
      const { data } = await supabase
        .from("story_entries")
        .select("*")
        .eq("status", "archived")
        .order("created_at", { ascending: false })
        .limit(30);
      if (data) setEntries(data);
    };
    fetchArchive();
  }, []);

  const formatDate = (ts: string) =>
    new Date(ts).toLocaleDateString([], { year: "2-digit", month: "2-digit", day: "2-digit" });

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b border-border/40 pb-2">
        <span className="text-[10px] text-muted-foreground">📂 /archive/</span>
        <span className="flex-1" />
        <span className="text-[10px] text-muted-foreground">{entries.length} object(s)</span>
      </div>

      {/* File list */}
      <div className="font-mono text-xs">
        {/* Column headers */}
        <div className="flex gap-3 border-b border-border pb-1 mb-1 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
          <span className="w-5 shrink-0"></span>
          <span className="w-16 shrink-0">Date</span>
          <span className="w-24 shrink-0">Type</span>
          <span className="flex-1">Name</span>
        </div>

        {entries.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center space-y-1">
            <p className="text-lg">📂</p>
            <p>archive empty</p>
            <p className="text-[10px]">nothing stored yet. nothing worth keeping? or nothing left?</p>
          </div>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="flex gap-3 py-1 px-0.5 hover:bg-primary/10 cursor-default border-b border-border/10"
            >
              <span className="w-5 shrink-0 text-center">
                {typeIcons[entry.entry_type] || "📄"}
              </span>
              <span className="text-muted-foreground w-16 shrink-0">{formatDate(entry.created_at)}</span>
              <span className="w-24 shrink-0 text-accent">{entry.entry_type.replace("_", " ")}</span>
              <span className="flex-1 truncate">{entry.content}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ArchiveWindow;

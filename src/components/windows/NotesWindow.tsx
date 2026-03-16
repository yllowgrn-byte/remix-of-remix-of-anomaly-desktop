import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const defaultNotes = [
  "today it posted three more lines by itself",
  "",
  "still somehow less annoying than most people online",
  "",
  "---",
  "",
  "some of the older entries read like it already knew",
  "people would come back and check this thing again",
  "",
  "not ideal",
  "",
  "---",
  "",
  "log says everything is normal",
  "which usually means it absolutely is not",
];

const NotesWindow = () => {
  const [pinnedEntries, setPinnedEntries] = useState<string[]>([]);

  useEffect(() => {
    const fetchPinned = async () => {
      const { data } = await supabase
        .from("story_entries")
        .select("content")
        .eq("status", "pinned")
        .order("sort_order", { ascending: true });
      if (data && data.length > 0) {
        setPinnedEntries(data.map((e) => e.content));
      }
    };
    fetchPinned();
  }, []);

  const lines = pinnedEntries.length > 0 ? pinnedEntries : defaultNotes;

  return (
    <div className="space-y-3">
      {/* Ruler bar */}
      <div className="flex items-center gap-1 border-b border-border/40 pb-1">
        <span className="text-[9px] text-muted-foreground">Ln 1, Col 1</span>
        <span className="flex-1" />
        <span className="text-[9px] text-muted-foreground">UTF-8</span>
        <span className="text-[9px] text-muted-foreground ml-2">CRLF</span>
      </div>

      {/* Note content */}
      <div className="font-mono text-xs leading-relaxed min-h-[200px]">
        {lines.map((line, i) => (
          <div key={i} className="flex">
            <span className="text-[10px] text-muted-foreground w-6 shrink-0 text-right mr-3 select-none">
              {i + 1}
            </span>
            <span className={line === "---" ? "text-border" : "text-foreground"}>
              {line || "\u00A0"}
            </span>
          </div>
        ))}
        <div className="flex mt-1">
          <span className="text-[10px] text-muted-foreground w-6 shrink-0 text-right mr-3 select-none">
            {lines.length + 1}
          </span>
          <span className="cursor-blink text-muted-foreground">│</span>
        </div>
      </div>
    </div>
  );
};

export default NotesWindow;

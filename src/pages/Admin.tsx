import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import RetroWindow from "@/components/desktop/RetroWindow";
import MenuBar from "@/components/desktop/MenuBar";
import Taskbar from "@/components/desktop/Taskbar";
import type { Database } from "@/integrations/supabase/types";

type EntryType = Database["public"]["Enums"]["entry_type"];
type EntryStatus = Database["public"]["Enums"]["entry_status"];

interface StoryEntry {
  id: string;
  entry_type: EntryType;
  content: string;
  status: EntryStatus;
  sort_order: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

const ENTRY_TYPES: EntryType[] = [
  "log", "note", "trace", "fragment", "archive_pull",
  "witness_line", "system_remark", "memory_leak", "signal",
];

const PASSWORD = "onlyadmincanaccess";

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const [entries, setEntries] = useState<StoryEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<StoryEntry | null>(null);
  const [newContent, setNewContent] = useState("");
  const [newType, setNewType] = useState<EntryType>("log");
  const [newStatus, setNewStatus] = useState<EntryStatus>("draft");

  const [autonomousEnabled, setAutonomousEnabled] = useState(false);
  const [interval, setIntervalMin] = useState(15);

  // Notes management
  const [pinnedNotes, setPinnedNotes] = useState<StoryEntry[]>([]);
  const [newNote, setNewNote] = useState("");
  const [editingNote, setEditingNote] = useState<StoryEntry | null>(null);

  // Token management
  const [tokenAddress, setTokenAddress] = useState("");
  const [buyLink, setBuyLink] = useState("");

  // Sightings management
  interface SightingEntry {
    id: string;
    sig_id: string;
    timestamp: string;
    location: string;
    type: string;
    severity: "low" | "medium" | "high" | "critical";
    description: string;
    status: "confirmed" | "unverified" | "disputed";
  }
  const [sightings, setSightings] = useState<SightingEntry[]>([]);
  const [newSighting, setNewSighting] = useState({
    sig_id: "",
    location: "",
    type: "",
    severity: "medium" as "low" | "medium" | "high" | "critical",
    description: "",
    status: "unverified" as "confirmed" | "unverified" | "disputed",
  });
  const [editingSighting, setEditingSighting] = useState<SightingEntry | null>(null);

  const [activeTab, setActiveTab] = useState<"entries" | "notes" | "sightings" | "token" | "settings">("entries");
  const [statusMsg, setStatusMsg] = useState("");

  const showStatus = (msg: string) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(""), 3000);
  };

  const handleLogin = () => {
    if (password === PASSWORD) {
      setAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const fetchEntries = useCallback(async () => {
    const { data } = await supabase
      .from("story_entries")
      .select("*")
      .order("sort_order", { ascending: true });
    if (data) {
      const all = data as StoryEntry[];
      setEntries(all.filter((e) => e.status !== "pinned"));
      setPinnedNotes(all.filter((e) => e.status === "pinned"));
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    const { data } = await supabase
      .from("site_settings")
      .select("*")
      .in("key", ["autonomous_enabled", "autonomous_interval_minutes", "token_address", "buy_link"]);
    if (data) {
      data.forEach((s) => {
        if (s.key === "autonomous_enabled") setAutonomousEnabled(s.value === true);
        if (s.key === "autonomous_interval_minutes") setIntervalMin(Number(s.value) || 15);
        if (s.key === "token_address") setTokenAddress(String(s.value || "").replace(/^"|"$/g, ""));
        if (s.key === "buy_link") setBuyLink(String(s.value || "").replace(/^"|"$/g, ""));
      });
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchEntries();
      fetchSettings();
    }
  }, [authenticated, fetchEntries, fetchSettings]);

  const createEntry = async () => {
    if (!newContent.trim()) return;
    const maxOrder = entries.length > 0 ? Math.max(...entries.map((e) => e.sort_order)) + 1 : 0;
    await supabase.from("story_entries").insert({
      content: newContent,
      entry_type: newType,
      status: newStatus,
      sort_order: maxOrder,
      published_at: newStatus === "live" || newStatus === "pinned" ? new Date().toISOString() : null,
    });
    setNewContent("");
    showStatus("entry created");
    fetchEntries();
  };

  const updateEntry = async (entry: StoryEntry, updates: Partial<StoryEntry>) => {
    if (updates.status === "live" || updates.status === "pinned") {
      updates.published_at = new Date().toISOString();
    }
    await supabase.from("story_entries").update(updates).eq("id", entry.id);
    showStatus("entry updated");
    fetchEntries();
  };

  const deleteEntry = async (id: string) => {
    await supabase.from("story_entries").delete().eq("id", id);
    showStatus("entry deleted");
    fetchEntries();
  };

  const publishNext = async () => {
    const queued = entries.filter((e) => e.status === "queued").sort((a, b) => a.sort_order - b.sort_order);
    if (queued.length === 0) {
      showStatus("no queued entries");
      return;
    }
    await updateEntry(queued[0], { status: "live" });
    showStatus("published: " + queued[0].content.slice(0, 40));
  };

  const toggleAutonomous = async () => {
    const newVal = !autonomousEnabled;
    setAutonomousEnabled(newVal);
    await supabase.from("site_settings").update({ value: newVal }).eq("key", "autonomous_enabled");
    showStatus(newVal ? "autonomous mode: ON" : "autonomous mode: OFF");
  };

  const updateInterval = async (mins: number) => {
    setIntervalMin(mins);
    await supabase.from("site_settings").update({ value: mins }).eq("key", "autonomous_interval_minutes");
    showStatus(`interval set to ${mins} minutes`);
  };

  const moveEntry = async (entry: StoryEntry, direction: "up" | "down") => {
    const list = entry.status === "pinned" ? pinnedNotes : entries;
    const sorted = [...list].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex((e) => e.id === entry.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const other = sorted[swapIdx];
    await supabase.from("story_entries").update({ sort_order: other.sort_order }).eq("id", entry.id);
    await supabase.from("story_entries").update({ sort_order: entry.sort_order }).eq("id", other.id);
    fetchEntries();
  };

  // Notes-specific functions
  const createNote = async () => {
    if (!newNote.trim()) return;
    const maxOrder = pinnedNotes.length > 0 ? Math.max(...pinnedNotes.map((e) => e.sort_order)) + 1 : 0;
    await supabase.from("story_entries").insert({
      content: newNote,
      entry_type: "note" as EntryType,
      status: "pinned" as EntryStatus,
      sort_order: maxOrder,
      published_at: new Date().toISOString(),
    });
    setNewNote("");
    showStatus("note added");
    fetchEntries();
  };

  // Password gate
  if (!authenticated) {
    return (
      <div className="h-screen flex flex-col bg-desktop">
        <div className="crt-overlay" />
        <MenuBar />
        <div className="flex-1 flex items-center justify-center">
          <RetroWindow title="System Password Required" icon="🔒">
            <div className="space-y-3 p-4 min-w-[300px]">
              <p className="text-xs text-muted-foreground">Enter administrator password to continue:</p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="bevel-sunken w-full bg-window-bg px-2 py-1 text-sm font-mono outline-none"
                autoFocus
              />
              {passwordError && (
                <p className="text-xs text-destructive">access denied</p>
              )}
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleLogin}
                  className="bevel-raised bg-secondary px-4 py-1 text-xs font-bold hover:bg-muted active:bevel-sunken"
                >
                  OK
                </button>
              </div>
            </div>
          </RetroWindow>
        </div>
        <Taskbar />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-desktop overflow-hidden">
      <div className="crt-overlay" />
      <MenuBar />

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Status message */}
        {statusMsg && (
          <div className="bevel-raised bg-secondary px-3 py-1 text-xs text-terminal-text font-mono">
            &gt; {statusMsg}
          </div>
        )}

        {/* Tab bar */}
        <div className="flex gap-0.5 font-mono text-xs">
          {(["entries", "notes", "token", "settings"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`bevel-raised px-4 py-1 font-bold uppercase tracking-wider ${
                activeTab === tab ? "bg-window-bg" : "bg-secondary hover:bg-muted"
              } active:bevel-sunken`}
            >
              {tab === "entries" ? "📋 Entries" : tab === "notes" ? "📝 Notes.txt" : tab === "token" ? "💰 Token" : "⚙️ Settings"}
            </button>
          ))}
        </div>

        {/* ENTRIES TAB */}
        {activeTab === "entries" && (
          <>
            <RetroWindow title="Create Entry" icon="✏️">
              <div className="space-y-2">
                <div className="flex gap-2 flex-wrap">
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as EntryType)}
                    className="bevel-sunken bg-window-bg px-2 py-1 text-xs font-mono outline-none"
                  >
                    {ENTRY_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as EntryStatus)}
                    className="bevel-sunken bg-window-bg px-2 py-1 text-xs font-mono outline-none"
                  >
                    <option value="draft">draft</option>
                    <option value="queued">queued</option>
                    <option value="live">live (publish now)</option>
                    <option value="pinned">pinned</option>
                  </select>
                </div>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="entry content..."
                  className="bevel-sunken bg-window-bg w-full px-2 py-1 text-xs font-mono outline-none min-h-[60px] resize-y"
                />
                <button
                  onClick={createEntry}
                  className="bevel-raised bg-secondary px-4 py-1 text-xs font-bold hover:bg-muted active:bevel-sunken"
                >
                  Create
                </button>
              </div>
            </RetroWindow>

            <RetroWindow title="All Entries" icon="📋" maxHeight="500px">
              <div className="space-y-1 font-mono text-xs">
                <div className="flex gap-2 border-b border-border pb-1 font-bold text-muted-foreground">
                  <span className="w-6">#</span>
                  <span className="w-20">Type</span>
                  <span className="w-16">Status</span>
                  <span className="flex-1">Content</span>
                  <span className="w-40">Actions</span>
                </div>
                {entries.map((entry, idx) => (
                  <div key={entry.id} className="flex gap-2 items-start py-0.5 border-b border-border/30">
                    <span className="w-6 text-muted-foreground">{idx + 1}</span>
                    <span className="w-20 text-accent">{entry.entry_type}</span>
                    <span className={`w-16 ${entry.status === "live" ? "text-terminal-text" : entry.status === "pinned" ? "text-amber-status" : "text-muted-foreground"}`}>
                      {entry.status}
                    </span>

                    {editingEntry?.id === entry.id ? (
                      <div className="flex-1 flex gap-1">
                        <input
                          value={editingEntry.content}
                          onChange={(e) => setEditingEntry({ ...editingEntry, content: e.target.value })}
                          className="bevel-sunken bg-window-bg flex-1 px-1 py-0.5 text-xs font-mono outline-none"
                        />
                        <button
                          onClick={() => {
                            updateEntry(entry, { content: editingEntry.content });
                            setEditingEntry(null);
                          }}
                          className="bevel-raised bg-secondary px-2 py-0.5 hover:bg-muted active:bevel-sunken"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => setEditingEntry(null)}
                          className="bevel-raised bg-secondary px-2 py-0.5 hover:bg-muted active:bevel-sunken"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <span className="flex-1 truncate">{entry.content}</span>
                    )}

                    <div className="w-40 flex gap-0.5 flex-wrap">
                      <button onClick={() => setEditingEntry(entry)} className="bevel-raised bg-secondary px-1 py-0 text-[9px] hover:bg-muted">edit</button>
                      <button onClick={() => updateEntry(entry, { status: "live" })} className="bevel-raised bg-secondary px-1 py-0 text-[9px] hover:bg-muted">pub</button>
                      <button onClick={() => updateEntry(entry, { status: "queued" })} className="bevel-raised bg-secondary px-1 py-0 text-[9px] hover:bg-muted">queue</button>
                      <button onClick={() => updateEntry(entry, { status: "pinned" })} className="bevel-raised bg-secondary px-1 py-0 text-[9px] hover:bg-muted">pin</button>
                      <button onClick={() => updateEntry(entry, { status: "archived" })} className="bevel-raised bg-secondary px-1 py-0 text-[9px] hover:bg-muted">arch</button>
                      <button onClick={() => updateEntry(entry, { status: "draft" })} className="bevel-raised bg-secondary px-1 py-0 text-[9px] hover:bg-muted">draft</button>
                      <button onClick={() => moveEntry(entry, "up")} className="bevel-raised bg-secondary px-1 py-0 text-[9px] hover:bg-muted">↑</button>
                      <button onClick={() => moveEntry(entry, "down")} className="bevel-raised bg-secondary px-1 py-0 text-[9px] hover:bg-muted">↓</button>
                      <button onClick={() => deleteEntry(entry.id)} className="bevel-raised bg-secondary px-1 py-0 text-[9px] hover:bg-destructive hover:text-destructive-foreground">del</button>
                    </div>
                  </div>
                ))}
                {entries.length === 0 && (
                  <div className="text-center text-muted-foreground py-4">no entries yet</div>
                )}
              </div>
            </RetroWindow>
          </>
        )}

        {/* NOTES TAB */}
        {activeTab === "notes" && (
          <>
            <RetroWindow title="Notes.txt Manager" icon="📝">
              <div className="space-y-3">
                <p className="text-[10px] text-muted-foreground font-mono">
                  Pinned notes appear in the notes.txt window on the main page. Add, edit, reorder, or delete them here.
                </p>

                {/* Add new note */}
                <div className="flex gap-2">
                  <input
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && createNote()}
                    placeholder="Add a new note line..."
                    className="bevel-sunken bg-window-bg flex-1 px-2 py-1 text-xs font-mono outline-none"
                  />
                  <button
                    onClick={createNote}
                    className="bevel-raised bg-secondary px-4 py-1 text-xs font-bold hover:bg-muted active:bevel-sunken"
                  >
                    + Add
                  </button>
                </div>

                {/* Note list */}
                <div className="space-y-1 font-mono text-xs">
                  {pinnedNotes.length === 0 && (
                    <div className="text-center text-muted-foreground py-4 bevel-sunken bg-window-bg">
                      no pinned notes — default content will show instead
                    </div>
                  )}
                  {pinnedNotes.map((note, idx) => (
                    <div key={note.id} className="flex items-center gap-2 py-1 border-b border-border/30">
                      <span className="text-muted-foreground text-[10px] w-5 text-right shrink-0">{idx + 1}</span>

                      {editingNote?.id === note.id ? (
                        <div className="flex-1 flex gap-1">
                          <input
                            value={editingNote.content}
                            onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                updateEntry(note, { content: editingNote.content });
                                setEditingNote(null);
                              } else if (e.key === "Escape") {
                                setEditingNote(null);
                              }
                            }}
                            className="bevel-sunken bg-window-bg flex-1 px-1 py-0.5 text-xs font-mono outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => {
                              updateEntry(note, { content: editingNote.content });
                              setEditingNote(null);
                            }}
                            className="bevel-raised bg-secondary px-2 py-0.5 hover:bg-muted active:bevel-sunken"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => setEditingNote(null)}
                            className="bevel-raised bg-secondary px-2 py-0.5 hover:bg-muted active:bevel-sunken"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <span className="flex-1 truncate text-foreground">
                          {note.content || <span className="text-muted-foreground italic">(empty line)</span>}
                        </span>
                      )}

                      <div className="flex gap-0.5 shrink-0">
                        <button onClick={() => setEditingNote(note)} className="bevel-raised bg-secondary px-1.5 py-0 text-[9px] hover:bg-muted">edit</button>
                        <button onClick={() => moveEntry(note, "up")} className="bevel-raised bg-secondary px-1 py-0 text-[9px] hover:bg-muted">↑</button>
                        <button onClick={() => moveEntry(note, "down")} className="bevel-raised bg-secondary px-1 py-0 text-[9px] hover:bg-muted">↓</button>
                        <button onClick={() => deleteEntry(note.id)} className="bevel-raised bg-secondary px-1 py-0 text-[9px] hover:bg-destructive hover:text-destructive-foreground">del</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-[10px] text-muted-foreground border-t border-border/30 pt-2">
                  tip: if no pinned notes exist, the notes.txt window shows default placeholder content
                </div>
              </div>
            </RetroWindow>
          </>
        )}

        {/* TOKEN TAB */}
        {activeTab === "token" && (
          <>
            <RetroWindow title="Token & Buy Link" icon="💰">
              <div className="space-y-3 text-xs font-mono">
                <p className="text-[10px] text-muted-foreground">
                  Set the token contract address and buy link. Changes appear on the main page in real time.
                </p>

                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] text-muted-foreground uppercase block mb-0.5">Token Address (CA)</label>
                    <div className="flex gap-1">
                      <input
                        value={tokenAddress}
                        onChange={(e) => setTokenAddress(e.target.value)}
                        placeholder="paste contract address..."
                        className="bevel-sunken bg-window-bg flex-1 px-2 py-1 text-xs font-mono outline-none"
                      />
                      <button
                        onClick={async () => {
                          await supabase.from("site_settings").update({ value: JSON.stringify(tokenAddress) }).eq("key", "token_address");
                          showStatus("token address saved");
                        }}
                        className="bevel-raised bg-secondary px-3 py-1 font-bold hover:bg-muted active:bevel-sunken"
                      >
                        Save
                      </button>
                      <button
                        onClick={async () => {
                          setTokenAddress("");
                          await supabase.from("site_settings").update({ value: JSON.stringify("") }).eq("key", "token_address");
                          showStatus("token address cleared");
                        }}
                        className="bevel-raised bg-secondary px-2 py-1 hover:bg-destructive hover:text-destructive-foreground active:bevel-sunken"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-muted-foreground uppercase block mb-0.5">Buy Link URL</label>
                    <div className="flex gap-1">
                      <input
                        value={buyLink}
                        onChange={(e) => setBuyLink(e.target.value)}
                        placeholder="https://..."
                        className="bevel-sunken bg-window-bg flex-1 px-2 py-1 text-xs font-mono outline-none"
                      />
                      <button
                        onClick={async () => {
                          await supabase.from("site_settings").update({ value: JSON.stringify(buyLink) }).eq("key", "buy_link");
                          showStatus("buy link saved");
                        }}
                        className="bevel-raised bg-secondary px-3 py-1 font-bold hover:bg-muted active:bevel-sunken"
                      >
                        Save
                      </button>
                      <button
                        onClick={async () => {
                          setBuyLink("");
                          await supabase.from("site_settings").update({ value: JSON.stringify("") }).eq("key", "buy_link");
                          showStatus("buy link cleared");
                        }}
                        className="bevel-raised bg-secondary px-2 py-1 hover:bg-destructive hover:text-destructive-foreground active:bevel-sunken"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-muted-foreground border-t border-border/30 pt-2">
                  tip: the token.dat window shows below overview.exe on the main page
                </div>
              </div>
            </RetroWindow>
          </>
        )}

        {/* SETTINGS TAB */}
        {activeTab === "settings" && (
          <>
            <RetroWindow title="Autonomous Mode" icon="⚙️">
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center gap-3">
                  <span>auto-post:</span>
                  <button
                    onClick={toggleAutonomous}
                    className={`bevel-raised px-3 py-0.5 font-bold ${autonomousEnabled ? "bg-terminal-text text-terminal-bg" : "bg-secondary"} hover:bg-muted active:bevel-sunken`}
                  >
                    {autonomousEnabled ? "ON" : "OFF"}
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <span>interval:</span>
                  <input
                    type="number"
                    value={interval}
                    onChange={(e) => updateInterval(Number(e.target.value))}
                    className="bevel-sunken bg-window-bg px-2 py-0.5 w-16 text-xs font-mono outline-none"
                    min={1}
                  />
                  <span>min</span>
                </div>
                <button
                  onClick={publishNext}
                  className="bevel-raised bg-secondary px-4 py-1 font-bold hover:bg-muted active:bevel-sunken"
                >
                  ▶ Publish Next Queued
                </button>
              </div>
            </RetroWindow>
          </>
        )}
      </div>

      <Taskbar />
    </div>
  );
};

export default Admin;

import { useState, useCallback } from "react";
import BootScreen from "@/components/desktop/BootScreen";
import MenuBar from "@/components/desktop/MenuBar";
import Taskbar from "@/components/desktop/Taskbar";
import DesktopIcon from "@/components/desktop/DesktopIcon";
import OverviewWindow from "@/components/windows/OverviewWindow";
import LiveFeedWindow from "@/components/windows/LiveFeedWindow";
import SightingsWindow from "@/components/windows/SightingsWindow";
import NotesWindow from "@/components/windows/NotesWindow";
import TerminalWindow from "@/components/windows/TerminalWindow";
import StatusWindow from "@/components/windows/StatusWindow";
import ArchiveWindow from "@/components/windows/ArchiveWindow";
import TokenWindow from "@/components/windows/TokenWindow";

export interface WindowDef {
  id: string;
  icon: string;
  label: string;
}

const windowDefs: WindowDef[] = [
  { id: "overview", icon: "⚙️", label: "overview.exe" },
  { id: "live_feed", icon: "🔩", label: "live_feed.log" },
  { id: "notes", icon: "🔧", label: "notes.txt" },
  { id: "sightings", icon: "🔭", label: "sightings.dat" },
  { id: "terminal", icon: "🛠️", label: "terminal.sys" },
  { id: "status", icon: "🔗", label: "status.sys" },
  { id: "archive", icon: "🗄️", label: "archive" },
];

const windowComponents: Record<string, React.ReactNode> = {
  overview: <OverviewWindow />,
  live_feed: <LiveFeedWindow />,
  notes: <NotesWindow />,
  sightings: <SightingsWindow />,
  terminal: <TerminalWindow />,
  status: <StatusWindow />,
  archive: <ArchiveWindow />,
};

// Layout presets: which windows to show together
const layouts: Record<string, string[]> = {
  overview: ["overview", "status"],
  live_feed: ["live_feed"],
  notes: ["notes"],
  sightings: ["sightings"],
  terminal: ["terminal"],
  status: ["status"],
  archive: ["archive"],
};

const Index = () => {
  const [booting, setBooting] = useState(true);
  const [spawned, setSpawned] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("overview");

  const handleIconClick = useCallback((id: string) => {
    setActiveTab(id);
  }, []);

  const closeWindow = useCallback((id: string) => {
    if (id === activeTab) {
      setActiveTab("overview");
    }
  }, [activeTab]);

  const visibleWindows = layouts[activeTab] || [activeTab];

  const renderWindowPanel = (id: string, fullWidth = false) => {
    const def = windowDefs.find((w) => w.id === id);
    if (!def) return null;

    return (
      <div
        key={id}
        className={`bevel-raised bg-secondary flex flex-col min-h-0 flex-1 ${fullWidth ? "col-span-full" : ""}`}
      >
        {/* Title bar */}
        <div className="titlebar-gradient flex items-center justify-between px-2 py-0.5 select-none cursor-default shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs">{def.icon}</span>
            <span className="text-xs font-bold text-window-titlebar-text tracking-wide">
              {def.label}
            </span>
          </div>
          <div className="flex gap-0.5">
            <button className="bevel-raised bg-secondary w-4 h-3.5 flex items-center justify-center text-[8px] font-bold leading-none hover:bg-muted active:bevel-sunken">
              _
            </button>
            <button className="bevel-raised bg-secondary w-4 h-3.5 flex items-center justify-center text-[8px] font-bold leading-none hover:bg-muted">
              □
            </button>
            <button
              onClick={() => closeWindow(id)}
              className="bevel-raised bg-secondary w-4 h-3.5 flex items-center justify-center text-[8px] font-bold leading-none hover:bg-destructive hover:text-destructive-foreground"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={`bevel-sunken bg-window-bg m-0.5 mb-0 flex-1 overflow-auto p-3 ${id === "sightings" ? "hide-scrollbar" : ""}`}>
          {windowComponents[id]}
        </div>

        {/* Bottom status bar */}
        <div className="bg-secondary px-2 py-[2px] m-0.5 mt-0 flex items-center justify-between text-[8px] text-muted-foreground font-mono select-none shrink-0">
          <span>{id === "terminal" ? "build 0.7.3-rc4 · sh:kernel" : id === "overview" ? "kernel v0.7.3 · monitoring" : id === "status" ? "diagnostics · auto-refresh" : id === "live_feed" ? "feed · streaming" : id === "notes" ? "notes.txt · saved" : id === "sightings" ? "sightings.dat · synced" : id === "archive" ? "archive · indexed" : ""}</span>
          <span>{id === "terminal" ? "pid:4093 · mem:847MB" : "ready"}</span>
        </div>
      </div>
    );
  };

  const spawnDelay = (ms: number) => ({
    opacity: !booting && spawned ? 1 : 0,
    transform: !booting && spawned ? "translateY(0)" : "translateY(8px)",
    transition: `opacity 0.5s ease ${ms}ms, transform 0.5s ease ${ms}ms`,
  });

  return (
    <>
      {booting && <BootScreen onComplete={() => { setBooting(false); setTimeout(() => setSpawned(true), 50); }} />}
    <div className={`h-screen flex flex-col overflow-hidden bg-desktop transition-opacity duration-500 ${
      !booting ? "opacity-100" : "opacity-0"
    }`}>
      <div className="crt-overlay" />

      <div style={spawnDelay(0)}>
        <MenuBar />
      </div>

      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Desktop icons sidebar */}
        <div className="w-[60px] flex flex-col gap-0.5 p-1 shrink-0 border-r border-border/30 overflow-hidden" style={spawnDelay(100)}>
          {windowDefs.map((item, i) => (
            <div key={item.id} style={spawnDelay(150 + i * 50)}>
              <DesktopIcon
                icon={item.icon}
                label={item.label}
                isActive={activeTab === item.id}
                onClick={() => handleIconClick(item.id)}
              />
            </div>
          ))}
        </div>

        {/* Main content area */}
        <div className="flex-1 overflow-hidden p-2" style={spawnDelay(200)}>
          {/* Single window views */}
          {visibleWindows.length === 1 && (
            <div className="h-full flex flex-col" style={spawnDelay(300)}>
              {renderWindowPanel(visibleWindows[0], true)}
            </div>
          )}

          {/* Two window layout (overview + status) */}
          {visibleWindows.length === 2 && (
            <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-2">
              <div className="lg:col-span-2 flex flex-col gap-2 min-h-0 overflow-hidden" style={spawnDelay(300)}>
                {renderWindowPanel(visibleWindows[0])}
                {/* Token window below overview */}
                {visibleWindows[0] === "overview" && (
                  <div className="bevel-raised bg-secondary flex flex-col shrink-0" style={spawnDelay(500)}>
                    <div className="titlebar-gradient flex items-center justify-between px-2 py-0.5 select-none cursor-default shrink-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs">⛓️</span>
                        <span className="text-xs font-bold text-window-titlebar-text tracking-wide">token.dat</span>
                      </div>
                      <div className="flex gap-0.5">
                        <button className="bevel-raised bg-secondary w-4 h-3.5 flex items-center justify-center text-[8px] font-bold leading-none hover:bg-muted">_</button>
                        <button className="bevel-raised bg-secondary w-4 h-3.5 flex items-center justify-center text-[8px] font-bold leading-none hover:bg-muted">□</button>
                        <button className="bevel-raised bg-secondary w-4 h-3.5 flex items-center justify-center text-[8px] font-bold leading-none hover:bg-muted">×</button>
                      </div>
                    </div>
                    <div className="bevel-sunken bg-window-bg m-0.5 p-2">
                      <TokenWindow />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-col overflow-hidden" style={spawnDelay(400)}>
                {renderWindowPanel(visibleWindows[1])}
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={spawnDelay(500)}>
        <Taskbar
          openWindows={[windowDefs.find((w) => w.id === activeTab)!].map((w) => ({
            id: w.id,
            label: w.label,
            icon: w.icon,
          }))}
          activeWindow={activeTab}
          minimizedWindows={[]}
          onTaskbarClick={handleIconClick}
        />
      </div>
    </div>
    </>
  );
};

export default Index;

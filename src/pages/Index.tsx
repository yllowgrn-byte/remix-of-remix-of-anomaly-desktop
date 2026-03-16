import { useState, useCallback } from "react";
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
  { id: "overview", icon: "📟", label: "overview.exe" },
  { id: "live_feed", icon: "📊", label: "live_feed.log" },
  { id: "notes", icon: "📝", label: "notes.txt" },
  { id: "sightings", icon: "🖼️", label: "sightings.dat" },
  { id: "terminal", icon: "⬛", label: "terminal.sys" },
  { id: "status", icon: "🔧", label: "status.sys" },
  { id: "archive", icon: "📁", label: "archive" },
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
        className={`bevel-raised bg-secondary flex flex-col min-h-0 ${fullWidth ? "col-span-full" : ""}`}
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
        <div className="bevel-sunken bg-window-bg m-0.5 flex-1 overflow-auto p-3">
          {windowComponents[id]}
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-desktop">
      <div className="crt-overlay" />


      <MenuBar />

      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Desktop icons sidebar */}
        <div className="w-[60px] flex flex-col gap-0.5 p-1 shrink-0 border-r border-border/30 overflow-hidden">
          {windowDefs.map((item) => (
            <DesktopIcon
              key={item.id}
              icon={item.icon}
              label={item.label}
              isActive={activeTab === item.id}
              onClick={() => handleIconClick(item.id)}
            />
          ))}
        </div>

        {/* Main content area */}
        <div className="flex-1 overflow-hidden p-2">
          {/* Single window views */}
          {visibleWindows.length === 1 && (
            <div className="h-full flex flex-col">
              {renderWindowPanel(visibleWindows[0], true)}
            </div>
          )}

          {/* Two window layout (overview + status) */}
          {visibleWindows.length === 2 && (
            <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-2">
              <div className="lg:col-span-2 flex flex-col gap-2 min-h-0 overflow-hidden">
                {renderWindowPanel(visibleWindows[0])}
                {/* Token window below overview */}
                {visibleWindows[0] === "overview" && (
                  <div className="bevel-raised bg-secondary flex flex-col flex-1">
                    <div className="titlebar-gradient flex items-center justify-between px-2 py-0.5 select-none cursor-default shrink-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs">💰</span>
                        <span className="text-xs font-bold text-window-titlebar-text tracking-wide">token.dat</span>
                      </div>
                      <div className="flex gap-0.5">
                        <button className="bevel-raised bg-secondary w-4 h-3.5 flex items-center justify-center text-[8px] font-bold leading-none hover:bg-muted">_</button>
                        <button className="bevel-raised bg-secondary w-4 h-3.5 flex items-center justify-center text-[8px] font-bold leading-none hover:bg-muted">□</button>
                        <button className="bevel-raised bg-secondary w-4 h-3.5 flex items-center justify-center text-[8px] font-bold leading-none hover:bg-muted">×</button>
                      </div>
                    </div>
                    <div className="bevel-sunken bg-window-bg m-0.5 p-3 flex-1 flex flex-col justify-center">
                      <TokenWindow />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-col overflow-hidden">
                {renderWindowPanel(visibleWindows[1])}
              </div>
            </div>
          )}
        </div>
      </div>

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
  );
};

export default Index;

import { useState, useEffect } from "react";
import { Cpu } from "lucide-react";

interface TaskbarWindow {
  id: string;
  label: string;
  icon: string;
}

interface TaskbarProps {
  openWindows?: TaskbarWindow[];
  activeWindow?: string;
  minimizedWindows?: string[];
  onTaskbarClick?: (id: string) => void;
}

const Taskbar = ({ openWindows = [], activeWindow, minimizedWindows = [], onTaskbarClick }: TaskbarProps) => {
  const [time, setTime] = useState(new Date());
  const [blinkOn, setBlinkOn] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    const blinker = setInterval(() => setBlinkOn((b) => !b), 1000);
    return () => {
      clearInterval(timer);
      clearInterval(blinker);
    };
  }, []);

  const timeStr = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const dateStr = time.toLocaleDateString([], { month: "2-digit", day: "2-digit", year: "2-digit" });

  return (
    <div className="bevel-raised bg-taskbar flex items-center justify-between px-1 py-0.5 select-none">
      <div className="flex items-center gap-1 flex-1 min-w-0">
        <button className="bevel-raised bg-secondary px-2.5 py-0.5 text-xs font-bold hover:bg-muted active:bevel-sunken shrink-0 flex items-center gap-1.5">
          <Cpu size={12} strokeWidth={2} className="text-primary" />
          <span>Start</span>
        </button>

        <div className="h-4 w-px bg-border mx-0.5 shrink-0" />


        <div className="flex gap-0.5 flex-1 min-w-0 overflow-hidden">
          {openWindows.map((win) => {
            const isActive = activeWindow === win.id && !minimizedWindows.includes(win.id);
            return (
              <button
                key={win.id}
                onClick={() => onTaskbarClick?.(win.id)}
                className={`flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] min-w-[90px] max-w-[160px] truncate transition-colors ${
                  isActive
                    ? "bevel-sunken bg-window-bg font-bold"
                    : "bevel-raised bg-secondary hover:bg-muted"
                }`}
              >
                <span className="text-xs shrink-0">{win.icon}</span>
                <span className="truncate">{win.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bevel-sunken flex items-center gap-2.5 px-2.5 py-0.5 shrink-0">
        <span className={`inline-block w-1.5 h-1.5 rounded-full transition-colors ${blinkOn ? "bg-primary" : "bg-muted"}`} />
        <div className="h-3 w-px bg-border/40" />
        <div className="flex flex-col items-end leading-none">
          <span className="text-[10px] text-foreground font-bold tabular-nums">{timeStr}</span>
          <span className="text-[8px] text-muted-foreground tabular-nums">{dateStr}</span>
        </div>
      </div>
    </div>
  );
};

export default Taskbar;

import { useState } from "react";

interface RetroWindowProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
  className?: string;
  defaultMinimized?: boolean;
  onClose?: () => void;
  statusBar?: string;
  maxHeight?: string;
}

const RetroWindow = ({
  title,
  icon,
  children,
  className = "",
  defaultMinimized = false,
  onClose,
  statusBar,
  maxHeight,
}: RetroWindowProps) => {
  const [minimized, setMinimized] = useState(defaultMinimized);

  return (
    <div className={`bevel-raised bg-secondary ${className}`}>
      {/* Title bar */}
      <div
        className="titlebar-gradient flex items-center justify-between px-1 py-0.5 select-none cursor-default"
        onDoubleClick={() => setMinimized(!minimized)}
      >
        <div className="flex items-center gap-1">
          {icon && <span className="text-xs">{icon}</span>}
          <span className="text-xs font-bold text-window-titlebar-text tracking-wide">
            {title}
          </span>
        </div>
        <div className="flex gap-0.5">
          <button
            onClick={() => setMinimized(!minimized)}
            className="bevel-raised bg-secondary w-4 h-3.5 flex items-center justify-center text-[8px] font-bold leading-none hover:bg-muted active:bevel-sunken"
          >
            _
          </button>
          <button className="bevel-raised bg-secondary w-4 h-3.5 flex items-center justify-center text-[8px] font-bold leading-none hover:bg-muted">
            □
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="bevel-raised bg-secondary w-4 h-3.5 flex items-center justify-center text-[8px] font-bold leading-none hover:bg-destructive hover:text-destructive-foreground"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {!minimized && (
        <>
          <div
            className="bevel-sunken bg-window-bg m-0.5 p-2 overflow-auto"
            style={maxHeight ? { maxHeight } : undefined}
          >
            {children}
          </div>
          {statusBar && (
            <div className="bevel-sunken mx-0.5 mb-0.5 px-2 py-0.5">
              <span className="text-[11px] text-muted-foreground">{statusBar}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RetroWindow;

import { Cpu, Signal } from "lucide-react";

const menuItems = ["File", "Edit", "View", "System", "Logs", "Help"];

const MenuBar = () => {
  return (
    <div className="bevel-raised bg-secondary flex items-center justify-between px-1 py-0.5 select-none relative z-50">
      <div className="flex items-center">
        <div className="flex items-center gap-1.5 px-2 mr-1">
          <Cpu size={14} strokeWidth={2} className="text-primary" />
          <span className="font-bold text-sm tracking-wider">Anomaly</span>
        </div>

        {menuItems.map((label) => (
          <button
            key={label}
            className="px-2.5 py-0.5 text-xs cursor-default hover:bg-primary/10 active:bg-primary active:text-primary-foreground"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <Signal size={10} strokeWidth={2} className="text-primary" />
          <span className="uppercase tracking-wider">online</span>
        </div>
        
        <a
          href="https://x.com/anomalytech_"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] px-1.5 font-bold text-foreground hover:text-primary transition-colors tracking-wide"
        >
          @anomalytech_
        </a>
      </div>
    </div>
  );
};

export default MenuBar;

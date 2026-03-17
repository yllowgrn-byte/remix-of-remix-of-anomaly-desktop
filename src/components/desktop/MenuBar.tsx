import { useState } from "react";
import { Cpu, Signal } from "lucide-react";

const menuItems = [
  { label: "File", items: ["New Session", "Export Logs", "─", "Exit"] },
  { label: "Edit", items: ["Copy Signal", "Clear Cache", "Preferences"] },
  { label: "View", items: ["Refresh", "Toggle CRT", "Zoom In", "Zoom Out"] },
  { label: "System", items: ["Diagnostics", "Reboot Core", "─", "About Kernel"] },
  { label: "Logs", items: ["View Recent", "Clear All", "Export"] },
  { label: "Help", items: ["Commands", "Documentation", "─", "About"] },
];

const MenuBar = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <div className="bevel-raised bg-secondary flex items-center justify-between px-1 py-0.5 select-none relative z-50">
      <div className="flex items-center">
        {/* Logo mark */}
        <div className="flex items-center gap-1.5 px-2 mr-1">
          <Cpu size={14} strokeWidth={2} className="text-primary" />
          <span className="font-bold text-sm tracking-wider">Kernel</span>
        </div>

        <div className="h-4 w-px bg-border mx-0.5" />

        {/* Menu items with dropdowns */}
        {menuItems.map((menu) => (
          <div key={menu.label} className="relative">
            <button
              onMouseEnter={() => openMenu && setOpenMenu(menu.label)}
              onClick={() => setOpenMenu(openMenu === menu.label ? null : menu.label)}
              className={`px-2.5 py-0.5 text-xs cursor-default transition-colors ${
                openMenu === menu.label
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-primary/10"
              }`}
            >
              {menu.label}
            </button>

            {openMenu === menu.label && (
              <div className="absolute top-full left-0 mt-px bevel-raised bg-secondary min-w-[160px] py-0.5 shadow-lg z-50">
                {menu.items.map((item, i) =>
                  item === "─" ? (
                    <div key={i} className="mx-2 my-0.5 border-t border-border" />
                  ) : (
                    <button
                      key={item}
                      onClick={() => setOpenMenu(null)}
                      className="w-full text-left px-4 py-1 text-xs hover:bg-primary hover:text-primary-foreground cursor-default flex items-center gap-2"
                    >
                      {item}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Right side: status + social */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <Signal size={10} strokeWidth={2} className="text-primary" />
          <span className="uppercase tracking-wider">online</span>
        </div>
        <div className="h-3 w-px bg-border" />
        <a
          href="https://x.com/agent_kernel"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] px-1.5 font-bold text-foreground hover:text-primary transition-colors tracking-wide"
        >
          @agent_kernel
        </a>
      </div>

      {/* Click-away overlay */}
      {openMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setOpenMenu(null)} />
      )}
    </div>
  );
};

export default MenuBar;

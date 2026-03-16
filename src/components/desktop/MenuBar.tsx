const menuItems = ["File", "Edit", "View", "System", "Logs", "Help"];

const MenuBar = () => {
  return (
    <div className="bevel-raised bg-secondary flex items-center justify-between px-1 py-0.5 select-none">
      <div className="flex items-center">
        <span className="font-bold text-sm px-2 tracking-wider">Anomaly</span>
        <div className="h-4 w-px bg-border mx-1" />
        {menuItems.map((item) => (
          <button
            key={item}
            className="px-2 py-0.5 text-xs hover:bg-primary hover:text-primary-foreground cursor-default"
          >
            {item}
          </button>
        ))}
      </div>
      <a
        href="https://x.com/anomalytechh"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs px-2 font-bold text-foreground hover:underline"
      >
        @anomalytechh
      </a>
    </div>
  );
};

export default MenuBar;

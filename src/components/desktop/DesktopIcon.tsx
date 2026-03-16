interface DesktopIconProps {
  icon: string;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

const DesktopIcon = ({ icon, label, isActive, onClick }: DesktopIconProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 p-2 cursor-default select-none w-16 ${
        isActive ? "bg-primary/30" : "hover:bg-primary/20"
      }`}
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-[10px] text-foreground text-center leading-tight break-words">
        {label}
      </span>
    </button>
  );
};

export default DesktopIcon;

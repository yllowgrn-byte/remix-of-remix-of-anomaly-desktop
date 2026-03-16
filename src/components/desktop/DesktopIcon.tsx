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
      className={`flex flex-col items-center gap-0.5 p-1.5 cursor-default select-none w-full max-w-[64px] ${
        isActive ? "bg-primary/30" : "hover:bg-primary/20"
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-[9px] text-foreground text-center leading-tight break-all line-clamp-2">
        {label}
      </span>
    </button>
  );
};

export default DesktopIcon;

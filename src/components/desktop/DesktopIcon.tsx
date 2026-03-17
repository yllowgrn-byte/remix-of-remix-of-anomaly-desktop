import { type LucideIcon } from "lucide-react";

interface DesktopIconProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

const DesktopIcon = ({ icon: Icon, label, isActive, onClick }: DesktopIconProps) => {
  return (
    <button
      onClick={onClick}
      className={`group flex flex-col items-center gap-0.5 p-1.5 cursor-default select-none w-full max-w-[64px] transition-colors ${
        isActive
          ? "bg-primary/25 bevel-sunken"
          : "hover:bg-primary/10"
      }`}
    >
      <Icon
        size={18}
        strokeWidth={1.5}
        className={`transition-transform ${isActive ? "scale-110 text-primary" : "text-foreground group-hover:scale-105"}`}
      />
      <span className={`text-[9px] text-center leading-tight break-all line-clamp-2 transition-colors ${
        isActive ? "text-primary font-bold" : "text-foreground"
      }`}>
        {label}
      </span>
      {isActive && (
        <div className="w-3 h-px bg-primary mt-0.5" />
      )}
    </button>
  );
};

export default DesktopIcon;

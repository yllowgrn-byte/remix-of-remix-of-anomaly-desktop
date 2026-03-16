import anomalyImage from "@/assets/anomaly-ghost.jpg";

const SightingsWindow = () => {
  return (
    <div className="space-y-4">
      {/* Image viewer toolbar */}
      <div className="flex items-center gap-2 border-b border-border/40 pb-2">
        <span className="text-[10px] text-muted-foreground">📎 anomaly_presence.jpg</span>
        <span className="flex-1" />
        <span className="text-[10px] text-muted-foreground">1 file(s)</span>
      </div>

      {/* Main image */}
      <div className="bevel-sunken bg-terminal-bg p-2 flex items-center justify-center">
        <img
          src={anomalyImage}
          alt="Anomaly presence"
          className="max-h-[350px] w-auto object-contain"
          style={{ imageRendering: "auto" }}
        />
      </div>

      {/* File metadata */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] font-mono">
        <div className="flex gap-2">
          <span className="text-muted-foreground">filename:</span>
          <span className="text-foreground">anomaly_presence.jpg</span>
        </div>
        <div className="flex gap-2">
          <span className="text-muted-foreground">format:</span>
          <span className="text-foreground">JPEG</span>
        </div>
        <div className="flex gap-2">
          <span className="text-muted-foreground">last seen:</span>
          <span className="text-terminal-text">just now, probably</span>
        </div>
        <div className="flex gap-2">
          <span className="text-muted-foreground">confidence:</span>
          <span className="text-amber-status">high</span>
        </div>
      </div>

      <div className="border-t border-border/30 pt-2">
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          <span className="text-amber-status font-bold">NOTE:</span> keeps showing up in the same place. 
          same shape. same stare. same nothing expression. we stopped trying to enhance the image. 
          it looks exactly the same every time.
        </p>
      </div>
    </div>
  );
};

export default SightingsWindow;

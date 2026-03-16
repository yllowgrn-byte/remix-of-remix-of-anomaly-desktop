import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Copy, ExternalLink } from "lucide-react";

const TokenWindow = () => {
  const [tokenAddress, setTokenAddress] = useState("");
  const [buyLink, setBuyLink] = useState("");
  const [copied, setCopied] = useState(false);

  const fetchTokenData = async () => {
    const { data } = await supabase
      .from("site_settings")
      .select("*")
      .in("key", ["token_address", "buy_link"]);
    if (data) {
      data.forEach((s) => {
        if (s.key === "token_address") setTokenAddress(String(s.value || ""));
        if (s.key === "buy_link") setBuyLink(String(s.value || ""));
      });
    }
  };

  useEffect(() => {
    fetchTokenData();

    const channel = supabase
      .channel("token-settings")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_settings" },
        () => fetchTokenData()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleCopy = async () => {
    if (!tokenAddress) return;
    await navigator.clipboard.writeText(tokenAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="font-mono flex flex-col gap-2">
      {/* Token address */}
      <div className="flex items-center gap-1">
        <span className="text-[9px] text-muted-foreground uppercase shrink-0">CA:</span>
        <div
          onClick={handleCopy}
          className={`bevel-sunken bg-terminal-bg flex-1 px-2 py-1 text-[10px] text-terminal-text truncate cursor-pointer hover:bg-terminal-bg/80 transition-colors ${!tokenAddress ? 'text-muted-foreground italic' : ''}`}
          title={tokenAddress || "No address set"}
        >
          {tokenAddress || "—"}
        </div>
        <button
          onClick={handleCopy}
          disabled={!tokenAddress}
          className="bevel-raised bg-secondary px-1.5 py-1 text-[9px] hover:bg-muted active:bevel-sunken disabled:opacity-40 disabled:cursor-default flex items-center gap-0.5"
        >
          <Copy size={10} />
          {copied ? "OK" : "COPY"}
        </button>
      </div>

      {/* Buy link */}
      <div className="flex items-center gap-1">
        <span className="text-[9px] text-muted-foreground uppercase shrink-0">BUY:</span>
        {buyLink ? (
          <a
            href={buyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bevel-raised bg-accent text-accent-foreground flex-1 px-2 py-1 text-[10px] font-bold text-center hover:opacity-90 active:bevel-sunken flex items-center justify-center gap-1"
          >
            <ExternalLink size={10} />
            BUY NOW
          </a>
        ) : (
          <div className="bevel-sunken bg-terminal-bg flex-1 px-2 py-1 text-[10px] text-muted-foreground italic">
            —
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenWindow;

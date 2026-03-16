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
        if (s.key === "token_address") setTokenAddress(String(s.value || "").replace(/^"|"$/g, ""));
        if (s.key === "buy_link") setBuyLink(String(s.value || "").replace(/^"|"$/g, ""));
      });
    }
  };

  useEffect(() => {
    fetchTokenData();
    const channel = supabase
      .channel("token-settings")
      .on("postgres_changes", { event: "*", schema: "public", table: "site_settings" }, () => fetchTokenData())
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
    <div className="font-mono text-[10px] space-y-1.5">
      {/* CA row */}
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground uppercase w-7 shrink-0 text-right">CA</span>
        <div
          onClick={handleCopy}
          className={`bevel-sunken bg-terminal-bg flex-1 px-2 py-0.5 text-terminal-text truncate ${tokenAddress ? "cursor-pointer hover:brightness-125" : "text-muted-foreground italic"}`}
          title={tokenAddress || "not set"}
        >
          {tokenAddress || "not set"}
        </div>
        <button
          onClick={handleCopy}
          disabled={!tokenAddress}
          className="bevel-raised bg-secondary px-2 py-0.5 text-[9px] font-bold hover:bg-muted active:bevel-sunken disabled:opacity-30 flex items-center gap-1 shrink-0"
        >
          <Copy size={8} />
          {copied ? "OK!" : "COPY"}
        </button>
      </div>

      {/* Buy row */}
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground uppercase w-7 shrink-0 text-right">BUY</span>
        {buyLink ? (
          <a
            href={buyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bevel-raised bg-accent text-accent-foreground flex-1 px-2 py-0.5 font-bold text-center hover:opacity-90 active:bevel-sunken flex items-center justify-center gap-1"
          >
            <ExternalLink size={9} />
            BUY NOW
          </a>
        ) : (
          <div className="bevel-sunken bg-terminal-bg flex-1 px-2 py-0.5 text-muted-foreground italic">
            not set
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenWindow;

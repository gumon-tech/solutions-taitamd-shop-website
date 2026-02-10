"use client";

import { useEffect, useMemo, useState } from "react";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Facebook, Link2, Send, Twitter } from "lucide-react";

type Props = {
  className?: string;
  title?: string;
  text?: string;
  url?: string;
  compact?: boolean;
};

function enc(s: string) {
  return encodeURIComponent(s);
}

export default function SocialShareBar({
  className,
  title = SITE.name,
  text = SITE.description,
  url,
  compact = false
}: Props) {
  const [currentUrl, setCurrentUrl] = useState(url || "");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!url && typeof window !== "undefined") setCurrentUrl(window.location.href);
  }, [url]);

  const links = useMemo(() => {
    const u = enc(currentUrl || SITE.baseUrl);
    const t = enc(title);
    const msg = enc(text);

    return {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
      x: `https://twitter.com/intent/tweet?url=${u}&text=${t}%20—%20${msg}`,
      whatsapp: `https://wa.me/?text=${t}%20—%20${msg}%20${u}`
    };
  }, [currentUrl, title, text]);

  async function onShareNative() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const nav: any = navigator;
      if (nav?.share) {
        await nav.share({ title, text, url: currentUrl });
      } else {
        window.open(links.facebook, "_blank", "noopener,noreferrer");
      }
    } catch {}
  }

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch {}
  }

  const btn =
    "inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/5 hover:bg-white/10 transition px-3 py-2 text-xs font-semibold";

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <button onClick={onShareNative} className={btn} title="Share">
        <Send className="h-4 w-4 text-gold" />
        {!compact && "Share"}
      </button>

      <a className={btn} href={links.facebook} target="_blank" rel="noreferrer" title="Share on Facebook">
        <Facebook className="h-4 w-4 text-gold" />
        {!compact && "Facebook"}
      </a>

      <a className={btn} href={links.x} target="_blank" rel="noreferrer" title="Share on X">
        <Twitter className="h-4 w-4 text-gold" />
        {!compact && "X"}
      </a>

      <a className={btn} href={links.whatsapp} target="_blank" rel="noreferrer" title="Share on WhatsApp">
        <span className="inline-flex h-4 w-4 items-center justify-center text-gold">✦</span>
        {!compact && "WhatsApp"}
      </a>

      <button onClick={onCopy} className={btn} title="Copy link">
        <Link2 className="h-4 w-4 text-gold" />
        {copied ? "Copied" : !compact ? "Copy" : ""}
      </button>
    </div>
  );
}

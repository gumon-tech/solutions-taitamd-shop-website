"use client";

import { useEffect, useMemo, useState } from "react";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Facebook, Link2, Send, Share2, Twitter } from "lucide-react";

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
  compact = false,
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
      facebookShare: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
      x: `https://twitter.com/intent/tweet?url=${u}&text=${t}%20—%20${msg}`,
      whatsappShare: `https://wa.me/?text=${t}%20—%20${msg}%20${u}`,
    };
  }, [currentUrl, title, text]);

  async function onShareNative() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const nav: any = navigator;
      if (nav?.share) {
        await nav.share({ title, text, url: currentUrl });
        return;
      }
    } catch {
      // ignore
    }
    // fallback
    window.open(links.facebookShare, "_blank", "noopener,noreferrer");
  }

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 900);
    } catch {
      // ignore
    }
  }

  const btnBase =
    "inline-flex items-center justify-center rounded-xl border border-ink/12 bg-ink/5 hover:bg-ink/8 transition font-semibold";
  const btn = compact
    ? cn(btnBase, "h-10 w-10")
    : cn(btnBase, "gap-2 px-3 py-2 text-xs");

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <button type="button" className={btn} onClick={onShareNative} title="Share">
        <Share2 className="h-4 w-4 text-gold" />
        {!compact && <span>Share</span>}
      </button>

      <button type="button" className={btn} onClick={onCopy} title="Copy link">
        <Link2 className="h-4 w-4 text-gold" />
        {!compact && <span>{copied ? "Copied" : "Copy"}</span>}
      </button>

      <a className={btn} href={links.whatsappShare} target="_blank" rel="noreferrer" title="Share on WhatsApp">
        <Send className="h-4 w-4 text-gold" />
        {!compact && <span>WhatsApp</span>}
      </a>

      <a className={btn} href={links.x} target="_blank" rel="noreferrer" title="Share on X">
        <Twitter className="h-4 w-4 text-gold" />
        {!compact && <span>X</span>}
      </a>

      <a className={btn} href={links.facebookShare} target="_blank" rel="noreferrer" title="Share on Facebook">
        <Facebook className="h-4 w-4 text-gold" />
        {!compact && <span>Facebook</span>}
      </a>
    </div>
  );
}

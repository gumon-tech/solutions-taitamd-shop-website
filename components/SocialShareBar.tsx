"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

function safeBaseUrl() {
  // prefer explicit baseUrl, then site url, then window origin
  if (SITE.baseUrl) return SITE.baseUrl;
  if (SITE.url) return SITE.url;
  if (typeof window !== "undefined") return window.location.origin;
  return "https://example.com";
}

async function copyToClipboard(text: string) {
  // modern
  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  // legacy fallback
  const el = document.createElement("textarea");
  el.value = text;
  el.setAttribute("readonly", "");
  el.style.position = "fixed";
  el.style.left = "-9999px";
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
}

export default function SocialShareBar({
  className,
  title = SITE.name,
  text = SITE.description,
  url,
  compact = false,
}: Props) {
  const [currentUrl, setCurrentUrl] = useState(url ?? "");
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (url) {
      setCurrentUrl(url);
      return;
    }
    if (typeof window !== "undefined") setCurrentUrl(window.location.href);
  }, [url]);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const shareUrl = currentUrl || url || safeBaseUrl();

  const links = useMemo(() => {
    const u = enc(shareUrl);
    const t = enc(title);
    const msg = enc(text);

    return {
      facebookShare: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
      x: `https://twitter.com/intent/tweet?url=${u}&text=${t}%20—%20${msg}`,
      whatsappShare: `https://wa.me/?text=${t}%20—%20${msg}%20${u}`,
    };
  }, [shareUrl, title, text]);

  async function onShareNative() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const nav: any = navigator;
      if (nav?.share) {
        await nav.share({ title, text, url: shareUrl });
        return;
      }
    } catch {
      // ignore
    }
    window.open(links.facebookShare, "_blank", "noopener,noreferrer");
  }

  async function onCopy() {
    try {
      await copyToClipboard(shareUrl);
      setCopied(true);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopied(false), 900);
    } catch {
      // ignore
    }
  }

  const btnBase =
    "inline-flex items-center justify-center rounded-xl border border-ink/12 bg-ink/5 hover:bg-ink/8 transition font-semibold";
  const btn = compact ? cn(btnBase, "h-10 w-10") : cn(btnBase, "gap-2 px-3 py-2 text-xs");

  const iconCls = compact ? "h-5 w-5 text-gold" : "h-4 w-4 text-gold";

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <button type="button" className={btn} onClick={onShareNative} title="Share">
        <Share2 className={iconCls} />
        {!compact && <span>Share</span>}
      </button>

      <button type="button" className={btn} onClick={onCopy} title="Copy link">
        <Link2 className={iconCls} />
        {!compact && <span>{copied ? "Copied" : "Copy"}</span>}
      </button>

      <a className={btn} href={links.whatsappShare} target="_blank" rel="noreferrer" title="Share on WhatsApp">
        <Send className={iconCls} />
        {!compact && <span>WhatsApp</span>}
      </a>

      <a className={btn} href={links.x} target="_blank" rel="noreferrer" title="Share on X">
        <Twitter className={iconCls} />
        {!compact && <span>X</span>}
      </a>

      <a className={btn} href={links.facebookShare} target="_blank" rel="noreferrer" title="Share on Facebook">
        <Facebook className={iconCls} />
        {!compact && <span>Facebook</span>}
      </a>
    </div>
  );
}

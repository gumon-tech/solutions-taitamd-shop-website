// Ad click code ("option B" of the full-loop design, Appendix A), adapted from the Sri Siam site
// (solution-sst-website lib/clickref.ts). On a visit that landed from a Google ad with gclid, gbraid
// or wbraid, and only while the visitor has accepted on the cookie banner, every WhatsApp chat link
// ends [web-AD-<code>] instead of [web-AD]; a WhatsApp press posts the code and Google's click
// reference to this shop's own bot, which uses them to report bookings from the ad to Google Ads;
// and components/Analytics.tsx sends the same code to Google as the conversion's transaction_id.
//
// Loaded only by components/AdSource.tsx, only on an ad visit, and only while lib/site.ts
// googleAds.clickRef.endpoint is set: with it empty, no code exists anywhere (Lead's ruling,
// matching Sri Siam), so the code, the POST and transaction_id switch on together.
//
// Rules this file enforces:
// - No code is shown and nothing is sent unless consent holds (the stored choice is Accept, read
//   fresh through lib/consent.ts under the key for the current banner wording) and the landing
//   address carried a click reference matching [A-Za-z0-9_-]{20,256}.
// - The click reference and the code live only in this module's memory: no cookie, no web storage.
// - Reject or withdrawal: the code is dropped, every link goes back to [web-AD] at once, nothing
//   more is sent.
// - [web-CR] (job application) links are never touched (lib/whatsapp.ts adTagApplies).
// - At most one POST per code per page load, on a WhatsApp press, to the one configured endpoint.
//   It never delays, blocks or waits for anything, and the response is not read.

import { CONSENT_CHANGE_EVENT, CONSENT_STORAGE_KEY, readChoice } from "@/lib/consent";
import { CLICK_ID_KINDS, landingUrl } from "@/lib/landing";
import { CLICK_CODE_ALPHABET, adTagApplies, chatLinkWithTag, readChatLinkTag } from "@/lib/whatsapp";

export interface ClickRefConfig {
  /** This shop's own bot route (lib/site.ts googleAds.clickRef.endpoint). */
  endpoint: string;
  /** This shop's id, equal to the bot's SHOP_ID: sent as "site" and mixed into the code. */
  site: string;
  /** Version of the cookie banner wording the visitor accepted (lib/site.ts googleAds.consentVersion). */
  cv: string;
  /** The tag every chat link gets on an ad visit ("AD"). */
  adTag: string;
}

const CODE_LENGTH = 8;
const CLICK_ID = /^[A-Za-z0-9_-]{20,256}$/;
const SURFACE = /^[A-Z]{1,2}$/;
const MAX_BODY_BYTES = 768;
type Kind = (typeof CLICK_ID_KINDS)[number];
/**
 * What Accept grants for advertising user data (lib/consent.ts GRANTED: measurement only, no
 * remarketing). Sent with each click reference so the bot can pass it on with the upload.
 */
const CONSENT = { ad_user_data: "granted", ad_personalization: "denied" } as const;

/**
 * The code for one ad click: SHA-256 of "clickref-v1|<site>|<kind>|<id>" (UTF-8); character i
 * (0..7) is CLICK_CODE_ALPHABET[digest byte i mod 27]. Same click, same code, in every tab and on
 * every press. The bot recomputes it and drops a record that does not match.
 */
export async function deriveCode(site: string, kind: string, id: string): Promise<string> {
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`clickref-v1|${site}|${kind}|${id}`)));
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) code += CLICK_CODE_ALPHABET[digest[i] % CLICK_CODE_ALPHABET.length];
  return code;
}

/** Consent holds while the stored choice is Accept: the same test Analytics.tsx uses to load the tag. Read fresh. */
function consented(): boolean {
  return readChoice() === "granted";
}

let cfg: ClickRefConfig | null = null;
/** The click reference of this visit; undefined until read, null if there is none (or it is not valid). */
let click: { kind: Kind; id: string } | null | undefined;
/** Set only while consent holds and the code is ready. */
let code: string | null = null;
/** Codes already posted in this page load. */
const sent = new Set<string>();

function readClick(): { kind: Kind; id: string } | null {
  if (click !== undefined) return click;
  click = null;
  try {
    const p = new URL(landingUrl()).searchParams;
    for (const kind of CLICK_ID_KINDS) {
      const id = p.get(kind);
      if (id === null) continue;
      if (CLICK_ID.test(id)) click = { kind, id };
      break;
    }
  } catch {
    // no readable landing address: no click reference
  }
  return click;
}

function setCode(next: string | null): void {
  if (next === code) return;
  code = next;
  retagAll();
}

/** On start and on every consent change: code on while consent holds, off at once otherwise. */
function update(): void {
  const c = readClick();
  if (!cfg || !c || !consented()) {
    setCode(null);
    return;
  }
  if (code) return;
  deriveCode(cfg.site, c.kind, c.id)
    .then((v) => {
      if (consented()) setCode(v);
    })
    .catch(() => {
      // no Web Crypto (not a secure context): the links stay [web-AD] and nothing is sent
    });
}

/** [web-X], [web-AD] or [web-AD-<old code>] -> [web-AD-<code>] while consent holds, [web-AD] otherwise. */
function retag(a: HTMLAnchorElement): void {
  if (!cfg) return;
  const t = readChatLinkTag(a.href);
  if (!t || !adTagApplies(t, window.location.pathname)) return;
  // The link's own tag, sent as "surface" (AdSource records it too). A visible tag other than the
  // ad tag is always the link's own, so it wins over anything recorded before.
  if (t.tag !== cfg.adTag) a.dataset.waTag = t.tag;
  const want = code ? `${cfg.adTag}-${code}` : cfg.adTag;
  const have = t.code ? `${t.tag}-${t.code}` : t.tag;
  if (want === have) return;
  a.href = chatLinkWithTag(t, want);
}

function retagAll(): void {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="https://wa.me/"]').forEach(retag);
}

/** Epoch ms of this visit's first page load (in-site page changes keep the document, so this does not move). */
function landedAt(): number {
  const t = typeof performance !== "undefined" ? performance.timeOrigin : NaN;
  return Number.isFinite(t) ? Math.round(t) : Date.now();
}

/** A press on a chat link whose message carries the current code: one POST per code per page load. */
function send(a: HTMLAnchorElement): void {
  const c = click;
  const k = code;
  if (!cfg || !cfg.endpoint || !c || !k || sent.has(k) || !consented()) return;
  const t = readChatLinkTag(a.href);
  if (!t || t.tag !== cfg.adTag || t.code !== k) return;
  // Unknown surface: send nothing rather than a guess.
  const surface = a.dataset.waTag ?? "";
  if (!SURFACE.test(surface)) return;
  const body = JSON.stringify({ v: 1, site: cfg.site, code: k, kind: c.kind, id: c.id, surface, landed: landedAt(), consent: CONSENT, cv: cfg.cv });
  if (new TextEncoder().encode(body).length > MAX_BODY_BYTES) return;
  sent.add(k);
  try {
    // text/plain keeps it a simple request (no preflight); keepalive lets it finish after the jump to WhatsApp.
    void fetch(cfg.endpoint, { method: "POST", keepalive: true, credentials: "omit", headers: { "Content-Type": "text/plain" }, body }).catch(() => {});
  } catch {
    // never let this get in the way of the click
  }
}

// Capture phase, registered after AdSource's own listener, so it sees the [web-AD] rewrite and adds
// the code before the browser follows the link. Links that appear later (menus, dialogs) are caught here.
function onActivateCapture(e: Event): void {
  const a = (e.target as Element | null)?.closest?.("a");
  if (a instanceof HTMLAnchorElement) retag(a);
}

// Bubble phase, after every rewrite: reads the tag actually sent. Never prevents or delays the navigation.
function onPress(e: MouseEvent): void {
  if (e.type === "auxclick" && e.button !== 1) return;
  const a = (e.target as Element | null)?.closest?.("a");
  if (a instanceof HTMLAnchorElement) send(a);
}

// A choice in this page (lib/consent.ts writeChoice) fires CONSENT_CHANGE_EVENT; one made in another
// tab arrives as a storage event.
function onStorage(e: StorageEvent): void {
  if (e.key === CONSENT_STORAGE_KEY || e.key === null) update();
}

/**
 * Called by AdSource on every page of an ad visit, after its own [web-AD] rewrite. The first call
 * starts the listeners (only if the endpoint is set and the visit has a valid click reference);
 * every call rewrites the links on the page.
 */
export function startClickRef(config: ClickRefConfig): void {
  if (!cfg) {
    if (!config.endpoint || !config.site || !config.cv || !readClick()) return;
    cfg = config;
    document.addEventListener("click", onActivateCapture, true);
    document.addEventListener("auxclick", onActivateCapture, true);
    document.addEventListener("contextmenu", onActivateCapture, true);
    document.addEventListener("click", onPress);
    document.addEventListener("auxclick", onPress);
    window.addEventListener(CONSENT_CHANGE_EVENT, update);
    window.addEventListener("storage", onStorage);
    update();
  }
  retagAll();
}

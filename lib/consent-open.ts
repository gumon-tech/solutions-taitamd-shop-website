// Lets a "Cookie settings" control (footer, /privacy, /cookies) reopen the cookie banner in place,
// without a reload. A click made before the banner has mounted is kept and served when it does.
// Copied from the Sri Siam site (solution-sst-website lib/consent-open.ts).
type Open = (opener: HTMLElement | null) => void;

let handler: Open | null = null;
let pending: { opener: HTMLElement | null } | null = null;

export function openCookieSettings(opener: HTMLElement | null): void {
  if (handler) handler(opener);
  else pending = { opener };
}

/** The banner registers here; a request made before that is delivered now. Returns the unregister function. */
export function onOpenCookieSettings(fn: Open): () => void {
  handler = fn;
  if (pending) {
    const p = pending;
    pending = null;
    fn(p.opener);
  }
  return () => {
    if (handler === fn) handler = null;
  };
}

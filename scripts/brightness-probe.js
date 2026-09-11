/**
 * Average painted brightness of a page, 0 (black) to 100 (white).
 *
 * Why this file exists rather than an eyeball: every colour round on this site has been two
 * people trading the words "too dark" and "brighter now" with no number between them
 * (Q-SHOP-033, standing rule T11). A number only settles an argument if both sides compute it
 * the same way, so the code lives in the repo and is pasted verbatim each time rather than
 * rewritten from memory.
 *
 * How it measures. It lays a coarse grid over the whole page and stamps every element that
 * paints a surface into the cells it covers, in document order, so a later element covers an
 * earlier one the way paint does:
 *   - an <img> stamps the mean luminance of its own pixels, read through a canvas (our images
 *     are same-origin, so they are readable)
 *   - any element with an opaque background stamps that colour
 * Relative luminance is the sRGB formula, the same one contrast ratios use.
 *
 * It reads geometry only — no scrolling, no elementFromPoint. The first version scrolled the
 * page and sampled points, and it never finished: the automation pane keeps the tab hidden,
 * which throttles requestAnimationFrame and scroll settling. Geometry does not care whether
 * anyone is looking.
 *
 * What it does NOT capture: text colour, borders, shadows, and the fixed gradient painted
 * behind the page by .bg-wrap::before, which lives on a pseudo-element and has no node to
 * read. Treat the output as "brightness of the surfaces the layout declares" — comparable
 * between two runs of the same page, not a photometer.
 *
 * Usage: paste into the browser console on the page under test, at a stated viewport width.
 *   await measureBrightness()   →   { brightness, lightShare, lightCells, cells, ... }
 *
 * `lightShare` is the percentage of page area brighter than 50, which answers "is there
 * enough light on this page" more directly than the mean does. Read it next to `lightCells`,
 * the absolute count: a page that gets taller dilutes the share without losing any light, and
 * the share alone reads that as a regression.
 */
async function measureBrightness(cols = 60) {
  // Force every lazy image to load before measuring. Without this the probe silently reads a
  // page with most of its pictures absent and reports it darker than it is — which is exactly
  // what happened to the first phase-1 numbers (10.5 instead of 12.0). The comparison was
  // still like-for-like, so the conclusion held, but the absolute figures were wrong, and
  // these figures are quoted across tickets.
  const imgs = [...document.querySelectorAll("img")];
  imgs.forEach((i) => {
    i.loading = "eager";
  });
  await Promise.all(
    imgs.map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; }))),
  );
  await new Promise((r) => setTimeout(r, 600));

  const lum = (r, g, b) => {
    const f = (c) => {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    return (0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)) * 100;
  };

  const imgCache = new Map();
  const imgLum = (img) => {
    const key = img.currentSrc || img.src;
    if (imgCache.has(key)) return imgCache.get(key);
    let v = null;
    try {
      const c = document.createElement("canvas");
      c.width = 24;
      c.height = 24;
      const ctx = c.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(img, 0, 0, 24, 24);
      const d = ctx.getImageData(0, 0, 24, 24).data;
      let sum = 0;
      let n = 0;
      for (let i = 0; i < d.length; i += 4) {
        if (d[i + 3] > 128) {
          sum += lum(d[i], d[i + 1], d[i + 2]);
          n++;
        }
      }
      v = n ? sum / n : null;
    } catch {
      v = null; // tainted canvas means a cross-origin image: unknown, never guessed.
    }
    imgCache.set(key, v);
    return v;
  };

  const W = document.documentElement.clientWidth;
  const H = document.body.scrollHeight;
  const cell = W / cols;
  const rows = Math.ceil(H / cell);
  const grid = new Float32Array(cols * rows);

  const body = getComputedStyle(document.body).backgroundColor.match(/\d+/g);
  grid.fill(body ? lum(+body[0], +body[1], +body[2]) : 0);

  const stamp = (r, value) => {
    if (value === null || !isFinite(value)) return;
    const x0 = Math.max(0, Math.floor(r.left / cell));
    const x1 = Math.min(cols, Math.ceil(r.right / cell));
    const y0 = Math.max(0, Math.floor((r.top + window.scrollY) / cell));
    const y1 = Math.min(rows, Math.ceil((r.bottom + window.scrollY) / cell));
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) grid[y * cols + x] = value;
  };

  for (const el of document.querySelectorAll("body *")) {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || +cs.opacity < 0.5) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) continue;
    if (el.tagName === "IMG") {
      stamp(r, imgLum(el));
      continue;
    }
    const m = cs.backgroundColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (m && (m[4] === undefined || parseFloat(m[4]) > 0.6)) stamp(r, lum(+m[1], +m[2], +m[3]));
  }

  let sum = 0;
  let light = 0;
  for (const v of grid) {
    sum += v;
    if (v > 50) light++;
  }
  // lightCells is reported alongside lightShare on purpose. A page that grows taller dilutes
  // the share while losing no light at all, and reading the share alone turns that into a
  // false alarm — it did once, on phase 2, before the absolute count settled it.
  return {
    brightness: Math.round((sum / grid.length) * 10) / 10,
    lightShare: Math.round((light / grid.length) * 1000) / 10,
    lightCells: light,
    cells: grid.length,
    viewport: `${W}x${window.innerHeight}`,
    pageHeight: H,
  };
}

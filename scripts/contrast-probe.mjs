// Text contrast measured from the pixels that actually paint, not from the CSS that ought to.
//
// Why it is pixels and not computed style: the three failures this file was written to catch
// were all invisible to a stylesheet reading. Gold on cream looked like a brand colour pair
// until someone divided them; a label over a photograph has no background colour at all in
// CSS, only whatever the picture happens to be that day. Standing rule T11 settles colour
// arguments with numbers, and a number is only worth having if it came from the render.
//
// Method, per text element:
//   - screenshot the viewport it sits in, at a stated width
//   - take the pixels inside its rect
//   - the background is the modal colour of that rect (the surface the glyphs sit on)
//   - the text is the pixel furthest from that background in luminance (the glyph core; the
//     pixels between the two are antialiasing and are meant to be ignored)
//   - ratio is the sRGB formula, the same one the WCAG threshold is written against
// Large text (>=24px, or >=18.66px when semibold or heavier) is held to 3.0, everything
// else to 4.5, which is AA.
//
// It sweeps the whole page one screenful at a time rather than one section, because the
// failures found on 2026-09-11 were all outside the area being worked on: a gate that looks
// only where the change is will keep reporting green while the page is not.
//
// Usage, with the dev server already up (preview_start, never a raw shell spawn):
//   node scripts/contrast-probe.mjs <url> <width> <height>
//   node scripts/contrast-probe.mjs http://localhost:3300/ 1440 900
import { spawn } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [, , url = "http://localhost:3300/", wArg = "1440", hArg = "900"] = process.argv;
const width = +wArg;
const height = +hArg;
const PORT = 9333 + (process.pid % 400);
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const profile = mkdtempSync(join(tmpdir(), "contrast-"));
const chrome = spawn(CHROME, [
  "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
  `--user-data-dir=${profile}`, `--remote-debugging-port=${PORT}`,
  `--window-size=${width},${height}`,
], { stdio: "ignore" });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let target;
for (let i = 0; i < 60; i++) {
  await sleep(500);
  try {
    const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
    target = list.find((t) => t.type === "page");
    if (target) break;
  } catch {}
}
if (!target) { chrome.kill(); throw new Error("no devtools target"); }

const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0;
const pending = new Map();
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); }
};
const send = (method, params = {}) =>
  new Promise((r) => { const n = ++id; pending.set(n, r); ws.send(JSON.stringify({ id: n, method, params })); });

const evaluate = async (expression) => {
  const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (r?.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails).slice(0, 400));
  return r?.result?.value;
};

await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width < 768 });
await send("Page.navigate", { url });
await sleep(6000);

// Same preamble as the screenshot script: decline consent (the bar is fixed over the bottom of
// every viewport and is not under test), then scroll the page once so framer-motion's
// whileInView sections are actually painted before anything is measured.
const pageHeight = await evaluate(`(async () => {
  // Stop the reveal animation dead before anything is measured.
  //
  // framer-motion starts every section at opacity 0 with a 10px blur and animates it in when
  // the section scrolls into view. In an automation tab that never happens reliably: the tab is
  // hidden, requestAnimationFrame is throttled, and sections stay half-drawn indefinitely. A
  // blurred glyph samples back as the colour of whatever is behind it, so the first run of this
  // probe reported 72 failures on a page that has nothing like that many — every one of them an
  // artefact of the measuring, which is the most expensive kind of wrong number a gate can
  // produce, because it looks exactly like work to do.
  //
  // Setting the styles element by element does not hold: framer-motion owns those inline styles
  // and rewrites them on the next frame. A stylesheet rule marked !important outranks an inline
  // style and keeps outranking it, however many times the library writes.
  //
  // Only inline opacity/filter/transform are overridden, which on this site is framer-motion and
  // nothing else. Opacity declared in CSS is left alone — that is a design decision, and its
  // effect on contrast is real and belongs in the measurement.
  const kill = document.createElement("style");
  kill.textContent = '[style*="opacity"],[style*="filter"],[style*="transform"]{opacity:1!important;filter:none!important;transform:none!important}*{animation:none!important;transition:none!important}';
  document.head.appendChild(kill);
  const btn = [...document.querySelectorAll("button")].find((b) => /decline/i.test(b.textContent));
  if (btn) btn.click();
  document.querySelectorAll("img").forEach((i) => { i.loading = "eager"; });
  const H = document.body.scrollHeight;
  for (let y = 0; y < H; y += 300) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
  await Promise.all([...document.querySelectorAll("img")].map((i) => i.complete ? null : new Promise(r => { i.onload = i.onerror = r; })));
  window.scrollTo(0, 0);
  await new Promise(r => setTimeout(r, 1200));
  return document.body.scrollHeight;
})()`);

// Collect every element that paints text of its own, once, with a stable index so the
// per-screenful passes can refer to the same node.
await evaluate(`(() => {
  const out = [];
  for (const el of document.querySelectorAll("body *")) {
    if (el.closest("[data-contrast-skip]")) continue;
    const direct = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(" ").trim();
    if (!direct) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none" || +cs.opacity === 0) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) continue;
    const size = parseFloat(cs.fontSize);
    const weight = +cs.fontWeight || 400;
    out.push({ el, text: direct.slice(0, 48), size, weight, large: size >= 24 || (size >= 18.66 && weight >= 600) });
  }
  window.__contrastNodes = out;
  return out.length;
})()`);

// One sampler, used by both passes, so a number cannot depend on which pass happened to reach
// the element. `requireFit` is on for the screenful sweep and off for the per-element pass,
// where the element has just been scrolled to the middle of the screen on purpose.
await evaluate(`(() => {
  const srgb = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const lum = (p) => 0.2126 * srgb(p[0]) + 0.7152 * srgb(p[1]) + 0.0722 * srgb(p[2]);
  const hex = (p) => "#" + [0,1,2].map(i => p[i].toString(16).padStart(2, "0")).join("");
  window.__contrastSample = (img, n, bandTop) => {
    if (n.done) return null;
    const r = n.el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) return null;
    // Absolute page coordinates, then the element's position inside this band's image. Whole
    // element or nothing: a sliver of a card is its padding, not its text.
    const absTop = r.top + window.scrollY;
    const absLeft = r.left + window.scrollX;
    const y = Math.round(absTop - bandTop);
    const x = Math.round(absLeft);
    const w = Math.round(r.width);
    const h = Math.round(r.height);
    if (y < 0 || y + h > img.height || x < 0 || x + w > img.width) return null;
    if (w < 4 || h < 4) return null;
    const c = document.createElement("canvas");
    c.width = img.width; c.height = img.height;
    const ctx = c.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const d = ctx.getImageData(x, y, w, h).data;
    const counts = new Map();
    const pixels = [];
    for (let i = 0; i < d.length; i += 4) {
      const p = [d[i], d[i+1], d[i+2]];
      pixels.push(p);
      const k = hex(p);
      counts.set(k, (counts.get(k) || 0) + 1);
    }
    let bgHex = null, best = -1;
    for (const [k, v] of counts) if (v > best) { best = v; bgHex = k; }
    const bg = [1,3,5].map(i => parseInt(bgHex.slice(i, i+2), 16));
    const bgL = lum(bg);
    // The glyph core is the pixel furthest from the surface it sits on. Everything between is
    // antialiasing, which is not what the eye resolves the letterform from.
    let fg = bg, spread = 0;
    for (const p of pixels) { const dd = Math.abs(lum(p) - bgL); if (dd > spread) { spread = dd; fg = p; } }
    const fgL = lum(fg);
    const [hi, lo] = fgL > bgL ? [fgL, bgL] : [bgL, fgL];
    const ratio = (hi + 0.05) / (lo + 0.05);
    n.done = true;
    return { text: n.text, size: n.size, weight: n.weight, large: n.large,
             fg: hex(fg), bg: bgHex, ratio: Math.round(ratio * 100) / 100,
             need: n.large ? 3 : 4.5 };
  };
  return 1;
})()`);

// Nothing below is scrolled. An earlier version walked the page a screenful at a time, and the
// numbers it produced were quietly wrong: window.scrollTo updates layout at once, so
// getBoundingClientRect immediately reports the new position, but in a throttled headless tab
// the compositor had often not repainted when the shutter fired. The rects and the pixels then
// described two different scroll positions, and the sampler dutifully read whatever was at
// those coordinates — colours that appear nowhere in the palette, ratios compressed toward 1,
// and a clean card reported at 1.78 when it is 7.17 by construction.
//
// Page.captureScreenshot takes a clip in absolute page coordinates, so the page can stay where
// it is and each band is captured directly. No scroll, no race, and rects stay valid because
// scrollY never changes.
const results = [];
const pageWidth = await evaluate(`document.documentElement.scrollWidth`);
for (let band = 0; band < pageHeight; band += height) {
  const { data } = await send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
    clip: { x: 0, y: band, width: Math.min(width, pageWidth), height, scale: 1 },
  });
  const batch = await evaluate(`(async () => {
    const img = new Image();
    img.src = "data:image/png;base64," + ${JSON.stringify(data)};
    await img.decode();
    const out = [];
    for (const n of window.__contrastNodes) {
      const r = window.__contrastSample(img, n, ${band});
      if (r) out.push(r);
    }
    return out;
  })()`);
  results.push(...batch);
}

ws.close();
chrome.kill();

// MATCH=<regex> also prints the elements it names whether they pass or fail, so a fix can be
// reported as the number it now is rather than as an absence from the failure list.
const match = process.env.MATCH ? new RegExp(process.env.MATCH, "i") : null;
if (match) {
  console.log(`matched by MATCH=${process.env.MATCH}:`);
  for (const r of results.filter((r) => match.test(r.text))) {
    console.log(`  ${String(r.ratio).padStart(5)} (needs ${r.need})  ${r.fg} on ${r.bg}  ${Math.round(r.size)}px/${r.weight}  ${JSON.stringify(r.text)}`);
  }
}

const fails = results.filter((r) => r.ratio < r.need && r.ratio > 1.02);
console.log(`contrast-probe ${url} ${width}x${height} — ${results.length} text elements, ${fails.length} below AA`);
for (const f of fails.sort((a, b) => a.ratio - b.ratio)) {
  console.log(`  ${String(f.ratio).padStart(5)} < ${f.need}  ${f.fg} on ${f.bg}  ${Math.round(f.size)}px/${f.weight}  ${JSON.stringify(f.text)}`);
}
process.exit(fails.length ? 1 : 0);

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
// CHROME_PATH so this runs on a CI runner as well as on the machine it was written on.
const CHROME = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const profile = mkdtempSync(join(tmpdir(), "contrast-"));
const chrome = spawn(CHROME, [
  "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run", "--no-sandbox",
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
  // The control swatch. #6d5223 on #fffdf8 is 7.17 by the WCAG formula, worked out by hand, and
  // this probe has to come back with 7.17 before any other number it prints can be believed.
  // Four earlier versions of this file each returned a tidy, plausible, wrong list of failures;
  // none of them announced itself as broken. A value whose answer is known in advance is the
  // only thing that told them apart. Required every run by the ruling on Q-SHOP-033.
  const ctl = document.createElement("div");
  ctl.id = "__contrast_control";
  ctl.textContent = "contrast control swatch";
  ctl.setAttribute("style", "position:relative;z-index:2147483647;background:#fffdf8;color:#6d5223;font-size:14px;font-weight:600;padding:10px;width:200px;margin:0");
  // At the very end of the document, where it covers nothing. Put at the top it sat under the
  // floating navbar, which is translucent, and the swatch then measured 5.60 against a greenish
  // grey that is not its background — the control catching its own placement. Raised above
  // everything as well, so no later overlay can repeat that.
  document.body.appendChild(ctl);

  // The second control, on a gradient, required by WS after the first one failed to catch the
  // bug that mattered. The flat swatch above only ever exercised the path the probe already got
  // right; the failure that reached a ruling happened on .glass, where no background colour
  // repeats often enough to be a mode. A control proves the path it walks and nothing else.
  //
  // Its value is still computable by hand. The background runs #0a2e22 to #4c7a4e down the box,
  // luminance is monotonic along that, so the median-luminance pixel is the midpoint colour —
  // #2b5438, each channel the mean of the two ends. #f2f4e8 on #2b5438 is 7.78.
  //
  // The padding is 44px and not 10px for a reason worth keeping. The glyphs are far brighter
  // than any of the background, so they all sort to the top, and every glyph pixel pushes the
  // median one place further up into the lighter half of the gradient. At 10px padding the text
  // was about a tenth of the box and the median landed on #335d3d instead of #2b5438 — a real
  // 0.97 of contrast, enough to read as a broken control. Drowning the text in background puts
  // the median back within a shade of the midpoint.
  const ctl2 = document.createElement("div");
  ctl2.id = "__contrast_control_gradient";
  ctl2.textContent = "contrast control gradient";
  ctl2.setAttribute("style", "position:relative;z-index:2147483647;background:linear-gradient(to bottom,#0a2e22,#4c7a4e);color:#f2f4e8;font-size:14px;font-weight:600;padding:44px 10px;width:200px;margin:0");
  document.body.appendChild(ctl2);
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

    // Background from the pixels, foreground from CSS — each from the source that actually
    // knows it.
    //
    // The background has to be measured, because that is the whole point: a label on a
    // photograph, or on .glass (two translucent gradients over the page), has no background
    // colour in the stylesheet at all. The median luminance is the background — glyphs are a
    // minority of any text element's area, so the middle pixel is the surface under them.
    //
    // The foreground must NOT be measured, and the earlier version of this that took the
    // most extreme pixel was wrong in a way that invented work. On a heading like
    //   Professional massage training — <span class="text-gold">high-quality…</span>
    // sitting on .glass, no single background colour repeats often enough to be the mode,
    // because the gradient is smooth — but the gold span's glyph cores are all exactly
    // #c8b07c. So the mode came back gold, the extreme came back white, and the probe
    // reported white-on-gold at 1.90: two foreground colours compared with each other, on an
    // element where nothing is wrong. It got as far as a WS ruling to change a colour that
    // did not need changing.
    const lums = [];
    for (let i = 0; i < d.length; i += 4) lums.push({ l: lum([d[i], d[i+1], d[i+2]]), p: [d[i], d[i+1], d[i+2]] });
    lums.sort((a, b) => a.l - b.l);
    const bg = lums[Math.floor(lums.length / 2)].p;
    const bgL = lum(bg);
    const bgHex = hex(bg);

    // Text colour as declared, composited over the surface just measured when it is not
    // opaque — half this site's body text is ink at 82%, and what reaches the eye is the blend.
    const css = getComputedStyle(n.el).color;
    // Backslashes are doubled on purpose: this whole block is inside a template literal, so
    // one backslash is eaten before the page ever sees the regex. /\s/ arrived as /s/ and
    // matched the letter s; /\// arrived as // and commented out the rest of the line.
    const m = css.match(/rgba?\\(([^)]+)\\)/);
    if (!m) return null;
    // Both spellings: "rgb(109, 82, 35)" and the space-separated "rgb(109 82 35 / 0.82)".
    // Chrome returns either depending on how the value was authored, and splitting only on
    // commas turned the second form into one number and three NaNs — which arrived here as a
    // null ratio and took the control down with it.
    const parts = m[1].split(/[\\s,\\/]+/).filter(Boolean).map((v) => parseFloat(v));
    if (parts.length < 3 || parts.slice(0, 3).some((v) => !Number.isFinite(v))) return null;
    const alpha = parts.length > 3 && Number.isFinite(parts[3]) ? parts[3] : 1;
    const fg = [0, 1, 2].map((i) => Math.round(parts[i] * alpha + bg[i] * (1 - alpha)));
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
// Band tops, with a final band anchored to the bottom of the page rather than running off it.
// A clip that extends past the end of the document comes back as a short image, and anything
// sitting in that overhang reads as never measured — which is how the control swatch, the one
// element whose answer is known, disappeared from its own run.
const bands = [];
for (let b = 0; b < pageHeight; b += height) bands.push(b);
const lastBand = Math.max(0, pageHeight - height);
if (!bands.includes(lastBand)) bands.push(lastBand);
for (const band of bands) {
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

// Two controls, both computable by hand, one flat and one on a gradient. Either being wrong
// voids the whole run (WS, Q-SHOP-033, 2026-09-12): a probe off by an unknown amount does not
// produce slightly wrong findings, it produces a list that looks exactly like work to do.
const CONTROLS = [
  { text: "contrast control swatch", expected: 7.17, what: "#6d5223 on #fffdf8, flat", tol: 0.05 },
  // 7.78 is the hand-computed value and also a ceiling the measurement approaches from below,
  // never above. Every glyph pixel is brighter than all of the background, so glyphs sort to the
  // top and each one pushes the median one place further into the lighter half of the gradient —
  // a lighter background reads as less contrast. The bias only has one direction, so the band is
  // one-sided in practice; 0.45 covers the text this swatch carries.
  //
  // The tolerance is not what gives this control its teeth. `within` does: the background it
  // measures has to be a colour that is actually in the gradient. The bug this exists to catch
  // reported a glyph colour as the background and came out at 1.90 against a true 6.49, and no
  // tolerance on a ratio distinguishes that from an honest near miss — a range check does.
  { text: "contrast control gradient", expected: 7.78, what: "#f2f4e8 on #2b5438, gradient midpoint", tol: 0.45,
    within: ["#0a2e22", "#4c7a4e"] },
];
const srgbOf = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
const lumHex = (h) => {
  const p = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  return 0.2126 * srgbOf(p[0]) + 0.7152 * srgbOf(p[1]) + 0.0722 * srgbOf(p[2]);
};
const controlTexts = new Set(CONTROLS.map((c) => c.text));
const pageResults = results.filter((r) => !controlTexts.has(r.text));

let controlsOk = true;
for (const c of CONTROLS) {
  const hit = results.find((r) => r.text === c.text);
  if (!hit) {
    console.log(`control "${c.what}" was never measured — this run proves nothing.`);
    controlsOk = false;
    continue;
  }
  c.got = hit.ratio;
  let ok = Math.abs(hit.ratio - c.expected) <= c.tol;
  if (ok && c.within) {
    const l = lumHex(hit.bg);
    const [lo, hi] = c.within.map(lumHex).sort((a, b) => a - b);
    if (l < lo || l > hi) {
      ok = false;
      console.log(`control "${c.what}" measured ${hit.bg} as the background, which is not a colour in the gradient — the probe is reading something other than the surface.`);
    }
  }
  if (!ok) controlsOk = false;
  if (!process.env.JSON) {
    console.log(`control  ${c.what} — expected ${c.expected}, got ${hit.ratio.toFixed(2)} (measured ${hit.fg} on ${hit.bg})  ${ok ? "ok" : "MISMATCH"}`);
  }
}
if (!controlsOk) {
  console.log("a control is off, so every other number this run produced is off too. Not reporting them.");
  process.exit(2);
}
const control = { ratio: CONTROLS[0].got };

// MATCH=<regex> also prints the elements it names whether they pass or fail, so a fix can be
// reported as the number it now is rather than as an absence from the failure list.
const match = process.env.MATCH ? new RegExp(process.env.MATCH, "i") : null;
if (match) {
  console.log(`matched by MATCH=${process.env.MATCH}:`);
  for (const r of pageResults.filter((r) => match.test(r.text))) {
    console.log(`  ${String(r.ratio).padStart(5)} (needs ${r.need})  ${r.fg} on ${r.bg}  ${Math.round(r.size)}px/${r.weight}  ${JSON.stringify(r.text)}`);
  }
}

const fails = pageResults.filter((r) => r.ratio < r.need && r.ratio > 1.02);
if (process.env.JSON) {
  console.log(JSON.stringify({
    url, width, height, controls: CONTROLS.map((c) => ({ what: c.what, expected: c.expected, got: c.got })),
    elements: pageResults.length,
    fails: fails.map((f) => ({ text: f.text, ratio: f.ratio, need: f.need, fg: f.fg, bg: f.bg })),
  }));
  process.exit(0);
}

console.log(`contrast-probe ${url} ${width}x${height} — ${pageResults.length} text elements, ${fails.length} below AA`);
for (const f of fails.sort((a, b) => a.ratio - b.ratio)) {
  console.log(`  ${String(f.ratio).padStart(5)} < ${f.need}  ${f.fg} on ${f.bg}  ${Math.round(f.size)}px/${f.weight}  ${JSON.stringify(f.text)}`);
}
process.exit(fails.length ? 1 : 0);

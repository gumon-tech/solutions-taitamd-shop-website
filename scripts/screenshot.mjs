// Region screenshots of the running dev server, for the before/after pairs the design work owes.
//
// Two earlier attempts produced unusable pairs, both for the same underlying reason: this page
// reveals its sections with framer-motion `whileInView`, so anything captured without the page
// having actually been scrolled comes out half-drawn.
//   1. plain `chrome --screenshot` caught sections mid-transition, differently each run
//   2. `captureBeyondViewport` re-laid the page out at full height, which put every section
//      back at its initial opacity except the one that happened to be in view — a 11,452px
//      image of empty green with one band of content in it
// So: keep a normal-sized viewport, scroll the whole page once to fire every reveal, come back
// to the section we want to show, and capture the viewport the ordinary way.
//
// Usage, with the dev server already up on 3300 (preview_start, never a raw shell spawn):
//   node scripts/screenshot.mjs <out.png> <width> <height> "<heading text to scroll to>"
//   node scripts/screenshot.mjs shot.png 1440 900 ""            # top of the page
//   node scripts/screenshot.mjs shot.png 375 812 "These are our" # that section
import { spawn } from "node:child_process";
import { sweepStaleChrome } from "./chrome-orphans.mjs";
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [, , out, wArg, hArg, anchor, url = "http://localhost:3300/"] = process.argv;
const width = +wArg;
const height = +hArg;
const PORT = 9333 + (process.pid % 400);
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

sweepStaleChrome();
const profile = mkdtempSync(join(tmpdir(), "cap-"));
const chrome = spawn(CHROME, [
  "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
  `--user-data-dir=${profile}`, `--remote-debugging-port=${PORT}`,
  `--window-size=${width},${height}`,
], { stdio: "ignore", detached: true });

// Take the browser down with us, however we go.
//
// These scripts spawned Chrome and killed it on the happy path only. Two runs were cancelled
// mid-flight on 2026-09-12 — one by a tool timeout, one deliberately — and because a killed
// node process never reaches its last line, both left a Chrome behind. They were found 7 hours
// 45 minutes and 1 hour 24 minutes later, each with a GPU helper pinned at about 90% of a core,
// on a machine several other rooms were working on. Chrome is spawned into its own process
// group and the whole group is signalled, because the parent alone ignored SIGTERM while its
// helper kept spinning.
let chromeDown = false;
const stopChrome = () => {
  if (chromeDown) return;
  chromeDown = true;
  try { process.kill(-chrome.pid, "SIGKILL"); } catch {}
  try { chrome.kill("SIGKILL"); } catch {}
};
process.on("exit", stopChrome);
for (const sig of ["SIGINT", "SIGTERM", "SIGHUP"]) {
  process.on(sig, () => { stopChrome(); process.exit(130); });
}
process.on("uncaughtException", (e) => { stopChrome(); console.error(e); process.exit(1); });
process.on("unhandledRejection", (e) => { stopChrome(); console.error(e); process.exit(1); });


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

await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width, height, deviceScaleFactor: 1, mobile: width < 768,
});
await send("Page.navigate", { url });
await sleep(6000);

// The consent bar is fixed to the bottom of every screenshot and is not what these pairs are
// about. Declining is the choice we would make anyway, and it is the same on both sides.
await send("Runtime.evaluate", {
  awaitPromise: true,
  expression: `(async () => {
    const btn = [...document.querySelectorAll("button")].find((b) => /decline/i.test(b.textContent));
    if (btn) btn.click();
    document.querySelectorAll("img").forEach((i) => { i.loading = "eager"; });
    const H = document.body.scrollHeight;
    for (let y = 0; y < H; y += 300) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 80)); }
    await Promise.all([...document.querySelectorAll("img")].map((i) => i.complete ? null : new Promise(r => { i.onload = i.onerror = r; })));
    const el = ${JSON.stringify(anchor)} ? [...document.querySelectorAll("h2,h1")].find(h => h.textContent.includes(${JSON.stringify(anchor)})) : null;
    const y = el ? Math.max(0, el.getBoundingClientRect().top + window.scrollY - 90) : 0;
    window.scrollTo(0, y);
    await new Promise(r => setTimeout(r, 2500));
    return String(y);
  })()`,
});

const { data } = await send("Page.captureScreenshot", { format: "png" });
writeFileSync(out, Buffer.from(data, "base64"));
console.log(out, `${width}x${height}`);
ws.close();
chrome.kill();
process.exit(0);

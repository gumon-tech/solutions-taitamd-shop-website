// Runs scripts/brightness-probe.js against a URL and prints the numbers T11 is written against.
//
// The probe itself is a console snippet on purpose — it is pasted verbatim into a browser when
// someone wants to check a page by hand, and keeping it that way is what stops two people
// computing "brightness" two different ways. This file is the other half: the same snippet,
// driven headlessly, so a gate can run it without a person.
//
// Usage:  node scripts/brightness-run.mjs <url> <width> <height>
// CHROME_PATH overrides the browser binary, which is how this runs on a CI runner.
import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [, , url, wArg = "1440", hArg = "900"] = process.argv;
const width = +wArg;
const height = +hArg;
const CHROME = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

// Chrome picks the port, we read it back. A fixed port derived from the pid collided as soon as
// the visual gate started running four of these at once: two ranges overlapped, and pid modulo a
// constant repeats. Port 0 makes Chrome bind whatever is free and write it to DevToolsActivePort
// in its own profile directory, which cannot collide with anything.
const readPort = async (profileDir) => {
  const f = join(profileDir, "DevToolsActivePort");
  for (let i = 0; i < 120; i++) {
    try {
      const txt = readFileSync(f, "utf8").trim().split("\n")[0];
      if (txt) return +txt;
    } catch {}
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error("Chrome never reported a debugging port");
};

const profile = mkdtempSync(join(tmpdir(), "bright-"));
const chrome = spawn(CHROME, [
  "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run", "--no-sandbox",
  `--user-data-dir=${profile}`, "--remote-debugging-port=0",
  `--window-size=${width},${height}`,
], { stdio: "ignore" });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let target;
const PORT = await readPort(profile);
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
await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width < 768 });
await send("Page.navigate", { url });
await sleep(7000);

await send("Runtime.evaluate", { expression: readFileSync("scripts/brightness-probe.js", "utf8") });

// Decline consent before measuring. The sheet is opaque and pinned over the bottom of the
// viewport, so leaving it up paints a dark rectangle into the very number being measured, and
// it would be there on one side of a comparison and not the other depending on timing.
await send("Runtime.evaluate", {
  awaitPromise: true,
  expression: `(async () => {
    const b = [...document.querySelectorAll("button")].find((b) => /decline/i.test(b.textContent));
    if (b) b.click();
    await new Promise((r) => setTimeout(r, 300));
  })()`,
});

const r = await send("Runtime.evaluate", {
  awaitPromise: true,
  returnByValue: true,
  expression: `(async () => {
    const m = await measureBrightness();
    return { brightness: m.brightness, lightShare: m.lightShare, lightCells: m.lightCells,
             cells: m.cells, height: document.body.scrollHeight };
  })()`,
});

console.log(JSON.stringify({ url, width, height, ...r.result.value }));
ws.close();
chrome.kill();
process.exit(0);

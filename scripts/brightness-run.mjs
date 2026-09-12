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
import { sweepStaleChrome } from "./chrome-orphans.mjs";
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

sweepStaleChrome();
const profile = mkdtempSync(join(tmpdir(), "bright-"));
const chrome = spawn(CHROME, [
  "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run", "--no-sandbox",
  `--user-data-dir=${profile}`, "--remote-debugging-port=0",
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

// A ceiling on the whole run.
//
// OFFICE traced a probe that had been alive for 7 hours 45 minutes with nobody waiting for its
// answer. Cleaning up orphans covers the case where the parent dies; it does nothing for this
// one, where the parent is alive and blocked forever on a reply that never comes — every CDP
// call here parks a promise in a map, and a promise nobody resolves waits as long as the machine
// does. A probe that cannot finish should fail loudly in minutes, not idle for a working day.
const WATCHDOG_MS = Number(process.env.PROBE_TIMEOUT_MS ?? 240000);
const watchdog = setTimeout(() => {
  console.error(`probe gave up after ${Math.round(WATCHDOG_MS / 1000)}s: ${process.argv.slice(2).join(" ")}`);
  stopChrome();
  process.exit(3);
}, WATCHDOG_MS);
watchdog.unref();



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
// Each call gets its own deadline too, so a single wedged command names itself in the error
// instead of being swallowed by the overall ceiling.
const CALL_TIMEOUT_MS = 120000;
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const n = ++id;
    const timer = setTimeout(() => {
      pending.delete(n);
      reject(new Error(`CDP call timed out after ${CALL_TIMEOUT_MS / 1000}s: ${method}`));
    }, CALL_TIMEOUT_MS);
    pending.set(n, (result) => { clearTimeout(timer); resolve(result); });
    ws.send(JSON.stringify({ id: n, method, params }));
  });

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

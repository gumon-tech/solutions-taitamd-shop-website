// Clear headless browsers left behind by a previous run.
//
// The signal handlers in each probe cover the polite exits. They cannot cover SIGKILL, and
// SIGKILL is exactly what a tool timeout sends — which is how two Chromes were left running on
// this machine for 7 hours 45 minutes and 1 hour 24 minutes on 2026-09-12, each with a GPU
// helper pinned near a full core, while other rooms were working on the same laptop.
//
// So every probe sweeps before it starts. A process only qualifies if all three hold:
//   - it is --headless=new, so no window anyone is looking at can match
//   - its profile lives in a temp directory under one of our own prefixes
//   - it is older than STALE_MINUTES
// The age test is what makes this safe to call from the parallel gate: siblings started moments
// ago are never old enough to qualify, and a genuine orphan always is.
import { execFileSync } from "node:child_process";

// CHROME_SWEEP_MINUTES lowers the threshold so the matcher can be tested without waiting ten
// minutes for something to become stale. Nothing sets it in normal use.
const STALE_MINUTES = Number(process.env.CHROME_SWEEP_MINUTES ?? 10);
const PREFIXES = ["contrast-", "bright-", "cap-", "lum-", "diag-", "bright-fix-"];

const ageMinutes = (etime) => {
  // [[dd-]hh:]mm:ss
  const [days, rest] = etime.includes("-") ? etime.split("-") : ["0", etime];
  const parts = rest.split(":").map(Number);
  const [h, m, s] = parts.length === 3 ? parts : [0, parts[0], parts[1]];
  return +days * 1440 + h * 60 + m + s / 60;
};

export function sweepStaleChrome({ quiet = true } = {}) {
  let out = "";
  try {
    out = execFileSync("ps", ["-Ao", "pid=,etime=,args="], { encoding: "utf8", maxBuffer: 8 * 1024 * 1024 });
  } catch {
    return 0;
  }
  let killed = 0;
  for (const line of out.split("\n")) {
    const m = line.match(/^\s*(\d+)\s+(\S+)\s+(.*)$/);
    if (!m) continue;
    const [, pid, etime, args] = m;
    if (!args.includes("--headless=new")) continue;
    if (!PREFIXES.some((p) => args.includes(`user-data-dir=`) && args.includes(p))) continue;
    if (ageMinutes(etime) < STALE_MINUTES) continue;
    try { process.kill(-Number(pid), "SIGKILL"); } catch {}
    try { process.kill(Number(pid), "SIGKILL"); } catch {}
    killed++;
    if (!quiet) console.log(`swept stale headless chrome pid ${pid}, ${etime} old`);
  }
  return killed;
}

// `node scripts/chrome-orphans.mjs` runs the sweep on its own and says what it did.
if (import.meta.url === `file://${process.argv[1]}`) {
  const n = sweepStaleChrome({ quiet: false });
  console.log(n ? `swept ${n}` : "nothing stale to sweep");
}

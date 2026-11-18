import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import "@/lib/services";
import "@/lib/photos";
import { contentImages } from "@/lib/content-check";

// Server only (imported by app/layout.tsx). Every picture a data/*.json file names must exist
// in public/, and where the file sets a weight limit must not exceed it, or the build stops —
// a card pointing at a missing file would ship a broken image to the page most visitors land
// on, and images are served raw, so a heavy one goes to every visitor as it is. Importing the
// validators above registers their images.
for (const { file, where, path, maxBytes } of contentImages) {
  const full = join(process.cwd(), "public", path);
  if (!existsSync(full)) throw new Error(`data/${file}: ${where}: image ${path} is not in public/`);
  const size = statSync(full).size;
  if (maxBytes !== undefined && size > maxBytes) {
    throw new Error(`data/${file}: ${where}: image ${path} is ${Math.round(size / 1024)} KB; the limit is ${Math.round(maxBytes / 1024)} KB`);
  }
}

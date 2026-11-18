import { existsSync } from "node:fs";
import { join } from "node:path";
import "@/lib/services";
import { contentImages } from "@/lib/content-check";

// Server only (imported by app/layout.tsx). Every picture a data/*.json file names must exist
// in public/, or the build stops — a card pointing at a missing file would ship a broken image
// to the page most visitors land on. Importing the validators above registers their images.
for (const { file, where, path } of contentImages) {
  if (!existsSync(join(process.cwd(), "public", path))) {
    throw new Error(`data/${file}: ${where}: image ${path} is not in public/`);
  }
}

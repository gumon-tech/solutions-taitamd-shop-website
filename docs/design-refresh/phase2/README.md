# Phase 2 — paired screenshots, 1440 and 375

Evidence for `Q-SHOP-033`. WS's condition for opening phase 3 was a before/after pair at both
widths, not an opinion, so these are the pictures the argument rests on.

| file | what it shows |
|---|---|
| `1440-before-hero.jpg` · `1440-after-hero.jpg` | the hero card. The photograph was there before and almost nobody could see it: `opacity: 0.78` under a green wash at `rgba(15,51,20,0.62)`. After: no opacity, wash `0.34`. |
| `1440-before-services.jpg` · `1440-after-services.jpg` | the answer to the owner's sentence. Before: six text cards with bullet glyphs. After: the same six categories as pictures. |
| `1440-after-rooms.jpg` | `RoomBand`, new in phase 2 — three real photographs of the shop. No "before": the section did not exist. |
| `375-*` | the same two pairs on a phone. |

**Both sides are the same machine, the same dev server, the same script.** Before is commit
`17623f5`, after is `a169305`; the only difference between the two runs is which commit was
checked out.

## How they were captured, and two ways that failed first

`scripts/screenshot.mjs`, through the DevTools protocol. The page reveals its sections with
framer-motion `whileInView`, which defeats the obvious methods:

1. `chrome --headless --screenshot` caught sections mid-transition, and caught *different*
   sections each run — two runs of the same commit did not match each other, let alone the
   other commit.
2. `Page.captureScreenshot` with `captureBeyondViewport` re-laid the page out at full height,
   which returned every section to its initial opacity except the one that happened to be in
   view. The result was an 11,452 px image of empty green with one band of content in it.

So the script keeps an ordinary viewport, scrolls the whole page once to fire every reveal,
forces the lazy images, scrolls back to the section being shown, and captures the viewport the
ordinary way.

*A screenshot of a page that animates is a measurement with a shutter speed, and the first two
methods were photographing the shutter.*

# Phase 3 — paired screenshots

Evidence for `Q-SHOP-033` phase 3. Captured with `scripts/screenshot.mjs`; the method and the
two ways of capturing that failed first are written up in `../phase2/README.md`.

## 3.3 — the opacity classes that were never generated

| file | what it shows |
|---|---|
| `1440-before-sweep-cards.jpg` · `1440-after-sweep-cards.jpg` | the six "why us" cards. Before: a crisp light-gray border. After: the border the design asked for, and a faint light fill. |
| `375-before-sweep-cards.jpg` · `375-after-sweep-cards.jpg` | the same on a phone. |

The gray in the "before" is `rgb(229,231,235)` — Tailwind preflight's gray-200, which is not a
colour in this palette and was never chosen by anyone. It appeared because `border-ink/12` does
not exist: Tailwind builds opacity modifiers from a scale in steps of five, so `/12` produced no
rule and the border fell through to the default. Nineteen borders across the site were in that
state, and `bg-ink/8` — seventeen faint light panels — was painting nothing at all.

Both sides are the same commit except for the sweep, captured minutes apart on one dev server.

**The average-brightness probe reads the same on both sides**: 12.7 with 1260 light cells at
1440, 13.4 with 9862 at 375. That is not a null result, it is the probe telling the truth about
its own limits — it only stamps backgrounds above 0.6 alpha, and every panel this sweep brought
back is between 0.03 and 0.12. The light these add is real and small, and the pair is the only
place it shows.

*A measurement that cannot see a change is not evidence that nothing changed.*

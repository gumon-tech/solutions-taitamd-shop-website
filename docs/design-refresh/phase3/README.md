# Phase 3 — paired screenshots

Evidence for `Q-SHOP-033` phase 3. Captured with `scripts/screenshot.mjs`; the method and the
two ways of capturing that failed first are written up in `../phase2/README.md`.

## 3.0 — the hero card, which WS ordered fixed before anything else

| file | what it shows |
|---|---|
| `1440-before-cream-hero-card.jpg` · `1440-after-cream-hero-card.jpg` | the signature card. Before: every line of type on the photograph. After: the photograph as a band, the type on cream. |
| `375-*` | the same on a phone |

Four lines of type were sitting on a picture, and phase 2 had thinned the wash so the picture
came through. Measured off the pixels, against a 4.5 floor:

```
                                    before   after 1440   after 375
Signature experience                  3.51        6.26        6.36
Deep relief, soft luxury.             3.04       10.61       10.77
Thai + Deep Tissue + Aromatherapy     2.99        8.28        8.52
Taitam-D Signature — £69 / 60 min     2.86        6.24        6.36
```

The band keeps what phase 2 was after — you can see the room, at full opacity, with the wash
still at 0.34 — and takes the type off it entirely.

**One number went the wrong way and is worth reading carefully.** Average brightness at 1440
is 19.2 → 19.0. The card is 208px taller now, because the type sits below the picture instead
of on top of it, and the page grew with it. Light cells went 3496 → 3547 and total light
(average × height) went 219,898 → 221,559: more light, spread over more page. At 375 both
figures rose, 21.2 → 22.1 and 27952 → 30664.

*An average falls when the denominator grows, and a rule written only against the average
cannot tell that apart from losing light.* This is the same dilution that made phase 2 look
like a regression until the absolute count settled it.

## 3.1 — two light bands on the home page

| file | what it shows |
|---|---|
| `1440-before-cream-awards.jpg` · `1440-after-cream-awards.jpg` | the social-proof panel, and the four numbers inside it |
| `1440-before-cream-faq.jpg` · `1440-after-cream-faq.jpg` | the ten questions and answers — the longest stretch of continuous reading on the page |
| `375-*` | the same two on a phone |

Measured on the page, both widths, with `scripts/brightness-probe.js`:

```
1440   average 12.7 → 19.2   ·   light cells 1260 → 3496
 375   average 13.4 → 21.2   ·   light cells 9862 → 27952
```

Light cells is the figure phase 3 exists to move. Phase 2 could not move it at all — every
photograph on this page measures under 50, so pictures raise the average and add no light. Two
cream panels nearly tripled it.

Every text colour on those panels, measured off the captured pixels rather than computed from
the CSS, against a 4.5 floor:

```
on #f5efe3 (86.6)   heading and answers 10.77   ·   paragraph 8.52   ·   label 6.36
on #ebe3d4 (77.4)   heading and answers  9.68   ·   paragraph 7.65   ·   number 5.72
```

The label started at `#927039`, the colour /book/ has used for years, and measured 3.99 on
`#f5efe3` and 3.58 on `#ebe3d4` — under the floor on both. It is `#6d5223` here instead. The
same label is still `#927039` on /book/, /signature/ and the promotions card, which is a
pre-existing failure this work found rather than caused; reported to WS separately.

## 3.2 — the same panel on the treatment landing pages

| file | what it shows |
|---|---|
| `1440-before-cream-landing-faq.jpg` · `1440-after-cream-landing-faq.jpg` | /facial-kings-cross/, standing in for all six |
| `375-*` | the same on a phone |

Measured on /facial-kings-cross/, both widths:

```
1440   average 3.4 → 13.3   ·   light cells 0 → 1196
 375   average 3.4 → 14.9   ·   light cells 0 → 8802
```

**Zero**, at both widths, before this. Not "few" — the six pages Google sends paid traffic to
had no area above 50 anywhere on them. They are the newest pages on the site and were built
entirely out of the dark ground, which is how a page ends up with no light at all without
anybody choosing that.

The panel now lives in `components/FaqPanel.tsx`. The markup had been copied into six files,
which is what made this phase risky: six grounds to change means five chances to leave one
behind, on pages nobody opens often enough to notice. The FAQPage structured data was moved
with it and verified unchanged — the parsed object hashes identically on all six pages before
and after.

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

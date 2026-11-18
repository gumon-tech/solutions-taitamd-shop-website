// Tests for the shop-agent diff rules (scripts/lib/shop-agent-diff.mjs). Plain Node, no test runner, no dependencies:
//   npm run test:shop-agent
// The baseline is a fixed copy of data/promotions.json as of e8ee631 (the three October cards), written out below, so
// the result never depends on what the live file holds: the workflow runs this on the merge result of every
// shop-agent pull request, and a test tied to the live data would fail the next data change. Pictures are still
// looked up in the real public/images, so removing or renaming one the shop system's cards rely on shows up here. Unusual characters are written as \u{...} escapes so the file says
// what each one is.
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { checkDiff, imageFileCheck } from "./lib/shop-agent-diff.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
// data/promotions.json at e8ee631.
const base = {
  "updated_at": "2026-10-19T13:41:36Z",
  "promotions": [
    {
      "code": "P-SAUNA90",
      "title": "Free infrared sauna session",
      "eyebrow": "We\u{2019}re back \u{00B7} Welcome back gift",
      "detail": "After one month of renovation, we are delighted to welcome you back. When you enjoy a 90-minute massage with us, your infrared sauna session is free.",
      "points": [
        "With a 90-minute massage",
        "Sauna session worth \u{00A3}35"
      ],
      "offer": "You are welcome to share this gift with a friend",
      "message": "Hi Taitam-D, I\u{2019}d like to book a 90-minute massage with the free infrared sauna welcome back gift.",
      "image": "/images/tour/infrared-sauna.jpg",
      "illustrative": false,
      "starts": "2026-09-17",
      "ends": "2026-10-16",
      "ends_label": "Friday 16 October 2026",
      "status": "ended"
    },
    {
      "code": "P-MASSAGE5",
      "title": "\u{00A3}5 off any 1-hour massage",
      "eyebrow": "\u{00A3}5 gift voucher \u{00B7} Walk-in offer",
      "detail": "Perfect for travellers, commuters and local visitors looking for relaxation near King\u{2019}s Cross.",
      "points": [
        "Any 1-hour massage",
        "Special walk-in offer"
      ],
      "offer": "Mention this offer on WhatsApp or when you arrive",
      "message": "Hi Taitam-D, I\u{2019}d like to use the \u{00A3}5 off any 1-hour massage offer.",
      "image": "/images/landing/massage.jpg",
      "illustrative": true,
      "starts": "2026-09-17",
      "ends": "2026-10-16",
      "ends_label": "Friday 16 October 2026",
      "status": "ended"
    },
    {
      "code": "P-HAIRSPA10",
      "title": "\u{00A3}10 off Hair Spa",
      "eyebrow": "\u{00A3}10 gift voucher \u{00B7} Walk-in offer",
      "detail": "Head massage and hair wash in one treatment: a soothing scalp massage, a refreshing hair wash and expert care that leaves your scalp and hair feeling clean, calm and beautifully refreshed.",
      "points": [
        "Hair Spa treatment",
        "Special walk-in offer"
      ],
      "offer": "Mention this offer on WhatsApp or when you arrive",
      "message": "Hi Taitam-D, I\u{2019}d like to use the \u{00A3}10 off Hair Spa offer.",
      "image": "/images/campaigns/promo-hair-spa-wash.jpg",
      "illustrative": true,
      "starts": "2026-09-17",
      "ends": "2026-10-16",
      "ends_label": "Friday 16 October 2026",
      "status": "ended"
    }
  ]
};
const isImageFile = imageFileCheck(root);
const opts = { staffNames: ["Somchai Jaidee"], isImageFile };
const clone = (x) => JSON.parse(JSON.stringify(x));

const offer = "Mention this offer on WhatsApp or when you arrive";
const card = (over) => ({
  code: "P-TEST1",
  title: "A test offer",
  eyebrow: "Walk-in offer",
  detail: "A plain sentence about the offer.",
  points: [],
  offer,
  message: "Hi Taitam-D, I'd like to book with your offer: A test offer.",
  image: null,
  illustrative: false,
  starts: "2026-11-20",
  ends: "2026-12-20",
  ends_label: "Sunday 20 December 2026",
  status: "live",
  ...over,
});
// The two cards the shop system is waiting to publish (2026-11).
const TLP9 = card({
  code: "P-TLP9",
  title: "Book a gel manicure or pedicure, and get your old gel removed for free",
  detail: "Book a gel manicure or pedicure, and get your old gel removed for free in the same appointment.",
  message: "Hi Taitam-D, I'd like to book with your offer: Book a gel manicure or pedicure, and get your old gel removed for free.",
  image: "/images/tour/pedicure-spa-chairs.jpg",
  illustrative: true, // either value: /images/tour/ is our own premises
});
const JYDW = card({
  code: "P-JYDW",
  title: "Massage promotion: 90-minute massage on all massage types",
  detail:
    "Massage promotion: 90-minute massage on all massage types. For any booking of 90 minutes or more, we will include a free 30-minute sauna worth \u{00A3}35.",
  message: "Hi Taitam-D, I'd like to book with your offer: Massage promotion: 90-minute massage on all massage types.",
  image: "/images/tour/infrared-sauna.jpg",
  illustrative: false, // /images/tour/, as P-SAUNA90 on main
});

let failed = 0;
let passed = 0;
function test(name, fn) {
  try {
    fn();
    passed++;
  } catch (e) {
    failed++;
    console.error(`FAIL ${name}\n  ${e.message.split("\n").join("\n  ")}`);
  }
}
const ok = (name, after, before = base) =>
  test(`accepts: ${name}`, () => assert.deepEqual(checkDiff("promotions", before, after, opts), []));
const no = (name, after, pattern, before = base) =>
  test(`refuses: ${name}`, () => {
    const errors = checkDiff("promotions", before, after, opts);
    assert.ok(errors.length > 0, "no error");
    if (pattern) assert.ok(errors.some((e) => pattern.test(e)), `no error matching ${pattern}:\n${errors.join("\n")}`);
  });
const withCard = (c) => ({ ...clone(base), promotions: [...clone(base.promotions), c] });
const withNote = (note) => ({ ...clone(base), note });

// ---- accepted
const pending = clone(base);
pending.updated_at = "2026-11-19T10:00:00.123Z";
pending.note = "Two offers this month, book on WhatsApp or walk in.";
pending.promotions.push(clone(TLP9), clone(JYDW));
ok("the two pending cards, a note and a new updated_at", pending);
ok("P-TLP9 alone", withCard(clone(TLP9)));
ok("P-JYDW alone", withCard(clone(JYDW)));
ok("a text-only card", withCard(card({ image: null, illustrative: true })));
ok("a card on a picture main marks illustrative", withCard(card({ image: "/images/landing/massage.jpg", illustrative: true })));
ok(
  "curly quotes, dashes, a middle dot and an accent",
  withCard(card({ eyebrow: "We\u{2019}re back \u{00B7} Caf\u{00E9} gift", detail: "\u{201C}A treat\u{201D} \u{2013} for two \u{2014} near King\u{2019}s Cross\u{2026}" })),
);
ok("points, a date and a price", withCard(card({ points: ["Any 1-hour massage", "Until 20/12/2026"], detail: "From 1 to 20 December 2026, \u{00A3}10 off. Open 10:00-20:00." })));
{
  const a = clone(base);
  a.promotions[0].status = "live";
  a.promotions[1].ends = "2026-12-31";
  a.promotions[1].ends_label = "Thursday 31 December 2026";
  ok("status and end-date changes on existing cards", a);
  const before = clone(base);
  before.promotions[0].status = "draft";
  const b = clone(before);
  b.promotions[0].status = "live";
  ok("draft to live", b, before);
  const c = clone(base);
  c.promotions[2].starts = "2026-09-01";
  ok("an existing card starting earlier (starts may change)", c);
  const d = clone(base);
  d.promotions[2].starts = "2026-11-19";
  d.promotions[2].ends = "2026-12-19";
  d.promotions[2].status = "live";
  ok("an existing card restarted today with a new end", d);
}
{
  const a = clone(base);
  a.promotions[0].starts = "2026-10-17";
  no("an existing card whose starts moves after its ends", a, /starts 2026-10-17 is after ends 2026-10-16/);
  const b = clone(base);
  b.promotions[0].starts = "19/11/2026";
  no("an existing card with a malformed starts", b, /starts must be a date/);
  const c = clone(base);
  c.promotions[0].starts = "2026-02-30";
  no("an existing card with an impossible starts", c, /starts must be a date/);
  const d = clone(base);
  d.promotions[0].ends = "2026-09-01";
  no("an existing card whose ends moves before its starts", d, /is after ends/);
}
ok("removing the note", clone(base), withNote("Old note."));
ok("an empty note", withNote(""));

// ---- the file's own fields and the note
no("an unknown top-level field", { ...clone(base), banner: "Hello" }, /unknown field banner/);
no("a note that is not text", withNote(["x"]), /note must be text/);
no("a note over 200 characters", withNote("Book now. ".repeat(25)), /note is \d+ characters/);
no("a note with a health claim", withNote("Relieve stress with our massage."), /health-result/);
no("a note with a link", withNote("See www.example.com for more."), /link/);
no("a note with a bare domain", withNote("Details at example.co.uk today."), /link/);
no("a note with a phone number", withNote("Call 07700 900123 to book."), /phone-like/);
no("a note naming staff", withNote("Ask for Somchai Jaidee."), /team member/);
no("a note with a zero-width space", withNote("Book\u{200B}now"), /invisible/);
no("a bad updated_at", { ...clone(base), updated_at: "yesterday" }, /updated_at/);

// ---- pictures and illustrative
no("an image outside /images/", withCard(card({ image: "/favicon.ico" })), /image must be/);
no("an image with ..", withCard(card({ image: "/images/../favicon.jpg" })), /image must be/);
no("an image with //", withCard(card({ image: "/images//tour/infrared-sauna.jpg" })), /image must be/);
no("an image with upper case", withCard(card({ image: "/images/tour/Infrared-Sauna.jpg" })), /image must be/);
no("an image of another type", withCard(card({ image: "/images/tour/infrared-sauna.svg" })), /image must be/);
no("an image with a query string", withCard(card({ image: "/images/tour/infrared-sauna.jpg?x=1" })), /image must be/);
no("an image that is not text", withCard(card({ image: 5 })), /image must be/);
no("an image that does not exist", withCard(card({ image: "/images/tour/no-such-picture.jpg", illustrative: true })), /not a file/);
no("an image that is a directory", withCard(card({ image: "/images/tour", illustrative: true })), /image must be/);
ok("P-TLP9 with illustrative false (a premises photo under /images/tour/)", withCard({ ...clone(TLP9), illustrative: false }));
ok("P-JYDW with illustrative true (either value under /images/tour/)", withCard({ ...clone(JYDW), illustrative: true }));
no("illustrative missing on a /images/tour/ picture", withCard({ ...clone(TLP9), illustrative: "no" }), /illustrative must be true or false/);
no("illustrative false on /images/landing/massage.jpg (main marks it true)", withCard(card({ image: "/images/landing/massage.jpg", illustrative: false })), /illustrative must be true/);
no("illustrative false on a non-tour picture no card has used", withCard(card({ image: "/images/landing/nails.jpg", illustrative: false })), /illustrative must be true/);
test("refuses: every picture when nothing can check the disk", () =>
  assert.ok(checkDiff("promotions", base, withCard(clone(JYDW)), { staffNames: [] }).some((e) => /not a file/.test(e))));
test("imageFileCheck: a real picture, a directory, a path out of public/images", () => {
  assert.equal(isImageFile("/images/tour/infrared-sauna.jpg"), true);
  assert.equal(isImageFile("/images/tour"), false);
  assert.equal(isImageFile("/images/../favicon.ico"), false);
});

// ---- text bypasses
no("a zero-width space", withCard(card({ title: "Free\u{200B}sauna" })), /invisible/);
no("a bidi override", withCard(card({ detail: "Book \u{202E}now" })), /invisible/);
no("a word joiner inside a health word", withCard(card({ detail: "Stress\u{2060}free massage" })), /invisible/);
no("a control character", withCard(card({ detail: "Line one\u{0007}" })), /control character/);
no("fullwidth www", withCard(card({ detail: "Visit \u{FF57}\u{FF57}\u{FF57}\u{FF0E}example\u{FF0E}com" })), /link/);
no("mathematical bold letters spelling a health word", withCard(card({ detail: "Pure \u{1D42B}\u{1D41E}\u{1D425}\u{1D422}\u{1D41E}\u{1D41F} in one hour" })), /health-result/);
no("Cyrillic look-alike letters", withCard(card({ title: "Fr\u{0435}\u{0435} sauna" })), /outside English/);
no("Greek letters", withCard(card({ title: "Free s\u{03B1}una" })), /outside English/);
no("Thai script", withCard(card({ title: "Free \u{0E19}\u{0E27}\u{0E14}" })), /Thai/);
no("an emoji", withCard(card({ title: "Free sauna \u{1F389}" })), /emoji/);
no("a pointing-hand symbol", withCard(card({ title: "Free sauna \u{261B} now" })), /outside English|emoji/);
no("a combining mark on its own", withCard(card({ title: "Free sauna\u{0336}" })), /outside English/);
no("a bare domain", withCard(card({ detail: "Details at example.co.uk" })), /link/);
no("a short link", withCard(card({ detail: "Details: bit.ly/x" })), /link/);
no("the shop's own domain", withCard(card({ detail: "See taitam-d.com" })), /link/);
no("dot com written out", withCard(card({ detail: "example dot com" })), /link/);
no("a scheme", withCard(card({ detail: "https://example.org" })), /link/);
no("an email address", withCard(card({ detail: "Write to book@example.org" })), /email|link/);
no("a phone number", withCard(card({ detail: "Call 020 7123 4567" })), /phone-like/);
no("a spaced-out phone number", withCard(card({ detail: "Call 0 7 7 0 0 9 0 0 1 2 3" })), /phone-like/);
no("a phone number with dots and slashes", withCard(card({ detail: "Ring 077.009/001-23" })), /phone-like/);
no("a phone number with wide gaps", withCard(card({ detail: "Ring 07700   900   123" })), /phone-like/);
no("a fullwidth phone number", withCard(card({ detail: "Ring \u{FF10}\u{FF17}\u{FF17}\u{FF10}\u{FF10}\u{FF19}\u{FF10}\u{FF10}\u{FF11}\u{FF12}\u{FF13}" })), /phone-like/);
no("an international phone number", withCard(card({ detail: "WhatsApp +44 7700 900123" })), /phone-like/);
no("a word over 24 characters", withCard(card({ title: "Supercalifragilisticexpialidocious offer" })), /longer than 24/);
no("a long word in a point", withCard(card({ points: ["Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"] })), /longer than 24/);
no("a health claim", withCard(card({ detail: "Melts away muscle tension." })), /health-result/);
no("a staff name", withCard(card({ detail: "With Somchai Jaidee." })), /team member/);
no("a staff id", withCard(card({ detail: "Ask for TW12." })), /staff id/);
no("a [web- tag", withCard(card({ message: "Hi [web-C]" })), /web-X/);
no("a National Insurance number", withCard(card({ detail: "Ref AB 12 34 56 C" })), /National Insurance/);
no("an unknown card field", withCard(card({ html: "<b>x</b>" })), /unknown fields html/);
no("a title over 80 characters", withCard(card({ title: "Free sauna and more ".repeat(5) })), /title is/);
no("five points", withCard(card({ points: ["a", "b", "c", "d", "e"] })), /at most 4 points/);
no("a bad code", withCard(card({ code: "p-lower" })), /code must look like/);
no("a new card that ends before it starts", withCard(card({ starts: "2026-12-21", ends: "2026-12-20" })), /is after ends/);
no("a new card with a malformed ends", withCard(card({ ends: "2026-12" })), /ends must be a date/);
no("a new card with a health word in ends_label", withCard(card({ ends_label: "When the pain stops" })), /health-result/);
{
  const a = clone(base);
  a.promotions[1].ends_label = "Thursday 31 December 2026 and every day after";
  no("a changed ends_label over 40 characters", a, /ends_label is \d+ characters/);
  const b = clone(base);
  b.promotions[1].ends_label = "Until www.example.com";
  no("a changed ends_label with a link", b, /ends_label: a link/);
  const c = clone(base);
  c.promotions[1].ends_label = "Call 07700 900123";
  no("a changed ends_label with a phone number", c, /ends_label: a phone-like/);
  const d = clone(base);
  d.promotions[1].ends_label = 7;
  no("a changed ends_label that is not text", d, /ends_label must be text/);
}

// ---- the rules that were there before
{
  const a = clone(base);
  a.promotions[0].title = "Edited";
  no("editing wording on an existing card", a, /title was changed/);
  const b = clone(base);
  b.promotions.pop();
  no("removing a card", b, /was removed/);
  const c = clone(base);
  c.promotions.reverse();
  no("reordering cards", c, /moved/);
  const d = clone(base);
  d.promotions.splice(1, 0, clone(JYDW));
  no("a new card in the middle", d, /moved|appended at the end/);
}

console.log(`shop-agent diff rules: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);

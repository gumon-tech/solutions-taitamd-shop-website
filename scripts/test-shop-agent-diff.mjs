// Tests for the shop-agent diff rules (scripts/lib/shop-agent-diff.mjs). Plain Node, no test runner, no dependencies:
//   npm run test:shop-agent
// The baseline is a fixed copy of data/promotions.json as of e8ee631 (the three October cards), written out below, so
// the result never depends on what the live file holds: the workflow runs this on the merge result of every
// shop-agent pull request, and a test tied to the live data would fail the next data change. Pictures are still
// looked up in the real public/images, so removing or renaming one the shop system's cards rely on shows up here.
// The other concerns (hours, closures, notice, faq, services, copy, photos) follow the same way: a small fixture
// written into this file as the baseline, never the live data/*.json. Unusual characters are written as \u{...}
// escapes so the file says what each one is.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
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

// ================================================================ the content concerns
const okC = (concern, name, before, after, extra = {}) =>
  test(`${concern} accepts: ${name}`, () => assert.deepEqual(checkDiff(concern, before, after, { ...opts, ...extra }), []));
const noC = (concern, name, before, after, pattern, extra = {}) =>
  test(`${concern} refuses: ${name}`, () => {
    const errors = checkDiff(concern, before, after, { ...opts, ...extra });
    assert.ok(errors.length > 0, "no error");
    if (pattern) assert.ok(errors.some((e) => pattern.test(e)), `no error matching ${pattern}:\n${errors.join("\n")}`);
  });
const edit = (x, fn) => {
  const y = clone(x);
  fn(y);
  return y;
};

// ---- hours: the whole file may be replaced; lib/hours.ts holds the rules
{
  const day = (d) => ({ day: d, opens: "10:30", closes: "21:00" });
  const H = { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day) };
  okC("hours", "new times and a closed Sunday", H, edit(H, (h) => { h.days[0].opens = "11:00"; h.days[6] = { day: "Sunday", closed: true }; }));
  noC("hours", "an extra top-level field", H, { ...clone(H), note: "Closed for Christmas" }, /unknown field note/);
  noC("hours", "added files", H, clone(H), /only a photos pull request may add or delete files/, { added: [{ path: "public/images/sp-x.jpg", size: 10, regular: true, head: new Uint8Array([0xff, 0xd8, 0xff]) }] });
}

// ---- closures: append, change status / dates / label, never remove
{
  const C = { closures: [{ code: "C-XMAS26", from: "2026-12-24", to: "2026-12-26", label: "Christmas", status: "live" }] };
  const NY = { code: "C-NY27", from: "2027-01-01", to: "2027-01-01", label: "New Year\u{2019}s Day", status: "live" };
  okC("closures", "a new closure appended", C, edit(C, (c) => c.closures.push(clone(NY))));
  okC("closures", "status, dates and label of an existing one", C, edit(C, (c) => Object.assign(c.closures[0], { status: "ended", from: "2026-12-23", to: "2026-12-27", label: "Christmas break" })));
  okC("closures", "from an empty list", { closures: [] }, { closures: [clone(NY)] });
  noC("closures", "removing a closure", C, { closures: [] }, /was removed/);
  noC("closures", "a new one placed first", C, edit(C, (c) => c.closures.unshift(clone(NY))), /moved|appended/);
  noC("closures", "an unknown field", C, edit(C, (c) => c.closures.push({ ...clone(NY), note: "x" })), /unknown fields note/);
  noC("closures", "a bad code", C, edit(C, (c) => c.closures.push({ ...clone(NY), code: "C NY" })), /code must be/);
  noC("closures", "from after to", C, edit(C, (c) => { c.closures[0].from = "2026-12-28"; }), /is after to/);
  noC("closures", "an impossible date", C, edit(C, (c) => c.closures.push({ ...clone(NY), to: "2027-02-30" })), /to must be a date/);
  noC("closures", "a status other than live or ended", C, edit(C, (c) => { c.closures[0].status = "hidden"; }), /status must be/);
  noC("closures", "a phone number in the label", C, edit(C, (c) => { c.closures[0].label = "Call 07700 900123"; }), /phone-like/);
  noC("closures", "a price in the label", C, edit(C, (c) => { c.closures[0].label = "Christmas, \u{00A3}10 off"; }), /price or currency/);
  noC("closures", "a link in the label", C, edit(C, (c) => { c.closures[0].label = "See bit.ly/xmas"; }), /link/);
  noC("closures", "a label over 80 characters", C, edit(C, (c) => { c.closures[0].label = "Closed ".repeat(13); }), /limit 80/);
  // Special hours: opens and closes together turn a closed day into an open one with those hours.
  const EVE = { code: "C-EVE26", from: "2026-12-24", to: "2026-12-24", label: "Christmas Eve", status: "live", opens: "12:00", closes: "18:00" };
  const S = { closures: [...clone(C.closures), clone(EVE)] };
  okC("closures", "a new closure with special hours", C, edit(C, (c) => c.closures.push(clone(EVE))));
  okC("closures", "special hours set on an existing closure", C, edit(C, (c) => Object.assign(c.closures[0], { opens: "11:00", closes: "17:30" })));
  okC("closures", "special hours changed", S, edit(S, (c) => Object.assign(c.closures[1], { opens: "10:30", closes: "16:00" })));
  okC("closures", "special hours taken off (closed again)", S, edit(S, (c) => { delete c.closures[1].opens; delete c.closures[1].closes; }));
  noC("closures", "opens without closes on a new one", C, edit(C, (c) => c.closures.push({ ...clone(EVE), closes: undefined })), /go together/);
  noC("closures", "closes without opens on an existing one", C, edit(C, (c) => { c.closures[0].closes = "18:00"; }), /go together/);
  noC("closures", "closes before opens", C, edit(C, (c) => c.closures.push({ ...clone(EVE), opens: "18:00", closes: "12:00" })), /not after opens/);
  noC("closures", "closes equal to opens", S, edit(S, (c) => { c.closures[1].closes = "12:00"; }), /not after opens/);
  noC("closures", "a time without a leading zero", C, edit(C, (c) => c.closures.push({ ...clone(EVE), opens: "9:00" })), /opens must be a 24-hour time/);
  noC("closures", "an impossible time", S, edit(S, (c) => { c.closures[1].closes = "24:00"; }), /closes must be a 24-hour time/);
  noC("closures", "a time in words", C, edit(C, (c) => c.closures.push({ ...clone(EVE), opens: "noon" })), /opens must be a 24-hour time/);
  noC("closures", "a time that is a number", C, edit(C, (c) => c.closures.push({ ...clone(EVE), closes: 1800 })), /closes must be a 24-hour time/);
}

// ---- notice: the slot is replaced whole (null or one notice)
{
  const N = { code: "N-XMAS26", text: "We close early on 24 December and reopen on 27 December.", starts: "2026-12-20", ends: "2026-12-26", link: "/contact" };
  okC("notice", "a notice set", { notice: null }, { notice: clone(N) });
  okC("notice", "a notice cleared", { notice: clone(N) }, { notice: null });
  okC("notice", "a notice without a link", { notice: null }, { notice: { ...clone(N), link: undefined } });
  okC("notice", "a link to a section", { notice: null }, { notice: { ...clone(N), link: "/services#cat-massage" } });
  noC("notice", "a link to another site", { notice: null }, { notice: { ...clone(N), link: "https://example.com" } }, /link must be a path/);
  noC("notice", "a protocol-relative link", { notice: null }, { notice: { ...clone(N), link: "//example.com/x" } }, /link must be a path/);
  noC("notice", "a link with a query", { notice: null }, { notice: { ...clone(N), link: "/book?ref=x" } }, /link must be a path/);
  noC("notice", "a price in the text", { notice: null }, { notice: { ...clone(N), text: "All massages \u{00A3}10 off this week." } }, /price or currency/);
  noC("notice", "an emoji in the text", { notice: null }, { notice: { ...clone(N), text: "Closed for Christmas \u{1F384}" } }, /emoji/);
  noC("notice", "a health claim in the text", { notice: null }, { notice: { ...clone(N), text: "Beat winter stress with us." } }, /health-result/);
  noC("notice", "ends before starts", { notice: null }, { notice: { ...clone(N), ends: "2026-12-19" } }, /is after ends/);
  noC("notice", "an unknown field", { notice: null }, { notice: { ...clone(N), colour: "red" } }, /unknown fields colour/);
  noC("notice", "text over 200 characters", { notice: null }, { notice: { ...clone(N), text: "Open as usual. ".repeat(15) } }, /limit 200/);
  noC("notice", "a notice that is a list", { notice: null }, { notice: [clone(N)] }, /null or an object/);
}

// ---- faq: answers edited or appended, never removed; the massage answer and the page keys stay
{
  const F = {
    shop: [
      { id: "where-are-you", q: "Where are you?", a: "We are at {{address}}, a {{walk_minutes}}-minute walk from King's Cross St Pancras." },
      { id: "what-are-your-opening-hours", q: "What are your opening hours?", a: "We are open every day from {{hours}}." },
    ],
    massage_expectation: { id: "massage-expectation", q: "What should I expect during a massage?", a: ["Standards notice.", "If you have pain, tell your therapist."] },
    pages: { "nails-kings-cross": [{ id: "how-long-do-gel-nails-last", q: "How long do gel nails last?", a: "Usually two to three weeks." }] },
  };
  const NEW = { id: "do-you-sell-gift-vouchers", q: "Do you sell gift vouchers?", a: ["Yes.", "Message us on WhatsApp to arrange one."] };
  okC("faq", "an answer edited with a token", F, edit(F, (f) => { f.shop[1].a = "We are open from {{hours}}, every day of the week."; }));
  okC("faq", "a question edited", F, edit(F, (f) => { f.shop[0].q = "Where is the shop?"; }));
  okC("faq", "an answer appended to the shop list", F, edit(F, (f) => f.shop.push(clone(NEW))));
  okC("faq", "an answer appended to a page list", F, edit(F, (f) => f.pages["nails-kings-cross"].push(clone(NEW))));
  okC("faq", "the word therapist", F, edit(F, (f) => { f.shop[0].a = "Ask your therapist about pressure before you start."; }));
  noC("faq", "an answer removed", F, edit(F, (f) => f.shop.pop()), /was removed/);
  noC("faq", "answers reordered", F, edit(F, (f) => f.shop.reverse()), /moved/);
  noC("faq", "an id changed", F, edit(F, (f) => { f.shop[0].id = "where"; }), /was removed/);
  noC("faq", "the massage expectation answer edited", F, edit(F, (f) => { f.massage_expectation.a[1] = "Relax."; }), /massage_expectation/);
  noC("faq", "a new page key", F, edit(F, (f) => { f.pages["new-page"] = [clone(NEW)]; }), /new page key/);
  noC("faq", "a page key removed", F, edit(F, (f) => { delete f.pages["nails-kings-cross"]; }), /pages.nails-kings-cross: was removed/);
  noC("faq", "an unknown token", F, edit(F, (f) => { f.shop[1].a = "From {{price}}."; }), /unknown token \{\{price\}\}/);
  noC("faq", "a stray brace", F, edit(F, (f) => { f.shop[1].a = "Open {hours}."; }), /stray/);
  noC("faq", "a price", F, edit(F, (f) => { f.shop[1].a = "An hour is \u{00A3}69."; }), /price or currency/);
  noC("faq", "a health claim", F, edit(F, (f) => { f.shop[1].a = "Massage relieves back pain."; }), /health-result/);
  noC("faq", "a new answer with an extra field", F, edit(F, (f) => f.shop.push({ ...clone(NEW), hidden: true })), /unknown fields hidden/);
  noC("faq", "a new answer with a bad id", F, edit(F, (f) => f.shop.push({ ...clone(NEW), id: "Gift Vouchers" })), /id must be/);
  noC("faq", "seven paragraphs", F, edit(F, (f) => { f.shop[0].a = ["a", "b", "c", "d", "e", "f", "g"]; }), /1 to 6 paragraphs/);
  noC("faq", "a question over 160 characters", F, edit(F, (f) => { f.shop[0].q = "Where? ".repeat(25); }), /limit 160/);
  noC("faq", "angle brackets", F, edit(F, (f) => { f.shop[0].a = "We are <b>here</b>."; }), /< or >/);
  // status: "live" (or absent) shows the answer, "hidden" keeps it in the file and off the page.
  okC("faq", "an existing shop answer hidden", F, edit(F, (f) => { f.shop[0].status = "hidden"; }));
  okC("faq", "an existing answer marked live explicitly", F, edit(F, (f) => { f.shop[1].status = "live"; }));
  const H = edit(F, (f) => { f.shop[0].status = "hidden"; });
  okC("faq", "a hidden answer shown again", H, edit(H, (f) => { f.shop[0].status = "live"; }));
  okC("faq", "a hidden answer shown again by removing status", H, edit(H, (f) => { delete f.shop[0].status; }));
  okC("faq", "a hidden answer edited while hidden", H, edit(H, (f) => { f.shop[0].a = "Near King's Cross."; }));
  okC("faq", "an answer appended hidden", F, edit(F, (f) => f.shop.push({ ...clone(NEW), status: "hidden" })));
  okC("faq", "an answer appended live", F, edit(F, (f) => f.pages["nails-kings-cross"].push({ ...clone(NEW), status: "live" })));
  const OWN = edit(F, (f) => f.pages["nails-kings-cross"].push(clone(NEW)));
  okC("faq", "the system's own appended answer hidden later", OWN, edit(OWN, (f) => { f.pages["nails-kings-cross"][1].status = "hidden"; }));
  okC("faq", "a page answer hidden while another stays", OWN, edit(OWN, (f) => { f.pages["nails-kings-cross"][0].status = "hidden"; }));
  noC("faq", "a status other than live or hidden", F, edit(F, (f) => { f.shop[0].status = "draft"; }), /status: must be live or hidden/);
  noC("faq", "a status that is not text", F, edit(F, (f) => { f.shop[0].status = false; }), /status: must be live or hidden/);
  noC("faq", "a new answer with a bad status", F, edit(F, (f) => f.shop.push({ ...clone(NEW), status: "ended" })), /status: must be live or hidden/);
  noC("faq", "every answer of a page hidden", F, edit(F, (f) => { f.pages["nails-kings-cross"][0].status = "hidden"; }), /every answer is hidden/);
  noC("faq", "every shop answer hidden", F, edit(F, (f) => { f.shop.forEach((e) => { e.status = "hidden"; }); }), /every answer is hidden/);
  noC("faq", "a status on the massage expectation answer", F, edit(F, (f) => { f.massage_expectation.status = "hidden"; }), /massage_expectation/);
  noC("faq", "a hidden answer removed", H, edit(H, (f) => f.shop.shift()), /was removed \(set its status to hidden/);
  noC("faq", "a hidden answer moved", H, edit(H, (f) => f.shop.reverse()), /moved/);
}

// ---- services: services added, renamed, re-priced or removed inside the existing categories
{
  const v = (minutes, gbp) => ({ minutes, price: { gbp }, treatwell_sku: null });
  const S = {
    categories: [
      {
        slug: "massage", title: "Massage", blurb: "Thai and western massage.", image: "/images/services/massage.jpg",
        services: [
          { name: "Deep Tissue Massage", variants: [v(30, 39), v(60, 69)] },
          { name: "Pregnancy Massage", note: "Please tell us how many weeks along you are when you book.", variants: [v(60, 69)] },
          { name: "Thai Remedy", desc: "Our signature remedial blend of Thai techniques for deep, lasting relief.", variants: [v(60, 74)] },
        ],
      },
      { slug: "nails", title: "Nails", blurb: "Hands and feet.", services: [{ name: "Spa Pedicure with Gel (UV)", featured: true, variants: [v(60, 45)] }] },
    ],
    service_categories: [{ slug: "massage", title: "Massage", subtitle: "Thai and western", highlights: ["Deep tissue"] }],
  };
  okC("services", "a price and a duration changed", S, edit(S, (s) => { s.categories[0].services[0].variants[1] = v(75, 79); }));
  okC("services", "a struck-through price and a Treatwell id", S, edit(S, (s) => { s.categories[0].services[0].variants[0] = { minutes: 30, price: { gbp: 35, wasGbp: 39 }, treatwell_sku: "TW-abc_1" }; }));
  okC("services", "a service renamed in place", S, edit(S, (s) => { s.categories[0].services[0].name = "Deep Tissue"; }));
  okC("services", "an unchanged desc with old wording kept on a re-priced service", S, edit(S, (s) => { s.categories[0].services[2].variants[0] = v(60, 79); }));
  okC("services", "a service added with a price in its desc", S, edit(S, (s) => s.categories[0].services.push({ name: "Swedish Massage", desc: "Long, flowing strokes. From 30 minutes, \u{00A3}35.", variants: [v(30, 35), { option: "With hot stones", minutes: 60, price: { gbp: 74 }, treatwell_sku: null }] })));
  okC("services", "a service removed", S, edit(S, (s) => s.categories[0].services.splice(1, 1)));
  okC("services", "the featured service re-priced", S, edit(S, (s) => { s.categories[1].services[0].variants[0] = v(60, 49); }));
  noC("services", "service_categories changed", S, edit(S, (s) => { s.service_categories[0].subtitle = "New"; }), /service_categories/);
  noC("services", "a category title changed", S, edit(S, (s) => { s.categories[1].title = "Hands"; }), /nails.title was changed/);
  noC("services", "a category added", S, edit(S, (s) => s.categories.push({ slug: "laser", title: "Laser", blurb: "x", services: [] })), /no category is added/);
  noC("services", "featured set on a new service", S, edit(S, (s) => s.categories[1].services.push({ name: "Gel Manicure", featured: true, variants: [v(45, 30)] })), /featured/);
  noC("services", "a note changed", S, edit(S, (s) => { s.categories[0].services[1].note = "Any stage welcome."; }), /note: may not/);
  noC("services", "a new service with a note", S, edit(S, (s) => s.categories[0].services.push({ name: "Couples Massage", note: "Call first.", variants: [v(60, 130)] })), /note: may not/);
  noC("services", "a medical treatment added", S, edit(S, (s) => s.categories[0].services.push({ name: "Botox Top-Up", variants: [v(30, 150)] })), /medical or aesthetic/);
  noC("services", "a health claim in a new desc", S, edit(S, (s) => { s.categories[0].services[0].desc = "Firm pressure for lasting relief."; }), /health-result/);
  noC("services", "an unknown field", S, edit(S, (s) => { s.categories[0].services[0].badge = "New"; }), /unknown fields badge/);
  noC("services", "an emoji in an option", S, edit(S, (s) => { s.categories[0].services[0].variants[0].option = "Short \u{2728}"; }), /emoji/);
  noC("services", "a link in a desc", S, edit(S, (s) => { s.categories[0].services[0].desc = "Book at taitam-d.com"; }), /link/);
}

// ---- copy: values of the declared slots change, keys never
{
  const SLOTS = { "home.hero.h1": { kind: "line", max: 50 }, "home.hero.lead": { kind: "paragraph", max: 300 }, "home.location.h2": { kind: "line", max: 40 } };
  const K = { updated_at: "2026-11-19T00:00:00Z", slots: { "home.hero.h1": "Thai massage and beauty in", "home.hero.lead": "A calm place in King\u{2019}s Cross.", "home.location.h2": "{{walk_minutes}} minutes from" } };
  const x = { copySlots: SLOTS };
  okC("copy", "the hero H1 changed", K, edit(K, (k) => { k.slots["home.hero.h1"] = "Massage and beauty near"; k.updated_at = "2026-11-20T09:15:00Z"; }), x);
  okC("copy", "a paragraph with a line break and a token", K, edit(K, (k) => { k.slots["home.hero.lead"] = "Open {{hours}}.\nMessage us on WhatsApp \u{2022} we reply fast."; }), x);
  noC("copy", "a slot added", K, edit(K, (k) => { k.slots["home.hero.extra"] = "Hi"; }), /not a declared slot/, x);
  noC("copy", "a slot removed", K, edit(K, (k) => { delete k.slots["home.location.h2"]; }), /slot is missing/, x);
  noC("copy", "an unknown top-level field", K, { ...clone(K), theme: "dark" }, /unknown field theme/, x);
  noC("copy", "a bad updated_at", K, { ...clone(K), updated_at: "today" }, /updated_at/, x);
  noC("copy", "a price", K, edit(K, (k) => { k.slots["home.hero.h1"] = "Massage from \u{00A3}35"; }), /price or currency/, x);
  noC("copy", "a link", K, edit(K, (k) => { k.slots["home.hero.lead"] = "Book at www.example.com"; }), /link/, x);
  noC("copy", "an unknown token", K, edit(K, (k) => { k.slots["home.hero.lead"] = "Near {{address}}."; }), /unknown token/, x);
  noC("copy", "a line break in a line slot", K, edit(K, (k) => { k.slots["home.hero.h1"] = "Thai massage\nand beauty"; }), /control character/, x);
  noC("copy", "a value over the slot limit", K, edit(K, (k) => { k.slots["home.location.h2"] = "Only a few minutes on foot from the station"; }), /limit 40/, x);
  noC("copy", "an empty value", K, edit(K, (k) => { k.slots["home.hero.h1"] = " "; }), /non-empty/, x);
  noC("copy", "a staff name", K, edit(K, (k) => { k.slots["home.hero.lead"] = "Ask for Somchai Jaidee."; }), /team member/, x);
}

// ---- photos: src and alt of the declared slots, plus new pictures public/images/sp-<name>.jpg|.webp
{
  const SLOTS = { "home.hero": { alt_max: 160 }, "home.gallery.1": { alt_max: 160 } };
  const P = {
    updated_at: "2026-11-19T00:00:00Z",
    slots: { "home.hero": { src: "/images/gallery/massage-1600x900.jpg", alt: "Massage treatment" }, "home.gallery.1": { src: "/images/gallery/spa-1200x800.jpg", alt: "Spa atmosphere" } },
  };
  const JPEG = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0x10, 0x4a, 0x46, 0x49, 0x46, 0, 1]);
  const WEBP = new Uint8Array([0x52, 0x49, 0x46, 0x46, 0x24, 0, 0, 0, 0x57, 0x45, 0x42, 0x50]);
  const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);
  const file = (p, head = JPEG, over = {}) => ({ path: p, size: 120 * 1024, regular: true, head, ...over });
  const use = (src) => edit(P, (p) => { p.slots["home.hero"].src = src; });
  const x = { photoSlots: SLOTS };
  okC("photos", "a slot pointed at another existing picture", P, use("/images/tour/infrared-sauna.jpg"), x);
  okC("photos", "an alt changed (therapist is an ordinary word)", P, edit(P, (p) => { p.slots["home.hero"].alt = "A therapist working on a client\u{2019}s shoulders"; }), x);
  okC("photos", "a new JPEG added and used", P, use("/images/sp-hero-nov.jpg"), { ...x, added: [file("public/images/sp-hero-nov.jpg")] });
  okC("photos", "a new WebP added and used", P, use("/images/sp-hero-nov.webp"), { ...x, added: [file("public/images/sp-hero-nov.webp", WEBP)] });
  noC("photos", "a picture that is not there", P, use("/images/gallery/nope.jpg"), /not a file under public\/images/, x);
  noC("photos", "a src outside /images/", P, use("/favicon.ico"), /must be a path like/, x);
  noC("photos", "a src with ..", P, use("/images/../favicon.jpg"), /must be a path like/, x);
  noC("photos", "an added picture no slot uses", P, clone(P), /no slot in data\/photos.json uses it/, { ...x, added: [file("public/images/sp-spare.jpg")] });
  noC("photos", "an added picture over 600 KB", P, use("/images/sp-big.jpg"), /limit is 600 KB/, { ...x, added: [file("public/images/sp-big.jpg", JPEG, { size: 601 * 1024 })] });
  noC("photos", "an added empty file", P, use("/images/sp-empty.jpg"), /limit is 600 KB/, { ...x, added: [file("public/images/sp-empty.jpg", new Uint8Array(), { size: 0 })] });
  noC("photos", "a PNG named .jpg", P, use("/images/sp-fake.jpg"), /not a JPEG/, { ...x, added: [file("public/images/sp-fake.jpg", PNG)] });
  noC("photos", "a JPEG named .webp", P, use("/images/sp-fake.webp"), /not a WebP/, { ...x, added: [file("public/images/sp-fake.webp", JPEG)] });
  noC("photos", "an added link", P, use("/images/sp-link.jpg"), /regular file/, { ...x, added: [file("public/images/sp-link.jpg", JPEG, { regular: false })] });
  noC("photos", "an added file outside the sp- name", P, use("/images/gallery/new.jpg"), /only public\/images\/sp-/, { ...x, added: [file("public/images/gallery/new.jpg")] });
  noC("photos", "an added .png", P, use("/images/sp-x.png"), /only public\/images\/sp-/, { ...x, added: [file("public/images/sp-x.png", PNG)] });
  noC("photos", "a slot added", P, edit(P, (p) => { p.slots["home.gallery.9"] = { src: "/images/gallery/spa-1200x800.jpg", alt: "Spa" }; }), /not a declared slot/, x);
  noC("photos", "a slot removed", P, edit(P, (p) => { delete p.slots["home.gallery.1"]; }), /slot is missing/, x);
  noC("photos", "an extra field in a slot", P, edit(P, (p) => { p.slots["home.hero"].caption = "Hi"; }), /unknown fields caption/, x);
  noC("photos", "a health claim in an alt", P, edit(P, (p) => { p.slots["home.hero"].alt = "Massage that eases back pain"; }), /health-result/, x);
  const SP = edit(P, (p) => { p.slots["home.hero"].src = "/images/sp-hero-oct.jpg"; });
  okC("photos", "an earlier upload deleted once no slot uses it", SP, use("/images/sp-hero-nov.jpg"), { ...x, added: [file("public/images/sp-hero-nov.jpg")], deleted: ["public/images/sp-hero-oct.jpg"] });
  noC("photos", "a deleted upload still in use", SP, clone(SP), /still uses it/, { ...x, deleted: ["public/images/sp-hero-oct.jpg"] });
  noC("photos", "a site picture deleted", P, use("/images/tour/infrared-sauna.jpg"), /only earlier public\/images\/sp-/, { ...x, deleted: ["public/images/gallery/massage-1600x900.jpg"] });
  noC("promotions", "a deleted file outside photos", base, clone(base), /only a photos pull request may add or delete files/, { deleted: ["public/images/sp-x.jpg"] });
  noC("photos", "a price in an alt", P, edit(P, (p) => { p.slots["home.hero"].alt = "Massage for \u{00A3}35"; }), /price or currency/, x);
}

// ================================================================ the failure comment the shop system parses
// Every marker line in the workflow carries reason= right after stage=, from a fixed list per stage.
{
  const yml = readFileSync(path.join(root, ".github/workflows/auto-merge-shop-agent.yml"), "utf8");
  const lines = yml.split("\n").filter((l) => l.includes("shop-agent-merge-failed stage="));
  const MARK = /shop-agent-merge-failed stage=(\S+) reason=(\S+) concern=/;
  test("workflow: every marker line has reason= right after stage=", () => {
    assert.ok(lines.length >= 4, `expected the header and three comment lines, found ${lines.length}`);
    for (const l of lines) assert.ok(MARK.test(l), `no stage=... reason=... concern= in:\n${l.trim()}`);
  });
  const bodies = lines.filter((l) => l.includes("gh pr comment")).map((l) => MARK.exec(l)?.slice(1, 3).join(" "));
  test("workflow: stage=check reason=check, stage=publish reason=publish, stage=merge reason=$REASON", () => {
    assert.deepEqual(bodies.sort(), ["check check", "merge $REASON", "publish publish"]);
    for (const l of lines.filter((x) => x.includes("gh pr comment"))) {
      assert.ok(/stage=\S+ reason=\S+ concern=\$\{CONCERN:-unknown\} sha=\$SHA run=\$RUN"$/.test(l.trim()), `tokens out of order in:\n${l.trim()}`);
    }
  });
  test("workflow: the merge reason is moved, lookup or refused", () => {
    const from = yml.indexOf('case "$REASON" in');
    const step = yml.slice(from, yml.indexOf("esac", from));
    for (const r of ["moved)", "lookup)", "*)      REASON=refused;"]) assert.ok(step.includes(r), `no ${r} in the reason case`);
    assert.ok(/echo "reason=moved"/.test(yml) && /echo "reason=lookup"/.test(yml), "the base step sets moved and lookup");
  });
}

console.log(`shop-agent diff rules: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);

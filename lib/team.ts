import data from "@/data/team.json";

// The team on the website comes from data/team.json, which the shop's own system (KBOT)
// owns and opens pull requests against — the same arrangement as promotions and vacancies.
// They hold who works here and who has agreed to appear; this room holds how it looks.
//
// The file carries no legal names, dates of birth, addresses, phone numbers, email addresses,
// anything financial, and no internal staff numbers. That is their rule and their check runs
// before a pull request is opened; the checks below are this side of the same fence, because
// a rule enforced at one end only is a rule until someone changes the other end. This
// repository is public, so everything in this file can be read by anyone.

export type Member = {
  id: string;
  display_name: string;
  role: string;
  bio: string;
  languages: string[];
  specialties: string[];
  /** Optional: a member may appear without a portrait. */
  photo?: string;
  order: number;
};

const ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const BIO_MAX = 200;
const LANGUAGES_MAX = 5;
const SPECIALTIES_MAX = 6;

// Field names that must never appear, whatever they hold. Checked by name rather than by
// content because a name is what a future change would add, and a value is what it would
// hide. KBOT refuses to send these; this refuses to render them.
const FORBIDDEN = [
  "legal_name", "full_name", "surname", "last_name", "dob", "date_of_birth", "birthday",
  "address", "postcode", "phone", "mobile", "email", "nin", "ni_number", "national_insurance",
  "bank", "account", "sort_code", "salary", "pay", "staff_number", "employee_number",
  "treatwell_id", "treatwell_staff_id",
];

function fail(code: string, why: string): never {
  throw new Error(`data/team.json: ${code}: ${why}`);
}

function isText(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function validate(raw: unknown): Member[] {
  const list = (raw as { members?: unknown }).members;
  if (!Array.isArray(list)) fail("(file)", "`members` must be a list");
  const seen = new Set<string>();
  const members = list.map((m: Record<string, unknown>, i) => {
    const id = isText(m.id) ? m.id : fail(`#${i + 1}`, "`id` is missing");
    if (!ID.test(id)) fail(id, "`id` must be lowercase letters, numbers and hyphens — it becomes a file name");
    if (seen.has(id)) fail(id, "`id` is used twice");
    seen.add(id);
    for (const key of FORBIDDEN) {
      if (key in m) fail(id, `\`${key}\` must never be in this file — it is public`);
    }
    for (const key of ["display_name", "role", "bio"]) {
      if (!isText(m[key])) fail(id, `\`${key}\` must be non-empty text`);
    }
    if ((m.bio as string).length > BIO_MAX) fail(id, `\`bio\` is longer than ${BIO_MAX} characters`);
    for (const [key, max] of [["languages", LANGUAGES_MAX], ["specialties", SPECIALTIES_MAX]] as const) {
      const v = m[key];
      if (!Array.isArray(v) || !v.every(isText)) fail(id, `\`${key}\` must be a list of text`);
      if (v.length > max) fail(id, `\`${key}\` has more than ${max} entries`);
    }
    if (typeof m.order !== "number") fail(id, "`order` must be a number");
    if (m.photo !== undefined) {
      if (!isText(m.photo) || !(m.photo as string).startsWith("/images/team/")) {
        fail(id, "`photo` must be a path under /images/team/ — the folder the shop's system owns");
      }
      if (!(m.photo as string).endsWith(".jpg")) fail(id, "`photo` must be a .jpg");
    }
    return m as unknown as Member;
  });
  return members.sort((a, b) => a.order - b.order);
}

const members = validate(data);

/** The team, in display order. */
export function teamMembers() {
  return members;
}

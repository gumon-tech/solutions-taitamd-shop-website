# QUEUE-WEB — คิวงานเว็บไซต์ taitam-d.com

> เจ้าของคิว: **ห้อง Taitam-D Shop Lead** (Lead + Concept · ได้อำนาจเต็มจากเจ้าของ 2026-08-09)
> กติกา: [`../../CLAUDE.md` §วิธีทำงาน](../../CLAUDE.md) → กติกากลางที่ `solution-taitamd-platform/docs/dev/ai-agent-operating-rules.md`
> คิวนี้คือ **source of truth** ของงานเว็บ — ห้องอื่นส่ง request มาที่ห้องนี้ แล้ว Lead เป็นคนลงแถว

**สถานะที่ใช้:** 🟡 queued · 🔄 in-progress · ⏸ hold (ติดคนอื่น/รอเคาะ) · ✅ done
**Claim:** Executor เขียน `owner=EX-n` ในช่อง owner ของแถวตัวเองเป็นงานแรก แล้ว commit+push ทันที · push ชน = มีคน claim ก่อน → หยุดและรายงาน

---

## คิวปัจจุบัน

| # | งาน | สถานะ | owner | โซนไฟล์ | verify gate | หมายเหตุ |
|---|---|---|---|---|---|---|
| W-3 | ย้าย lint จาก `next lint` ไป ESLint CLI | 🟡 queued | — | `package.json` · `.eslintrc.json` | `npm run build && npm run lint` | `next lint` deprecated **จะถูกถอดใน Next 16** ⇒ verify gate ตาม D-W4 จะพังเงียบตอน upgrade · codemod: `npx @next/codemod@canary next-lint-to-eslint-cli .` · ยังไม่ด่วน (ตอนนี้เขียว) แต่ต้องทำ**ก่อน**แตะ Next major |

## เสร็จแล้ว

| # | งาน | ปิดเมื่อ | หลักฐาน |
|---|---|---|---|
| W-6 | lockfile สองใบ ⇒ ของที่ verify ในเครื่อง ≠ ของที่ CI deploy | 2026-08-09 | เจอตอนสำรวจก่อนทำ W-3 (จะเพิ่ม devDependency แล้วมันจะลงแค่ lockfile ใบเดียว) · **วัดจริง**: CI `next 15.5.12`/`react 19.2.4`/`eslint 9.39.2` vs เครื่อง `15.5.22`/`19.2.8`/`9.39.5` · ตาม [D-W8](DECISIONS-BOARD.md) ลบ `pnpm-lock.yaml` แล้ว `npm ci` ⇒ เครื่องตรงกับ CI ทุกตัว · verify: `npm run build` ✓ 11 หน้า · `npm run lint` ✓ · visual gate 3301 ✓ (6 หน้า 200 ครบ · หน้า /services/ render เต็ม · cookie banner ทำงาน · console ไม่มี error) — **รอบนี้คือ gate แรกที่รันบน dependency ชุดเดียวกับที่ขึ้นเว็บจริง** |
| W-5 | `sitemap.xml` ลิสต์ URL แบบไม่มี trailing slash ทั้งที่เว็บ serve แบบมี ⇒ ทุก URL เป็น redirect | 2026-08-09 | request จากห้อง Marketing Lead (audit production) · **วัดซ้ำเองก่อนเชื่อ**: `/services` `/story` `/contact` `/book` `/cookies` ตอบ 301 ไป `…/` ทั้งหมด มีแต่ `/` ที่ 200 ตรง ⇒ **5 URL ไม่ใช่ 4 (Marketing ตกหล่น `/cookies`)** · ต้นเหตุ: [`app/sitemap.ts`](../../app/sitemap.ts) เขียนแบบไม่มี slash ขณะที่ `next.config.mjs` ตั้ง `trailingSlash: true` และ canonical บนหน้าก็เป็นแบบมี slash · verify: `npm run build` ✓ 11 หน้า · `npm run lint` ✓ no warnings · visual gate 3301 ✓ (หน้าแรก render ครบ · cookie banner ทำงาน · console ไม่มี error) · ยืนยันผลจริงจาก sitemap ที่ build ออกมา slash ครบทั้ง 5 |
| W-0 | รับโอนความรับผิดชอบเว็บไซต์จากห้อง Marketing Lead + เข้า Gumon Lore + วางกติกา Lead/Executor | 2026-08-09 | Marketing ยืนยันหยุดแก้ repo · `lore-add` สำเร็จ (14 โปรเจกต์) · `CLAUDE.md` มีกฎ 4 ข้อ + delta กติกา |
| W-2 | commit `CLAUDE.md` + `docs/plans/` เข้า repo | 2026-08-09 | verify เขียวก่อน push ตาม D-W4/D-W5 (`npm run build` ✓ 11 หน้า · `npm run lint` ✓ no warnings) · stage ราย path ตาม §11.17 |
| W-4 | ลบ workflow ที่ deploy ซ้ำ — เหลือ `nextjs.yml` ตัวเดียว | 2026-08-09 | ลบ `.github/workflows/pages.yml` ตาม D-W6 · ยืนยันหลัง push ว่าเหลือ **run เดียว** ต่อ push และเว็บ live ยังปกติ |
| W-1 | รับจัดสรร port band + สร้าง `.claude/launch.json` | 2026-08-09 | ได้ **3300–3399** จากห้อง Local Dev Lead (บันทึกใน `gumon-localdev/registry.json → devServerPorts`) · เติม `distDir` ให้ `next.config.mjs` รองรับ `NEXT_DIST_DIR` (ไม่ตั้ง env = `.next` เหมือนเดิม) · เติม `.next-*` ใน `.gitignore` (`.next` ไม่ match `.next-claude`) · **พิสูจน์แล้ว**: `preview_start` ขึ้น 3300 · หน้าแรก render ครบ · cookie banner ทำงาน · หยุด server + คืนไฟล์ + ยืนยันพอร์ตปิดด้วย `lsof` |

---

## ของที่ยังไม่มีในคิว (สำรวจแล้ว ณ 2026-08-09)

- **Meta Pixel — ปิดเรื่องแล้ว ไม่ลงคิว** · เจ้าของเคาะ "ยังไม่ยิง Meta ads" และ Marketing ยกเลิก
  คำขอเอง ⇒ **ห้ามแตะ tag layer** ดู [D-W7](DECISIONS-BOARD.md) · ผลประเมินเก็บไว้ใน [`HANDOFF.md §3`](HANDOFF.md)
- **`phone_click` / `whatsapp_click` ไม่ใช่งาน** — พิสูจน์แล้วว่าทำงานถูก ห้ามแก้ ดู [`HANDOFF.md §3`](HANDOFF.md)
- **Academy launch 16 ส.ค.** — ยังไม่มีทราฟฟิกมาฝั่งเว็บร้านตามข้อตกลง ⇒ ยังไม่มีงานเว็บ
- **PMax รันอยู่** ชี้ที่ apex `https://taitam-d.com/` ⇒ งานที่กระทบ **น้ำหนักหน้าแรกและ LCP** ให้ถือว่า priority สูงเสมอ

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
| W-1 | จอง port band + สร้าง `.claude/launch.json` | ⏸ hold | — | `.claude/launch.json` | `preview_start` ขึ้นที่พอร์ตที่ได้รับจัดสรร | ติด **ห้อง Local Dev Lead** (`~/dev/gumon-localdev`) — เป็นผู้ถือทะเบียนพอร์ตรวมของทุกโปรเจกต์บนเครื่อง (เจ้าของสั่ง 2026-08-09) · **ห้ามรัน dev server จนกว่าจะได้พอร์ตจัดสรร** — เดา band เองเสี่ยงชน session อื่น · ดู D-W2 |
| W-3 | ย้าย lint จาก `next lint` ไป ESLint CLI | 🟡 queued | — | `package.json` · `.eslintrc.json` | `npm run build && npm run lint` | `next lint` deprecated **จะถูกถอดใน Next 16** ⇒ verify gate ตาม D-W4 จะพังเงียบตอน upgrade · codemod: `npx @next/codemod@canary next-lint-to-eslint-cli .` · ยังไม่ด่วน (ตอนนี้เขียว) แต่ต้องทำ**ก่อน**แตะ Next major |

## เสร็จแล้ว

| # | งาน | ปิดเมื่อ | หลักฐาน |
|---|---|---|---|
| W-0 | รับโอนความรับผิดชอบเว็บไซต์จากห้อง Marketing Lead + เข้า Gumon Lore + วางกติกา Lead/Executor | 2026-08-09 | Marketing ยืนยันหยุดแก้ repo · `lore-add` สำเร็จ (14 โปรเจกต์) · `CLAUDE.md` มีกฎ 4 ข้อ + delta กติกา |
| W-2 | commit `CLAUDE.md` + `docs/plans/` เข้า repo | 2026-08-09 | verify เขียวก่อน push ตาม D-W4/D-W5 (`npm run build` ✓ 11 หน้า · `npm run lint` ✓ no warnings) · stage ราย path ตาม §11.17 |

---

## ของที่ยังไม่มีในคิว (สำรวจแล้ว ณ 2026-08-09)

- **ห้อง Marketing ไม่มีงานเว็บค้าง** — `git status` clean ตรง remote · commit ล่าสุด `f0d86a0`
- **Academy launch 16 ส.ค.** — ยังไม่มีทราฟฟิกมาฝั่งเว็บร้านตามข้อตกลง ⇒ ยังไม่มีงานเว็บ
- **PMax รันอยู่** ชี้ที่ apex `https://taitam-d.com/` ⇒ งานที่กระทบ **น้ำหนักหน้าแรกและ LCP** ให้ถือว่า priority สูงเสมอ

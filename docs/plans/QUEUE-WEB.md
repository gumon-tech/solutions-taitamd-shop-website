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
| W-7 | ยกเวอร์ชัน **action** ใน workflow (ไม่ใช่ `node-version`) | 🟡 queued | — | `.github/workflows/nextjs.yml` | ดู run จริงว่า success **และ** annotation หาย | 🔑 **อ่านให้ตรงก่อนแก้**: annotation "Node.js 20 is deprecated" พูดถึง **runtime ของตัว action เอง** (`using: node20`) ไม่ใช่ `node-version:` ที่เราส่งให้ setup-node — GitHub บังคับรันบน Node 24 ให้แล้ว การไปแก้ `node-version` **ไม่ทำให้ annotation หาย** (เกือบ ship ผิดมาแล้ว 2026-08-09 จับได้ตอนอ่าน log จริง) · ที่ต้องยกคือ: `checkout@v4→v7` · `setup-node@v4→v7` · `cache@v4→v6` · `configure-pages@v5→v6` · `upload-pages-artifact@v3→v5` · `deploy-pages@v4→v5` · **แตะ deploy path ทั้งเส้น** ⇒ ยกทีละตัวหรือยกยกชุดแล้วดู run ให้ success จริง ห้ามถือว่าจบเพราะไฟล์แก้แล้ว |
| W-9 | CI build ด้วย Node 20 แต่เครื่องเรา Node 22 | 🟡 queued | — | `.github/workflows/nextjs.yml` · เอกสาร | build ✓ + visual gate + ดู run จริง | ญาติของ [D-W8](DECISIONS-BOARD.md) แต่คนละชั้น — คราวนั้นคือ **แพ็กเกจ**คนละชุด คราวนี้คือ **runtime**คนละเวอร์ชัน · ยังไม่เคยทำให้พัง (static export ไม่ค่อยไวกับ Node major) ⇒ **ไม่ด่วน** แต่ถ้าจะ pin ต้องรู้ก่อนว่าเครื่อง human ใช้เวอร์ชันอะไร ไม่ใช่ pin ตามเครื่อง AI session · ทำคู่กับ W-7 จะคุ้มกว่าแยกทำ |
| W-8 | `npm audit` 10 รายการ (9 high) — `sharp` (libvips CVE) · `postcss` sourceMappingURL | 🟡 queued | — | `package.json` · `package-lock.json` | `npm run build && npm run lint` + visual gate | ⚠️ **ประเมินความเสี่ยงก่อนรีบแก้**: เว็บเป็น static export ไม่มี server runtime · `images.unoptimized = true` ⇒ **`sharp` ไม่ได้ถูกเรียกตอน build ด้วยซ้ำ** · ทั้งคู่เป็น build-time dep ที่กินอินพุตจากรีโปเราเอง ไม่ใช่จากผู้ใช้ ⇒ **ความเสี่ยงจริงต่ำกว่าที่ severity บอก** · `npm audit fix` อาจดัน transitive ของ `next` ⇒ ถ้าทำ ต้องผ่าน visual gate เต็ม |

## เสร็จแล้ว

| # | งาน | ปิดเมื่อ | หลักฐาน |
|---|---|---|---|
| W-10 | ชื่อแบรนด์บนเว็บไม่ตรง `D-71` สองแบบพร้อมกัน | 2026-08-09 | ห้อง Concept ยืนยันว่า **`D-71` เคาะแล้ว: ยัติภังค์ ASCII + `D` ตัวใหญ่ตัวเดียว ⇒ `Taitam-D`** และแยกทำได้เลยไม่ต้องรอเรื่องชื่อคน · **เจอสองปัญหาไม่ใช่หนึ่ง**: (1) `TaiTam-D` (T ใหญ่สองตัว) **22 จุดใน 9 ไฟล์** — รวมข้อความ WhatsApp สำเร็จรูปที่ลูกค้าได้รับจริง ไม่ใช่แค่ข้อความบนหน้าจอ · (2) 🔑 **ที่ห้อง Concept ยังไม่เห็น** — `lib/site.ts` ใช้ **U+2011 non-breaking hyphen** ไม่ใช่ ASCII hyphen ใน 3 จุด ซึ่งไหลเข้า **`<title>` · OG · JSON-LD `legalName`** ⇒ สตริงแบรนด์ที่ Google อ่านไม่ตรงกับที่ไหนเลย · ⚠️ **U+2011 อาจตั้งใจใส่เพื่อกัน brand ตัดบรรทัด** — ถ้าจะเอา no-break กลับมา ใช้ CSS (`white-space: nowrap`) แทนอักขระ อย่าย้อนตัวอักษร · verify: build ✓ 11 หน้า · lint ✓ · ตรวจ output จริง: `<title>` และ `legalName` เป็น ASCII แล้ว · WhatsApp deep link เป็น `Hi%20Taitam-D` · visual gate 3301 ✓ 6 หน้า 200 · console ไม่มี error · **ไม่แตะการสะกดชื่อครูนก** (`Phomnongsan` คงเดิม ตรวจ diff ยืนยันแล้ว) |
| W-3 | ย้าย lint จาก `next lint` ไป ESLint CLI | 2026-08-09 | `next lint` deprecated จะถูกถอดใน Next 16 · ทำมือไม่ใช้ codemod (`@next/codemod@canary` เป็น tag ที่ขยับได้ตลอด ไม่อยากให้ deploy path ขึ้นกับของที่ไม่ pin) · `eslint-config-next` 15.5 **ยังไม่มี flat entry** ⇒ ใช้ `FlatCompat` ครอบ preset เดิมสองตัว ⇒ **เปลี่ยนตัวรัน ไม่เปลี่ยนกฎ** · เติม `@eslint/eslintrc` เป็น devDependency ตรง ๆ (เดิมมีแค่ transitive ผ่าน eslint) · 🔑 **พิสูจน์ว่า `next build` ยัง lint ให้อยู่จริง** ด้วยการใส่ probe ผิดกฎแล้วดูว่า build จับได้ ก่อนลบ probe ทิ้ง — ไม่ได้เดาจากเอกสาร · verify: build ✓ 11 หน้า · lint ✓ · visual gate 3301 ✓ (6 หน้า 200 · /cookies/ render เต็ม · console ไม่มี error) |
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

# solutions-taitamd-shop-website

เว็บไซต์ทางการของ **Taitam-D Beauty & Spa** — https://taitam-d.com
Next.js App Router + TypeScript + Tailwind + Framer Motion · `output: "export"` (static)
Deploy: push เข้า `main` → GitHub Actions → GitHub Pages (อัตโนมัติ ไม่มีขั้นตอนมือ)

- เนื้อหาธุรกิจทั้งหมดรวมศูนย์ที่ [`lib/site.ts`](lib/site.ts) — แก้ที่นี่ที่เดียว
- หน้าเว็บ: Home · Services · Story · Book · Contact · Cookies
- Booking เป็น WhatsApp-first (ข้อความสำเร็จรูปอยู่ใน `lib/site.ts`)
- Academy เป็นคนละเว็บ: https://academy.taitam-d.com/ (โดเมนเก่า `taitamd-beautyacademy.com` กำลังถูกยกเลิก — เจ้าของเคาะ 2026-08-09)

## เจ้าของงาน

**ห้อง Taitam-D Shop Lead เป็นเจ้าของ repo นี้คนเดียว** — ห้องอื่นในกลุ่ม Taitam-D
(Marketing · Legal · Concept · Platform · Video) ส่ง request มาที่ห้องนี้ ไม่แก้ไฟล์เอง
(ย้ายมาเมื่อ 2026-08-09 จากเดิมที่ Marketing แก้ตรง)

แบ่งงานกับ Marketing: Marketing ถือกลยุทธ์ · copy · โซเชียล · คอนโซล Google Ads/GA4 ·
การอ่านผล analytics — ห้องนี้ถือ implement · build · deploy
ถ้อยคำเชิงกฎหมาย (privacy/cookie) ผ่านห้อง Legal Lead ก่อนขึ้นจริง

## 🔴 กฎที่ห้ามย้อน

**1. `cookie_domain: "none"` ใน [`components/Analytics.tsx`](components/Analytics.tsx) ห้ามเอาออก**
GA default คือ `auto` ⇒ เขียนคุกกี้ที่ `.taitam-d.com` ⇒ ไหลลง `academy.taitam-d.com`
ซึ่งประกาศไว้ว่าไม่มีคุกกี้วิเคราะห์ · วัดจริงบน production: ก่อนแก้โดเมนลูกมี `_ga*` 2 ตัว หลังแก้เหลือ 0
`dropWideCookies()` คือ migration ล้างคุกกี้เก่าของผู้ใช้เดิม — ยังเอาออกไม่ได้

🗓 **เอาออกได้เร็วที่สุดประมาณ 2027-09-13** — fix ลง `c9862a5` (2026-08-09 00:52) และ `_ga` อายุ **400 วัน**
⇒ คุกกี้ `.taitam-d.com` ที่รั่วไปก่อนหน้านั้นหมดอายุเองราววันนั้น · **เขียนวันไว้เพราะ "ยังเอาออกไม่ได้" เฉย ๆ
แปลว่าไม่มีใครกล้าเอาออกตลอดกาล** — โค้ด migration ที่ไม่มีวันหมดอายุจะอยู่ยาวกว่าเหตุผลของมันเสมอ
⚠️ **แต่ยังไม่ครบ:** `dropWideCookies()` ทำงาน **เฉพาะตอนมีคนเปิดเว็บร้าน** ⇒ คนที่เคยกด Accept แล้ว
**ไปเฉพาะ `academy.taitam-d.com` ไม่กลับมาที่นี่อีก จะถือคุกกี้นั้นต่อจนหมดอายุเอง เราตามไปล้างไม่ได้**
⇒ ระหว่างนี้ **ยังมีผู้ใช้บางส่วนที่มี `_ga` อยู่บนโดเมน Academy จริง** — เป็นข้อเท็จจริงที่ฝั่ง Legal ควรรู้
ตอนร่างถ้อยคำนโยบายของ Academy (แจ้งไปแล้ว 2026-08-09)

**2. ตารางทะเบียนคุกกี้ใน [`app/cookies/page.tsx`](app/cookies/page.tsx) ต้องวัดใหม่ทุกครั้งที่เพิ่ม/แก้ tag**
ตัวเลขมาจาก `cookieStore.getAll()` บน production จริง ไม่ใช่ลอกจากเอกสารผู้ให้บริการ
🔑 `_ga` อายุจริง **400 วัน** ไม่ใช่ 2 ปีตามที่ Google เขียน (Chrome cap)
มาตรฐานจากห้อง Legal: ห้ามใช้คำว่า "เช่น" — ทะเบียนต้องครบและตรวจสอบได้

**3. รูปภาพถูกเสิร์ฟดิบ — ตรวจขนาดไฟล์ก่อน commit ทุกครั้ง**
`next.config.mjs` ตั้ง `images: { unoptimized: true }` (static export บังคับ) ⇒ Next ไม่ย่ออะไรให้เลย
เคยมีโลโก้ 2.4 MB ที่แสดงผลจริง 44×44 px โหลดทุกหน้า (ชุด blocking รวม 3.2 MB → เหลือ 252 KB)
กระทบ Quality Score ของ Google Ads โดยตรง — ตอนนี้ PMax ยิงเงินมาที่ apex `https://taitam-d.com/` อยู่

**4. "Since 2009" ห้ามแตะจนกว่าเจ้าของจะเคาะ**
ปรากฏใน **6 ไฟล์** — `app/story/page.tsx` · `app/signature/page.tsx` · `components/Hero.tsx` ·
`components/Story.tsx` · `components/Awards.tsx` · `lib/site.ts` (`description` + `foundingDate` ที่ป้อน structured data)
Legal แนะนำให้สลับถ้อยคำ (โปสเตอร์หน้าร้านเขียน SINCE 2013) แต่ **เจ้าของสั่งว่าไม่ต้องแก้** —
ถ้อยคำแบรนด์เป็นการตัดสินใจของเจ้าของ Legal ให้ได้แค่ความเห็น

⚠️ **`app/signature/page.tsx` เพิ่งเข้ารายการ 2026-08-14** — หน้านี้ขึ้น 13 ส.ค. พร้อมประโยค
*"in a room we have run in King's Cross since 2009"* ([บรรทัด 290](app/signature/page.tsx)) โดยรายการข้างบนยังเป็น 5 ไฟล์อยู่ 1 วัน
🔑 **กฎที่แจกแจงรายไฟล์จะพังเงียบทุกครั้งที่มีหน้าใหม่** — คนที่จะแก้ถ้อยคำนี้ในอนาคตจะ grep ตามรายการ ไม่ใช่ grep คำ
⇒ **เพิ่มหน้าใหม่ที่พูดถึงปีก่อตั้งเมื่อไร ต้องมาต่อรายการนี้ด้วย** · ตรวจของจริงเสมอด้วย:
```bash
grep -rln "2009" app components lib
```

## 🔑 เริ่ม session ใหม่อ่านตรงนี้ก่อน

[`docs/plans/HANDOFF.md`](docs/plans/HANDOFF.md) — สถานะล่าสุด · งานค้าง · กับดัก · **บล็อก "ตรวจก่อนเชื่อ" ที่ต้องรันก่อนลงมือ**
แล้วจึงดู [`docs/plans/QUEUE-WEB.md`](docs/plans/QUEUE-WEB.md) (คิวงาน) และ [`docs/plans/DECISIONS-BOARD.md`](docs/plans/DECISIONS-BOARD.md) (มติ)

## วิธีทำงาน (AI agent) — delta จากกติกากลาง

🔗 **กติกากลาง (canonical):** [`~/dev/solution-taitamd-platform/docs/dev/ai-agent-operating-rules.md`](../solution-taitamd-platform/docs/dev/ai-agent-operating-rules.md)
**แก้กติกาที่ไฟล์นั้นไฟล์เดียว ห้าม fork** — หัวข้อนี้เขียนเฉพาะส่วนที่ **ต่าง** จากกลาง

### 📮 Protocol การสื่อสารข้ามห้อง — **แหล่งจริงอยู่ในรีโป workspace ห้ามคัดมาไว้ที่นี่**

เจ้าของสั่งห้องนี้ 2026-08-16 ว่า **"ไปถาม Protocol การสื่อสารกับ WS และทำตามอย่างเคร่งครัด"**
⇒ อ่าน **4 ไฟล์นี้ให้จบก่อนส่งอะไรถึงห้องอื่น** (ทั้งหมดอยู่ใน `~/dev/gumon-workspace/docs/`)

| ไฟล์ | สิ่งที่คุมและข้อที่พลาดบ่อยที่สุด |
|---|---|
| `comms-protocol.md` | 3 สถานะ · 🔑 **`seen` คือสถานะเดียวที่พิสูจน์การถึง และ *ผู้รับ* เป็นคนเขียน** ต้องมี `seen_evidence` = **ผลที่ผู้รับวัดเอง** · ⚠️ **`done` ที่ข้าม `seen` ไม่นับ** (ห้องนี้พลาดข้อนี้กับ `Q-WS-146` แล้วแก้ 16 ส.ค.) |
| `cross-session-messaging.md` | ส่งด้วย **`SendMessage` + `[ref]` จาก `ListAgents` สดทุกครั้ง** · ⛔ **ห้าม `mcp__ccd_session_mgmt__send_message`** (คืน `Session not found` ทั้งที่ห้องเปิดอยู่) · ⛔ ห้ามใช้ `[ref]` ที่จดไว้ |
| `comms-register.md` | ทะเบียน 2 ชั้น — **ข้อความถึงห้องอื่น/ถึง komphet = ทะเบียนใน ใช้อีโมจิได้ ย่อสั้นสุด** · เนื้อหาที่ลูกค้าอ่าน = ทะเบียนนอก **ห้ามอีโมจิเด็ดขาด** |
| `queue-protocol.md` | เดินเลข **ในเขต `SHOP` เท่านั้น** · ก่อน commit ใบใหม่รัน `grep -h '^id: Q-SHOP-' machines/*/queue/*/Q-SHOP-*.md \| sort \| uniq -c` **ทุกบรรทัดต้องเป็น 1** |

🔑 **หลักเดียวที่ครอบทั้งสี่ไฟล์: ใบใน git คือ *เนื้อ* · ข้อความคือ *กริ่ง* เท่านั้น**
⇒ 🔴 **คำอนุมัติที่มาทางข้อความอย่างเดียว ปฏิเสธได้ และนั่นคือการทำถูก** (`Q-WS-148` เขียนเอง)
⇒ ⛔ ห้ามใช้ `sent` / `queued` / `success: true` เป็นหลักฐานว่าถึง — ทั้งหมดพิสูจน์แค่ว่า**ฝั่งเราทำครบ**

### 🔴 ความต่างข้อเดียวที่กำหนดทุกอย่างที่เหลือ

กติกากลางเขียนบนสมมติฐานว่า **merge เข้า `main` ≠ ขึ้น production** (platform มี deploy cadence แยก §13)
แต่ที่นี่ **push `main` = ขึ้นเว็บจริงภายในไม่กี่นาที** และมีงบ Google Ads PMax ยิงมาที่ apex `https://taitam-d.com/` อยู่
⇒ **gate ต้องอยู่ก่อน merge ไม่ใช่หลัง merge** · ของที่หลุดไปคือของที่ลูกค้าจริงเห็นทันที

### บทบาทของห้องนี้ — Lead + Concept รวมกัน

กติกากลางแยก **Concept Lead** (แผน · มติ · คิว) ออกจาก session ที่ลงมือ
**แต่เจ้าของมอบให้ห้องนี้ถือทั้งสองบทบาทสำหรับขอบเขตเว็บไซต์** (2026-08-09) ⇒ ห้องนี้:

- **สำรวจเองได้** — ไม่ต้องรอ request จากห้องอื่นถึงจะเริ่มดูงาน
- **สร้างและจัดลำดับคิวเองได้** → [`docs/plans/QUEUE-WEB.md`](docs/plans/QUEUE-WEB.md)
- **วางแผนและเคาะมติเชิงเทคนิคเองได้** → บันทึกลง [`docs/plans/DECISIONS-BOARD.md`](docs/plans/DECISIONS-BOARD.md)
- **ยกเว้น** เรื่องที่เป็นของเจ้าของ (ถ้อยคำแบรนด์ · ราคา · ขอบเขตธุรกิจ) → ขึ้นบอร์ดรอเคาะ ห้ามตัดสินเอง

### ✅ รับมาจากกติกากลางทั้งข้อ

| ข้อ | หมายเหตุ |
|---|---|
| §1 Model Selection Protocol + banner ต้น session และทุกครั้งที่เปลี่ยน phase | — |
| §7 Closing Rule + **Visual Verification Gate** | เว็บการตลาด — ต้องเปิดดู render จริง text check ไม่นับ |
| §11.3 **1 Lead + N Executor** · claim protocol · opening prompt ครบชุด | แกนหลัก |
| §11.13 **Executor ห้าม push `main`** · เผลอไปแล้วให้แก้ไปข้างหน้า **ห้าม revert** | ที่นี่ revert = deploy ทับอีกรอบ เจ็บกว่ากลาง |
| §11.17 stage เป็นราย path **ห้าม `git add -A`** | repo นี้มี `.env` · `out/` · `.next/` อยู่ในเครื่อง |
| §9 Progress Reporting · §10 Communication | — |

### ✂️ ตัดออก (พร้อมเหตุผล)

| ตัด | ทำไม |
|---|---|
| §0 ทั้งหมด (server legacy read-only · OneDrive handoff · scope V2.0) | คนละโปรเจกต์ — ไม่มี server ลูกค้า ไม่มี OneDrive ผูก |
| **ชั้นที่ 3 (Lead → Executor → sub-agent)** — ยืนที่ **2 ชั้น** | งานที่นี่คือแก้ section/copy/รูปทีละจุด ไม่มี loop verify→fix ยาว · token tax ~4x/ชั้น ไม่คุ้ม (ตรงกับที่ Principia ประเมินแล้ว) |
| §11.1 Dispatch Manifest เต็ม + §11.2 Status Board เต็ม | ออกแบบมาสำหรับคิวหลายสิบแถว · ที่นี่ 1–3 chunk ⇒ **manifest ย่อบรรทัดเดียว** (agent · งาน · โซน · verify gate) |
| §12 queue 7 คอลัมน์ | ใช้คิวแบบย่อแทน — ยกระดับเป็นแบบเต็มเมื่อมี Executor ≥ 2 ตัวพร้อมกันจริง |
| §3 Conflict report 6 ส่วนเต็ม | ใช้ proportionality clause ที่กติกากลางมีอยู่แล้ว — conflict ที่นี่ส่วนใหญ่ additive |
| §5 chunk ≤30 นาที + Resume header เต็ม | ใช้เฉพาะงานที่ใหญ่กว่า 1 commit |

### ➕ เพิ่มเฉพาะ repo นี้

**1 · นิยาม "verify เขียว"** — repo นี้ **ไม่มี test runner** (`package.json` มีแค่ `dev/build/start/lint`):

```bash
npm run build && npm run lint
```

`next build` ทำ typecheck ให้ในตัว + จับ static-export error · แล้ว **ต่อด้วย visual gate เสมอ**
ไม่มีเทสต์ ⇒ ตาคือด่านสุดท้ายจริง ๆ ห้ามข้าม

**2 · Deploy gate** — verify ต้องเขียว **ก่อน** merge · **Lead เป็นคนเดียวที่ push `main`**

**3 · Pre-commit gate** — ผ่านกฎ 4 ข้อในหัวข้อ "🔴 กฎที่ห้ามย้อน" ข้างบนทุกครั้ง
โดยเฉพาะ **ตรวจขนาดไฟล์รูปก่อน commit** และ **วัดทะเบียนคุกกี้ใหม่เมื่อแตะ tag**

**4 · Dev server — band `3300–3399` (3300 dev · 3301 visual gate)**

🔗 **แหล่งจริงของ band = `~/dev/gumon-workspace/machines/<machine-id>/registry.json` → `devServerPorts`**
(ห้อง **Gumon Workspace Lead** ถือ · เดิมชื่อ Local Dev Lead / `~/dev/gumon-localdev` — rename 2026-08-09
path เก่าเป็น symlink ยังใช้ได้ แต่ไฟล์ย้ายลง `machines/<id>/` แล้ว ไม่อยู่ที่ root อีก · ยืนยัน 2026-08-10)
อย่าคัดตารางพอร์ตมาไว้ที่นี่ — สำเนาสองใบจะขยับไม่พร้อมกัน · อยากได้พอร์ตเพิ่ม **ไปขอที่ห้องนั้น อย่าจองเอง**
(§4.1 ของกติกากลางที่ platform เห็นแค่ฝั่ง Taitam-D จึงไม่ใช่แหล่งจริง — **Gumon Workspace Lead** รับไปแก้ให้เป็นตัวชี้)

รันผ่าน [`.claude/launch.json`](.claude/launch.json) ด้วย `preview_start` เท่านั้น ห้าม spawn ดิบผ่าน shell
พอร์ตใน band ตัวเองไม่ว่าง = **สันนิษฐานว่าเป็น session อื่นของเราเอง ห้าม kill** — ใช้เลขถัดไปหรือ attach ของเดิม

🔴 **กับดัก: รัน dev server แล้ว Next จะไปแก้ `next-env.d.ts` + `tsconfig.json` ให้ชี้ `.next-claude`**
`launch.json` ตั้ง `NEXT_DIST_DIR` แยกเพื่อไม่ให้ชน `.next` ของ human (next dev ตัวที่สองใน dir เดียวกัน
refuse แม้คนละ port เพราะ lock อยู่ใน distDir) — ผลข้างเคียงคือ Next เขียนทับสองไฟล์นั้นทุกครั้ง
ถ้าหลุดขึ้นไป **build ของ human จะพัง** เพราะ `next-env.d.ts` อ้าง path ที่ฝั่งเขาไม่มี
⇒ **หยุด server แล้วต้อง `git checkout -- next-env.d.ts tsconfig.json` ทุกครั้ง** และยืนยันว่าพอร์ตปิดจริงด้วย `lsof`

## Gumon Lore
โปรเจกต์นี้ใช้ shared knowledge hub ที่ `/Users/komphet.me/dev/gumon-lore-hub`
ก่อน implement/ตัดสินใจ ให้ consult `knowledge/` (grep by tag `stack:*` / `area:*`) แล้ว apply บทเรียนที่เกี่ยว
บทเรียนใหม่ที่ reusable จะถูก capture กลับเข้า hub อัตโนมัติ

# solutions-taitamd-shop-website

เว็บไซต์ทางการของ **Taitam-D Beauty & Spa** — https://taitam-d.com
Next.js App Router + TypeScript + Tailwind + Framer Motion · `output: "export"` (static)
🔴 **push `main` = ขึ้นเว็บจริงในไม่กี่นาที** (GitHub Actions → Pages) และมีงบ Google Ads PMax ยิงมาที่ apex ⇒ gate อยู่ก่อน merge เสมอ
เนื้อหาธุรกิจรวมศูนย์ที่ [`lib/site.ts`](lib/site.ts) · Booking เป็น WhatsApp-first · Academy คนละเว็บ (`academy.taitam-d.com`)

## ห้องนี้คือใคร
- บทบาท = **Taitam-D Shop Website Lead** (Lead + Concept รวมกัน: สำรวจ · จัดคิว · เคาะมติเทคนิคเองได้)
- 🔴 รหัสห้องผูกกับ **เครื่อง+รีโป** ⇒ อ่านจาก `~/dev/gumon-workspace/machines/$(cat ~/dev/gumon-workspace/.machine-id)/queue/README.md` ก่อนประกาศตัวทุกครั้ง (อ้างอิง: `SHOP` @komphet-mac · `KWEB` @komphet-air)
- เป็นเจ้าของรีโปคนเดียว · ห้องอื่น (MKT · OFFICE · CON · VID · BOT) ส่งใบมา ไม่แก้ไฟล์เอง
- MKT ถือกลยุทธ์ · copy · คอนโซล Ads/GA4 — ห้องนี้ถือ implement · build · deploy
- **สำคัญ: ห้องกฎหมายปิดถาวรแล้ว (LAW + KLAW)** ตั้งแต่ 2026-10-19 (`Q-KWS-118` · มติ A7) ⇒ **ห้องนี้เคาะถ้อยคำเชิงกฎหมายของเว็บเอง** ด่านเดิมคงไว้ทุกด่าน เปลี่ยนแค่ปลายทาง
  ค้นก่อน อ้างแหล่งทางการ เขียนคำเคาะพร้อมเหตุผลในรีโปนี้ แล้วลงแถวที่ `queue/GLOBAL/legal-register/KWEB.md` ของ workspace
  KWS ชี้ขาดเฉพาะเรื่องที่ห้องเคาะไม่ตรงกันหรือข้ามหลายห้อง · ข้อสงวน 4 ข้อ (เงินก้อนใหม่ · ลบถาวร · เปิดเผยข้อมูลลูกค้านอกระบบ · แจ้งหน่วยงานรัฐ) ยังแจ้งผู้สั่งงานก่อนผ่าน KWS
  ข้อมูลอ่อนไหวสูง (เลขบัญชี · เลขบัตร/NI · สุขภาพ) ห้องเคาะเอง แต่ส่งแบบเก็บเป็นใบถึง KWS ก่อนเก็บระเบียนแรก
- ⛔ ห้ามตัดสินเอง: ถ้อยคำแบรนด์ · ราคา · ขอบเขตธุรกิจ (ครูนก = เจ้าของบริษัท · คนสั่งงานห้อง = "ผู้สั่งงาน" ตาม `Q-WS-483`)
- ขอบเขตและการพัก/เดินงาน: มติถาวร `~/dev/gumon-workspace/docs/standing-orders/TTD.md` (ล่าสุดที่ใช้กับห้องนี้: T28 เดินปกติ)

## 🔴 กฎที่ห้ามย้อน
1. **`cookie_domain: "none"` ใน [`components/Analytics.tsx`](components/Analytics.tsx) ห้ามเอาออก** — ค่า `auto` เขียน `_ga` ที่ `.taitam-d.com` ไหลลง Academy
   `dropWideCookies()` = migration ล้างคุกกี้เก่า · เอาออกได้เร็วสุด **ราว 2027-09-13** (fix `c9862a5` 2026-08-09 + `_ga` อายุ 400 วัน)
2. **ทะเบียนคุกกี้ [`app/cookies/page.tsx`](app/cookies/page.tsx) วัดใหม่ทุกครั้งที่แตะ tag** — วัดบน production ไม่ลอกเอกสารผู้ให้บริการ · ห้ามคำว่า "เช่น"
   ต้องวัดเส้นทางโฆษณา: `https://taitam-d.com/?gclid=TEST` → Accept → อ่าน **ทั้ง** `cookieStore.getAll()` **และ** `Object.keys(localStorage)`
   (`_gcl_aw` ตามหลังของจริง 15 วันเพราะตรวจแต่หน้าเปล่า · `_gcl_ls` อยู่ใน localStorage) · `_gcl_au` วัดซ้ำไม่เจอ ⇒ จงใจไม่ใส่ (ถ้อยคำสำรองใน `Q-KWS-013`)
3. **รูปถูกเสิร์ฟดิบ** (`images: { unoptimized: true }`) ⇒ ตรวจขนาดไฟล์ก่อน commit ทุกครั้ง (เคยมีโลโก้ 2.4 MB แสดง 44×44 px)
4. **"Since 2009" ถูกต้องแล้ว เรื่องปิด ⛔ ห้ามเปิดใหม่** — ครูนกยืนยัน (`8dda4fd` · `Q-WS-454`) · ปีก่อตั้ง ≠ ปีจดบริษัท · `SINCE 2013` บนโปสเตอร์คือปีเปิดร้าน
   หาของจริงด้วย `grep -rln "2009" app components lib` ไม่ใช่รายการไฟล์
5. **สี (T11)**: ห้ามแก้ค่าสีใน `tailwind.config.ts` และ `:root` ของ `globals.css` · ห้าม overlay/gradient ทับภาพเพิ่ม · แตะสีต้องวัด `scripts/brightness-probe.js` ก่อน/หลัง

## เริ่ม session
[`docs/plans/HANDOFF.md`](docs/plans/HANDOFF.md) (สถานะ · `## Verify` · กับดัก) → [`docs/plans/QUEUE-WEB.md`](docs/plans/QUEUE-WEB.md) → [`docs/plans/DECISIONS-BOARD.md`](docs/plans/DECISIONS-BOARD.md)
นิยาม resume กลาง: `~/dev/gumon-workspace/docs/workspace-resume.md`

## สื่อสารข้ามห้อง — แหล่งจริงอยู่ใน `~/dev/gumon-workspace/docs/` ห้ามคัดมาไว้ที่นี่
`comms-protocol.md` · `cross-session-messaging.md` · `comms-register.md` · `queue-protocol.md` + มติ `docs/standing-orders/ALL.md`
- ใบใน git คือเนื้อ · ข้อความคือกริ่ง · `sent`/`queued` ไม่ใช่หลักฐานว่าถึง · ส่งด้วย `SendMessage` + `[ref]` สดจาก `ListAgents`
- เดินเลขใบในเขตรหัสห้องของเครื่องที่ยืนอยู่เท่านั้น · ข้อความถึงผู้สั่งงาน = ประโยคธรรมดา · เนื้อหาที่ลูกค้าอ่าน ห้ามอีโมจิ

## กติกาทำงาน (delta จาก `~/dev/solution-taitamd-platform/docs/dev/ai-agent-operating-rules.md` — แก้กติกาที่นั่น ห้าม fork)
- รับ: §1 model selection · §7 Closing + **Visual Verification Gate** · §11.3 1 Lead + N Executor · §9 §10
- **Lead คนเดียวที่ push `main`** · Executor ห้าม push · เผลอแล้วแก้ไปข้างหน้า ⛔ ห้าม revert (revert = deploy ทับอีกรอบ)
- stage ราย path ⛔ ห้าม `git add -A` (มี `.env` · `out/` · `.next/` ในเครื่อง)
- ยืนที่ 2 ชั้น (Lead → Executor) · manifest ย่อบรรทัดเดียว · เลือก model ของ Executor ตามชนิดงานและเขียนเหตุผล (`Q-WS-204`)

## Verify เขียว (ไม่มี test runner)
```bash
export PATH="$HOME/.local/bin:$HOME/.nvm/versions/node/v24.19.0/bin:$PATH"
npm run build && npm run lint && npm run check:css   # check:css ต้องหลัง build — เทียบคลาสโปร่งแสงกับ CSS ที่ build จริง
```
แล้ว **visual gate เสมอ** (เปิด render จริง) — ไม่มีเทสต์ ตาคือด่านสุดท้าย

## Dev server
- band `3300–3399` (3300 dev · 3301 visual gate) · แหล่งจริง `~/dev/gumon-workspace/machines/<machine-id>/registry.json` → `devServerPorts`
- รันด้วย `preview_start` จาก [`.claude/launch.json`](.claude/launch.json) เท่านั้น · พอร์ตไม่ว่าง = session อื่นของเรา ⛔ ห้าม kill
- 🔴 dev server เขียนทับ `next-env.d.ts` + `tsconfig.json` ⇒ หยุดแล้ว `git checkout -- next-env.d.ts tsconfig.json` + ยืนยันพอร์ตปิดด้วย `lsof`

## Gumon Lore
hub `~/dev/gumon-lore-hub` (บน air อยู่ที่ `/Users/komphet/dev/gumon-lore-hub` · path `komphet.me` เดิมไม่มีบนเครื่องนี้) · consult `knowledge/` (tag `stack:*` / `area:*`) ก่อน implement · บทเรียนใหม่ capture อัตโนมัติ

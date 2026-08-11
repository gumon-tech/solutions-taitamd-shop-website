# ตั้งเครื่องใหม่ให้ทำงานรีโปนี้ต่อได้

> เขียน **2026-08-11** ตอนส่งมอบเครื่อง `komphet-mac` ตาม [`machine-handover.md`](../../gumon-workspace/docs/machine-handover.md) ข้อ 6
> 🔑 *ความรู้เรื่อง "เครื่องนี้ต้องตั้งอะไรบ้าง" อยู่ในหัวคนที่ตั้งมันเมื่อหลายเดือนก่อน ไม่ได้อยู่ในไฟล์ไหนเลย* — ไฟล์นี้แก้ข้อนั้น

## ✅ ข่าวดีก่อน: รีโปนี้ **แทบไม่ต้องตั้งอะไรเลย**

**ไม่มี** ฐานข้อมูล · **ไม่มี** container · **ไม่มี** stack กลาง · **ไม่มี** ความลับที่จำเป็นต่อการ build/deploy
เป็น static site ล้วน ⇒ **สิ่งที่ต้องมีคือ Node กับ git**

```bash
git clone git@github.com:<org>/solutions-taitamd-shop-website.git
cd solutions-taitamd-shop-website
npm ci                      # ⛔ ห้าม pnpm / yarn — เหตุผลข้างล่าง
npm run build && npm run lint
```

**ผ่านทั้งสองคำสั่ง = เครื่องพร้อมทำงาน** ไม่ต้องทำอะไรต่อ

## 🔴 สี่ข้อที่ต้องรู้ ไม่งั้นจะเสียเวลาหรือทำของพัง

### 1 · `npm` เท่านั้น — ห้าม `pnpm install` เด็ดขาด
CI ตรวจ package manager แบบ *"มี `yarn.lock` ไหม ถ้าไม่มีก็ `npm ci`"* ⇒ **มันไม่รู้จัก pnpm**
ถ้าลง dep ด้วย pnpm แล้ว `package-lock.json` ไม่ขยับตาม **CI จะ build ด้วยของคนละชุดกับที่เรา verify**
เคยแตกมาแล้วจริง: CI ได้ `next 15.5.12` แต่เครื่องได้ `15.5.22` ⇒ **gate เป็นโมฆะเงียบ ๆ** (ดู `D-W8`)

### 2 · Node **major 22** ให้ตรงกับ CI
CI ตั้ง `node-version: "22"` ([`nextjs.yml`](../.github/workflows/nextjs.yml)) · เครื่องเก่าใช้ `v22.14.0`
**ตรงกันแค่ระดับ major พอ และตั้งใจไม่ pin ถึง patch** เพราะจะค้างทันทีที่เครื่องอัปเดต
🔑 **gate ที่รันคนละ runtime กับ deploy คือ gate ครึ่งใบ** (`D-W8`)

### 3 · dev server ต้องผ่าน [`.claude/launch.json`](../.claude/launch.json) เท่านั้น
ห้าม spawn ดิบผ่าน shell · **band พอร์ตของโปรเจกต์นี้ต้องขอใหม่จากห้อง Gumon Workspace Lead บนเครื่องใหม่**
(บนเครื่องเก่าคือ `3300–3399` — **ตัวเลขนี้ผูกกับเครื่อง ไม่ใช่กับโปรเจกต์ อย่ายกมาใช้เอง**)
แหล่งจริงของ band = `gumon-workspace/machines/<machine-id>/registry.json → devServerPorts`

🔴 **กับดักที่ต้องรู้ก่อนรัน dev ครั้งแรก**: `launch.json` ตั้ง `NEXT_DIST_DIR` แยกเพื่อไม่ให้ชน `.next` ของ human
⇒ **Next จะเขียนทับ `next-env.d.ts` + `tsconfig.json` ให้ชี้ distDir นั้นทุกครั้ง**
⇒ **หยุด server แล้วต้อง `git checkout -- next-env.d.ts tsconfig.json` เสมอ** ไม่งั้น build ของคนอื่นพัง
⇒ และ **ผลลัพธ์ static export จะไม่ลง `out/`** แต่ไปกองใน distDir นั้น ⇒ **`out/` ในเครื่องจะเป็นของเก่าที่หลอกตา**

### 4 · push `main` = **ขึ้นเว็บจริงภายในไม่กี่นาที**
ไม่มีขั้นตอนมือ · ไม่มี staging · **และมีงบ Google Ads PMax ยิงมาที่ apex `https://taitam-d.com/` อยู่**
⇒ **verify ต้องเขียวก่อน merge เสมอ** และ **Lead เป็นคนเดียวที่ push `main`** (`D-W5`)
⇒ **ไม่มี test runner** ⇒ *"verify เขียว"* = `npm run build && npm run lint` **+ เปิดดู render จริง (visual gate)** — ตาคือด่านสุดท้าย (`D-W4`)

## 🔑 อ่านอะไรต่อ ตามลำดับ

| ลำดับ | ไฟล์ | ได้อะไร |
|---|---|---|
| 1 | [`../CLAUDE.md`](../CLAUDE.md) | กติกาของรีโป + **กฎ 4 ข้อที่ห้ามย้อน** |
| 2 | [`plans/HANDOFF.md`](plans/HANDOFF.md) | สถานะล่าสุด + **บล็อก `## Verify` ที่ต้องรันก่อนลงมือ** + กับดัก |
| 3 | [`plans/QUEUE-WEB.md`](plans/QUEUE-WEB.md) | คิวงาน (ตอนส่งมอบ: `W-18` hold · `W-19` queued) |
| 4 | [`plans/DECISIONS-BOARD.md`](plans/DECISIONS-BOARD.md) | มติที่เคาะแล้ว **ห้ามรื้อโดยไม่อ่าน** |
| 5 | [`MEMORY-shop.md`](MEMORY-shop.md) | 🔴 **วิธีทำงานกับ Kom** — กู้จากโค้ดไม่ได้ มีที่นี่ที่เดียว |
| 6 | [`secrets-inventory.md`](secrets-inventory.md) | ความลับมีอะไร ขอจากไหน (**ไม่มีตัวไหนจำเป็นต่อ deploy**) |

## ⚠️ สิ่งที่ **ไม่** ได้เดินทางมากับรีโป

| ของ | ทำยังไง |
|---|---|
| `.env` (3 ตัวแปร Gemini) | **ไม่ต้องรีบ** — ไม่มีโค้ดในรีโปอ่านมัน · ขอใหม่เมื่อจะสร้างภาพจริง ๆ ([`secrets-inventory.md`](secrets-inventory.md)) |
| `node_modules` · `.next*` · `out/` | ถัง D — `npm ci` สร้างใหม่ได้หมด |
| memory ของห้อง (`~/.claude/projects/…`) | คัดมาไว้ที่ [`MEMORY-shop.md`](MEMORY-shop.md) แล้ว ⇒ **ใช้เป็นวัตถุดิบเขียน memory ใหม่ แล้วตรวจกับโค้ดก่อนเชื่อ** |
| ประวัติแชทของ session | หายถาวร — **นี่คือเหตุผลที่ทุกอย่างถูกเขียนลง `docs/plans/`** |

## Verify — รันบนเครื่องใหม่แล้วต้องได้ตามนี้

```bash
node -v                                   # ต้องขึ้นต้นด้วย v22
ls package-lock.json                      # ต้องมี · และต้องไม่มี pnpm-lock.yaml / yarn.lock
npm ci && npm run build && npm run lint   # ต้องผ่านทั้งหมด · build ได้ 11 หน้า
git status --porcelain                    # ต้องว่างหลัง build (out/ กับ .next ถูก ignore)
curl -s -o /dev/null -w "%{http_code}\n" https://taitam-d.com/    # 200 = เว็บจริงยังปกติ
```

**ถ้า `npm run build` พังแต่ `git status` โชว์ `next-env.d.ts` หรือ `tsconfig.json` ถูกแก้**
= มีคนรัน dev server แล้วไม่ได้คืนไฟล์ ⇒ `git checkout -- next-env.d.ts tsconfig.json` แล้วลองใหม่

# HANDOFF — ห้อง Taitam-D Shop Lead

> เขียนไว้ตอนหยุดงาน **2026-08-09** (เครดิตใกล้หมด · เจ้าของสั่งให้ standby จนกว่าจะบอก "เริ่มต่อได้")
>
> 🔴 **เอกสารนี้คือ snapshot ไม่ใช่สถานะสด** — ทุกข้อด้านล่างจริง ณ เวลาที่เขียน
> **session ถัดไป: รันบล็อก "ตรวจก่อนเชื่อ" ให้จบก่อนลงมือ** ข้อไหนพิสูจน์ว่าไม่จริงแล้ว **ลบทิ้งทันที อย่าปล่อยให้ค้าง**

---

## 0 · ตรวจก่อนเชื่อ (รันก่อนทำอะไรทั้งสิ้น)

```bash
git -C ~/dev/solutions-taitamd-shop-website status -sb   # คาดหวัง: clean · ตรง origin/main
git -C ~/dev/solutions-taitamd-shop-website log --oneline -3
gh run list --limit 3                                     # คาดหวัง: 1 run ต่อ push ทุกครั้ง
lsof -nP -iTCP:3300 -iTCP:3301 -sTCP:LISTEN               # คาดหวัง: ว่าง
curl -s -o /dev/null -w "%{http_code}\n" https://taitam-d.com/   # คาดหวัง: 200
```

**ณ เวลาที่เขียน:** working tree clean · ตรง `origin/main` · HEAD = `726e4d2` · ไม่มี dev server ค้าง · `next-env.d.ts` กับ `tsconfig.json` สะอาด · เว็บ live 200 ทุกหน้า

---

## 1 · ห้องนี้คือใคร (อ่าน [`../../CLAUDE.md`](../../CLAUDE.md) ให้ครบก่อน)

**Taitam-D Shop Lead** — เจ้าของ repo เว็บไซต์ taitam-d.com **คนเดียว**
ถืออำนาจ **Lead + Concept รวมกัน** (เจ้าของมอบ 2026-08-09) ⇒ สำรวจเอง · สร้าง/จัดลำดับคิวเอง · เคาะมติเชิงเทคนิคเองได้
**ยกเว้น** มติที่เป็นของเจ้าของธุรกิจ (ถ้อยคำแบรนด์ · ราคา · ขอบเขตธุรกิจ) → ขึ้น [`DECISIONS-BOARD.md`](DECISIONS-BOARD.md) รอเคาะ

ห้องอื่นส่ง request มาที่นี่ ไม่แก้ repo เอง — Marketing Lead ยืนยันรับทราบแล้ว

---

## 2 · ทำอะไรไปแล้วใน session นี้ (4 commit)

| commit | เรื่อง |
|---|---|
| `7199546` | วางกติกา Lead/Executor (delta ชี้ไปไฟล์กลาง ไม่ fork) + กฎ 4 ข้อที่ห้ามย้อน + สร้างคิวและบอร์ดมติ |
| `6585eaa` | รับ port band `3300–3399` + ทำ `distDir` ให้สลับได้ + `.gitignore` `.next-*` |
| `726e4d2` | ลบ `pages.yml` — เดิม 2 workflow แย่ง deploy กันจนผลขึ้นกับจังหวะ |
| — | เข้า Gumon Lore (`lore-add`) · ⚠️ **hook เต็มที่ต่อเมื่อเปิด session ใหม่** |

---

## 3 · งานค้าง

### 🟡 W-3 — ย้าย lint จาก `next lint` ไป ESLint CLI (งานเดียวที่ค้างจริง)

`next lint` deprecated **จะถูกถอดใน Next 16** ⇒ verify gate ตาม D-W4 (`npm run build && npm run lint`) จะพังเงียบตอน upgrade
ตอนนี้ยังเขียวอยู่ **ไม่ด่วน** แต่ต้องทำ **ก่อน** แตะ Next major
codemod: `npx @next/codemod@canary next-lint-to-eslint-cli .`

### ⏸ รอเจ้าของ — D-W1 "Since 2009"

**เจ้าของสั่งว่าไม่ต้องแก้** · Legal เคยแนะนำให้สลับถ้อยคำ (โปสเตอร์หน้าร้านเขียน SINCE 2013)
🔑 **ถ้าห้อง Legal ทักมาเรื่องนี้อีก — อย่าแก้ รอเจ้าของเคาะเท่านั้น**

### ❌ ไม่มีงานค้างจากห้องอื่น

Marketing ไม่มีงานเว็บค้าง (ยืนยันแล้ว) · Academy launch 16 ส.ค. ยังไม่มีทราฟฟิกมาฝั่งเว็บร้าน

---

## 4 · เรื่องที่ห้องอื่นค้างอยู่ ไม่ใช่ของเรา (อย่าไปทำแทน)

| เรื่อง | อยู่ที่ใคร |
|---|---|
| ให้ §4.1 ของ `solution-taitamd-platform` เปลี่ยนเป็น **ตัวชี้** มาที่ `gumon-localdev/registry.json` แทนการเป็นสำเนา | **Local Dev Lead** รับไปแล้ว — เขาบอกชัดว่า **เราไม่ต้องไปขอ Platform Lead เอง** |
| แจ้ง `solutions-c2-rice-flow-mobile` และ `vera-d` ว่า bind พอร์ตทับ band คนอื่น | **Local Dev Lead** |
| mark `whatsapp_click` เป็น Key event + import เป็น conversion (งานในคอนโซล ไม่แตะ repo) | **Marketing Lead** |

---

## 5 · กับดักที่จะเจอถ้าไม่รู้

1. **รัน dev server แล้ว Next เขียนทับ `next-env.d.ts` + `tsconfig.json`** ให้ชี้ `.next-claude`
   หลุด commit ขึ้นไป = **build ฝั่ง human พัง** ⇒ หยุด server แล้ว `git checkout -- next-env.d.ts tsconfig.json` **ทุกครั้ง** + ยืนยันพอร์ตปิดด้วย `lsof`
2. **push `main` = deploy ขึ้นเว็บจริงทันที** และมีงบ PMax ยิงมาที่ apex อยู่ ⇒ verify เขียว **ก่อน** merge เสมอ
3. **ไม่มี test runner** ⇒ `npm run build && npm run lint` + **visual gate** คือทั้งหมดที่มี ตาคือด่านสุดท้ายจริง
4. **ห้าม `git add -A`** — repo มี `.env` · `out/` · `.next*` อยู่ในเครื่อง stage เป็นราย path เสมอ
5. **ห้ามคัดตารางพอร์ตมาเก็บใน repo นี้** — แหล่งจริงคือ `gumon-localdev/registry.json → devServerPorts`

---

## 6 · เริ่มงานต่อยังไง

1. รันบล็อก §0 · ข้อไหนไม่ตรง **แก้เอกสารนี้ก่อน** แล้วค่อยทำงาน
2. อ่าน [`CLAUDE.md`](../../CLAUDE.md) → [`QUEUE-WEB.md`](QUEUE-WEB.md) → [`DECISIONS-BOARD.md`](DECISIONS-BOARD.md)
3. มีงานค้าง → ทำต่อ · ไม่มี → **standby** รอ request จากเจ้าของหรือห้องอื่น

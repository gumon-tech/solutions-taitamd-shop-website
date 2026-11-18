# ข้อความหน้าเว็บ — `data/copy.json`

หัวข้อ ย่อหน้านำ และข้อความบนการ์ดของหน้าแรก หน้า contact และหน้า book เก็บเป็นแผนที่แบนของ "ช่อง" (slot) ชื่อ → ข้อความ ใต้คีย์ `slots` คู่กับ `updated_at` (เวลาแก้ล่าสุด UTC) · รูปไฟล์เดียวกับเว็บ Sri Siam ระบบร้านจึงเขียนได้ด้วยโค้ดชุดเดียว
เช่น `{ "updated_at": "2026-11-19T00:00:00Z", "slots": { "home.hero.h1": "Thai massage and beauty in", ... } }` · ไฟล์ผิดรูป ⇒ `next build` ล้ม ⇒ deploy ไม่เกิด · ตัวตรวจอยู่ที่ `lib/copy.ts`

## กติกา

- **รายการช่องมาจากเว็บ** ที่ `scripts/lib/copy-slots.json` (`{"<key>": {"kind": "line" | "paragraph", "max": <ตัวอักษร>}}`)
  คนหรือบอตแก้ได้เฉพาะ **ค่า** · เพิ่มหรือลบ key ไม่ได้ (key ใต้ `slots` ต้องตรงกับรายการช่องทุกตัว ไม่ขาดไม่เกิน · ระดับไฟล์มีแค่ `updated_at` กับ `slots`)
- `line` = บรรทัดเดียว ห้ามขึ้นบรรทัดใหม่ · `paragraph` = ย่อหน้า (ก็ยังห้ามขึ้นบรรทัดใหม่เปล่า ๆ ซ้อน)
- ทุกค่า: ไม่ว่าง · ไม่เกิน `max` · ห้ามมี `<` `>` · ข้อความล้วน ไม่ใช้ markdown (`*` `` ` `` `[..](..)` `#` ต้นบรรทัด)
- ไม่ใช้อีโมจิ (เนื้อหาที่ลูกค้าอ่าน)
- ตัวแทนค่า: `{{walk_minutes}}` (จาก `SITE.walkMinutes`) · `{{hours}}` (จาก `data/hours.json`) เท่านั้น

## หัวข้อที่มีสีทอง

หัวข้อ `h2` ที่มีคำเน้นสีทองแตกเป็นสองช่อง เช่น `home.cta.h2` ("Book a treatment in") + `home.cta.h2_accent` ("King’s Cross")
เว็บเว้นวรรคให้เอง · `home.awards.h2_end` คือข้อความท้ายหลังคำเน้น (", not claimed.") ใส่เครื่องหมายวรรคตอนเอง

## ที่ไม่อยู่ในไฟล์นี้ (ยังอยู่ในโค้ด)

ปีก่อตั้ง/"Since 2009" · สถิติใน Awards (คำนวณจาก `SITE`) · `SITE.standardsNotice` · ข้อมูลนิติบุคคล · ลิงก์และข้อความ WhatsApp ·
หน้า privacy · cookies · ปุ่มและป้ายสั้นของ UI · หน้า story (มีปีก่อตั้ง)

## ช่องที่มี

ดูรายการเต็มที่ `scripts/lib/copy-slots.json` · กลุ่ม: `home.hero.*` · `home.campaigns.*` · `home.bento.*` (1–6) · `home.services.*` ·
`home.roomband.*` · `home.gallery.*` (หัวข้อ + แผ่น 1–6 `kicker` `title`) · `home.awards.*` · `home.location.*` · `home.cta.*` · `contact.hero.*` · `book.hero.*`

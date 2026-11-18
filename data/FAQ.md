# คำถามที่พบบ่อย — `data/faq.json`

คำถาม-คำตอบทุกชุดบนเว็บอยู่ไฟล์นี้ · ข้อมูล structured data `FAQPage` สร้างจากรายการเดียวกัน (ข้อความที่คนอ่านกับที่ Google อ่านจึงไม่แยกกัน)
ไฟล์ผิดรูป ⇒ `next build` ล้ม ⇒ deploy ไม่เกิด · ตัวตรวจอยู่ที่ `lib/faq.ts`

## โครง

| ช่อง | ความหมาย |
|---|---|
| `shop` | ชุดของร้าน แสดงบนหน้าแรกและหน้า massage-kings-cross |
| `massage_expectation` | คำตอบ "What should I expect during a massage?" บนหน้า services · ย่อหน้าแรกต้องตรงกับ `SITE.standardsNotice` ใน `lib/site.ts` ทุกตัวอักษร (ตัวตรวจฟ้องถ้าไม่ตรง) |
| `pages` | ชุดต่อหน้า ใช้ชื่อโฟลเดอร์ของหน้า: `nails-kings-cross` `facial-kings-cross` `waxing-kings-cross` `lash-extensions-kings-cross` `deep-tissue-massage-kings-cross` `signature` `services` |

## แต่ละคำถาม (ครบทุกช่อง ไม่มีช่องอื่น)

| ช่อง | ความหมาย |
|---|---|
| `id` | ตัวพิมพ์เล็ก ตัวเลข ยัติภังค์ ไม่เกิน 60 · ไม่ซ้ำในชุดเดียวกัน |
| `q` | คำถาม ไม่เกิน 160 ตัวอักษร |
| `a` | คำตอบ ข้อความเดียว หรือรายการย่อหน้า (ไม่เกิน 6) · ย่อหน้าละไม่เกิน 700 ตัวอักษร |

ทุกข้อความ: ไม่ว่าง · ห้ามมี `<` `>` · ไม่ใช้ markdown · อ้างได้เท่าที่ร้านยืนยันแล้ว (คำตอบ FAQ คือคำสัญญาล่วงหน้า)

## ตัวแทนค่า (token)

ใส่ในคำตอบได้เฉพาะชุดนี้ build แทนค่าให้ · ใช้ token อื่น ⇒ build ล้ม

| token | ค่า | มาจาก |
|---|---|---|
| `{{hours}}` | `10:30am to 9:00pm` | `data/hours.json` |
| `{{walk_minutes}}` | `5` | `SITE.walkMinutes` ใน `lib/site.ts` |
| `{{address}}` | `72-74 Caledonian Road, King's Cross, London, N1 9DN` | `SITE.address` |

เขียนเวลาเปิดร้านเป็นตัวเลขตรง ๆ ในคำตอบไม่ได้ผล ⇒ ใช้ `{{hours}}` เสมอ จะได้ตามไฟล์ `hours.json`

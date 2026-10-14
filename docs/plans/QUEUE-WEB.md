# QUEUE-WEB — คิวงานเว็บไซต์ taitam-d.com

> เจ้าของคิว: ห้อง Taitam-D Shop Website Lead (Lead + Concept) · ห้องอื่นส่ง request มา Lead เป็นคนลงแถว
> สถานะ: queued · in-progress · hold · แถวที่ปิดแล้วย้ายออกจากไฟล์นี้
> Claim: Executor เขียน `owner=EX-n` ในแถวตัวเองเป็นงานแรก แล้ว commit+push · push ชน = มีคน claim ก่อน ให้หยุดและรายงาน
> ขอบเขต (Q-WS-209): ก่อนหยิบแถว ตอบให้ได้ว่ารับใช้ Platform หรือ A1 ตรงไหน ตอบไม่ได้ = รอ

## คิวปัจจุบัน (วัด 2026-10-14)

| # | งาน | สถานะ | โซนไฟล์ | verify gate | หมายเหตุ |
|---|---|---|---|---|---|
| — | ถอดการ์ดโปร 3 แบบของครูนกหลังหมดเขต | queued · ถึงกำหนดหลัง 2026-10-16 (ซ่อนตัวเองแล้วตั้งแต่ `2026-10-16T23:00Z` · `f5d8d3e`) | `components/Campaigns.tsx` · `components/OffersGate.tsx` · `lib/offers.ts` · `components/Hero.tsx` | build + lint + visual gate หน้าแรก 1440/375 + apex 200 หลักแสน | ถอดหรือเปลี่ยนการ์ด แล้วลบ gate ทั้งสองไฟล์และ `<OffersGate>` ใน Hero · โปรใหม่ต้องมาจากครูนก/OFFICE |
| — | เปลี่ยนภาพ AI ใบสุดท้ายเป็นรูปจริง | hold · ไม่มีนาฬิกา เปลี่ยนเมื่อมีรูปจริง (WS เคาะใน `Q-SHOP-020`) | `components/Contact.tsx` · `public/images/contact/contact-ritual-gemini.jpg` | build + lint + `check:assets` + visual gate | วัดเองทุกครั้ง: `grep -rl gemini components app` · `find public/images -name '*gemini*' -exec du -k {} +` (วันนี้ 1 ไฟล์) · แจ้ง MKT ก่อนสลับภาพบนหน้าที่มีงบ PMax |
| W-18 | ไฟล์กำพร้าใน `public/` เหลือ 19 ไฟล์ · 3.3 MB (เดิม 30 · 20.5 MB · ลบ 11 ไฟล์ 17.17 MB แล้วที่ `846c614`) | hold · รอคำตอบข้อเท็จจริงจากเจ้าของ 2 ข้อ | `public/` เท่านั้น | `npm run check:assets` (คาด: 19 known orphans, 0 new) + `curl` ยืนยัน 404 และหน้าที่เหลือ 200 | (1) `treatwell/` 14 ใบ เราถ่ายเองหรือของ Treatwell (ถ้าของเขา เป็นเรื่องสิทธิ์) (2) `founder-860x1260.jpg` (รูปบุคคล) ลบได้ไหม · ที่เหลือ `academy-2/3` · `lashes` อาจตั้งใจเอากลับมาใช้ · รายการเต็ม [`ORPHANED-ASSETS.md`](ORPHANED-ASSETS.md) · ห้ามลบเองก่อนได้คำตอบ |
| W-23 | เกณฑ์ `LAW`: "สองรายการบนหน้าเดียวกันต้องคำนวณเข้ากันได้" (เคสจริง: คำโปรยสัญญา workbook 4 ชื่อ แต่ฐานมีไฟล์แนบ 0 · `Q-SHOP-006`) | hold · ตอบคำถาม Q-WS-209 ไม่ได้ และเคสจริงอยู่ฝั่ง Academy | ยังไม่กำหนด | ต้องพิสูจน์ว่าจับเคสจริงได้ก่อนเชื่อ | ตั้งใจไม่ยัดเข้าด่านไฟล์กำพร้า (`W-19` · `scripts/check-orphan-assets.mjs`) เพราะด่านเชิงกลที่แม่นจะถูกลากลงมาเท่าด่านความหมาย · น่าจะเป็นงานของ `ACAD` ห้องนี้ให้แบบตัวสแกน + self-test ได้ถ้าขอ |

## รอคนอื่น (ไม่ใช่แถวงาน ห้ามเดา)

```
ครูนก          ใบปลิวซาวน่า "worth £35" ไม่มีในเมนู (components/Campaigns.tsx:56)
OFFICE         FAQ 2 ข้อ: จ่ายบัตร · บัตรของขวัญ ⇒ เติม components/ShopFaq.tsx
OFFICE+เจ้าของ  ซ่อนรายการ Botox ใน Treatwell Connect (วิดเจ็ต /book/)
MKT            geo / Search Console (รอสิทธิ์)
```

PMax ยิงที่ apex `https://taitam-d.com/` ⇒ งานที่กระทบน้ำหนักหน้าแรกและ LCP ถือว่า priority สูงเสมอ

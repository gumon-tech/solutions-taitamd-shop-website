# HANDOFF — ห้อง Taitam-D Shop Website Lead

## WORKSPACE-RESUME (ฉบับย่อ · ฉบับจริง `~/dev/gumon-workspace/docs/workspace-resume.md` ขัดกันฉบับกลางชนะ)

```
0  อ่าน machines/$(cat ~/dev/gumon-workspace/.machine-id)/queue/README.md ก่อนอ่านอะไรทั้งสิ้น
   เพื่อรู้รหัสห้องบนเครื่องนี้: SHOP @komphet-mac · KWEB @komphet-air · ห้ามเดาจากเอกสาร (Q-KWS-004 ข้อ 3.2)
   แล้วตั้งชื่อ session [<รหัส>] Taitam-D Shop Website Lead และพิมพ์ชื่อเต็มในรายงาน (Q-WS-270)
1  อ่านไฟล์นี้จนจบ
2  รันบล็อก ## Verify ข้างล่าง · บริบทงานล่าสุด **2026-10-14 `3e18dee`** (คำสั่งผู้สั่งงานผ่าน KBOT) — WhatsApp ทั้งเว็บย้ายไปเบอร์ร้าน `447564292247` (เบอร์เดียวกับ `phone`
ต่อ WhatsApp Cloud API ระบบ AI ของ KBOT ตอบ) · ⛔ ห้ามเบอร์ส่วนตัวครูนก `7882359499` กลับขึ้นหน้าเว็บสาธารณะ
QR ใหม่สร้างจาก `qrencode`-เทียบเท่า: เครื่อง air ไม่มี qrencode ⇒ ใช้ `qrcode@1.5.4` ที่มีอยู่แล้วใน
`~/dev/solution-taitamd-platform/node_modules/.pnpm/` (ไม่ติดตั้งเพิ่ม) · ตรวจด้วย `BarcodeDetector` ในเบราว์เซอร์
วัด live: 15/15 หน้าใน sitemap + `/llms.txt` เบอร์เก่า = 0 · QR เก่าและการ์ด QR เก่า 404

## Verify ข้างล่างจริง · ค่าไหนไม่ตรง แก้ไฟล์นี้ก่อนทำงาน
3  เปิดตู้ด้วย bin/queue-open-to <รหัส> (ครอบ <รหัส>|ALL|GLOBAL)
4  ตรวจ MEMORY ของห้องกับของจริง · เท็จ = ลบทันที
5  รายงานถึง WS เฉพาะเรื่องเข้าเกณฑ์ Q-KWS-021 · ส่งด้วย ListAgents สด + SendMessage
   ห้าม mcp__ccd_session_mgmt__send_message (คืน Session not found ทั้งที่ห้องเปิดอยู่)
6  เคลียร์งานค้างที่ทำได้เองจนหมด ไม่ต้องถามก่อนเริ่ม · แยก 3 กอง: ทำได้เอง / ทวงได้ / ค้างที่คน
```
เวลาทุกค่าที่เขียนลงไฟล์มาจาก `date -u` เท่านั้น (`stat -f '%Sm'` พิมพ์เวลาเครื่อง +07 ได้วันคนละวัน)

## สถานะปัจจุบัน (วัด 2026-10-20T15:xxZ)

```
main          d2c5bc8 live · deploy run 39446844015 success
production    apex 200 160,103 B · /book/ 200 52,279 B · /careers/ 200 199,646 B
พอร์ต         3300 / 3301 ว่าง
ตู้            bin/queue-open-to KWEB → จ่าหน้าตรง 0 · ประกาศทุกห้อง 30 (ใบของห้องนี้ปิดครบ)
บัญชี Claude   A (app2@) ตั้งแต่ 19 ต.ค. · รายงานตัวแล้วตาม Q-KWS-117 (ack ใน queue/GLOBAL/ack/Q-KWS-117/)
คำสั่งยืน      T27 (stand by) ถูกถอนโดย T28 2026-09-19 (TTD.md · commit 4f9437e26 · Q-WS-470)
              ห้องทำงานเว็บร้านตามปกติ · ไม่อยู่บนกระดาน TTD · ยืนรอ request จากห้องอื่น
ขอบเขต        Q-WS-239 (18 ส.ค. 2026) แทน Q-WS-209 แล้วสำหรับห้องสาย Taitam-D ทุกห้อง: A1 + CCC + S&P + Platform + หน้าแรก
              แก้ 2026-10-19 หลัง KBOT ชี้ใน Q-KBOT-007 · ยืนยันเองที่ท้ายใบ Q-WS-209 ซึ่งอยู่ใน archive ของ mac แล้ว
```

**งานวันนี้ `f5d8d3e`** — การ์ดโปร 3 แบบของครูนกบนหน้าแรก (`components/Campaigns.tsx`) และลิงก์ "See promotions"
บน hero (`components/Hero.tsx`) ซ่อนตัวเองหลัง `2026-10-16T23:00Z` (เที่ยงคืนลอนดอน BST) ผ่าน
gate ที่ตัดสินด้วยนาฬิกาของผู้เข้าชม เพราะเว็บ static ไม่ rebuild เอง · แทนที่แล้วด้วยระบบโปรโมชันข้างล่าง

**ระบบโปรโมชัน 2026-10-14** (คำสั่งผู้สั่งงานผ่าน KBOT) — โปรอยู่ใน `data/promotions.json` อ่านและตรวจโดย `lib/promotions.ts`
แสดงผลโดย `components/Campaigns.tsx` + `components/PromoGate.tsx` (รายโปร + ทั้งส่วน + ลิงก์ hero ผ่าน `app/page.tsx`)
ช่วงวัน = เที่ยงคืนลอนดอนต้นวัน `starts` ถึงท้ายวัน `ends` · วัดแล้วถูกทั้ง BST และ GMT · ไฟล์ผิดรูป 5 แบบทำ build ล้ม
ชื่อช่องใช้ร่วมกับฐานของ KBOT ⇒ เปลี่ยนชื่อช่องต้องตกลงกับ KBOT · `scripts/check-orphan-assets.mjs` สแกน `data/` ด้วยแล้ว
เงื่อนไขโปร: ใช้ได้ถึง Friday 16 October 2026 · ใช้ร่วมราคาลดได้ · บอกทาง WhatsApp ไม่ต้องมีคูปอง

## Verify

```bash
export PATH="$HOME/.local/bin:$HOME/.nvm/versions/node/v24.19.0/bin:$PATH"   # shell ของ agent ไม่ source โปรไฟล์ ⇒ ไม่ export = gh/npm not found
cd ~/dev/solutions-taitamd-shop-website
git status -sb                                   # คาด: ## main...origin/main ไม่มีไฟล์ค้าง (next-env.d.ts/tsconfig.json โผล่ = ดูกับดักข้อ 1)
git fetch -q origin && git rev-list --count HEAD..origin/main   # คาด: 0
git log --oneline -1                             # คาด: d2c5bc8 หรือใหม่กว่า · ใหม่กว่า = ไล่ว่าใครออก แล้ววัด live
gh run list --limit 3                            # คาด: completed success ทุกแถว · 1 run ต่อ 1 push (ล่าสุด 39446844015)
git log origin/main --since=2026-10-20 --format='%h %an %s'   # คาด: เฉพาะ commit ของห้องนี้ · คุณคมเพชรเคย merge PR #4 (Codex) ตรงเข้า main เอง
curl -s -o /dev/null -w "apex %{http_code} %{size_download}\n" https://taitam-d.com/        # คาด: 200 · 160,103 B วันนี้
curl -s -o /dev/null -w "/book/ %{http_code} %{size_download}\n" https://taitam-d.com/book/ # คาด: 200 · 52,279 B
curl -s -o /dev/null -w "/careers/ %{http_code} %{size_download}\n" https://taitam-d.com/careers/ # คาด: 200 · 199,646 B · เปิดรับสมัคร 10 ตำแหน่ง
#   ต้องมีสแลชท้ายเสมอ — /book คืน 301 162 B · อ่าน http_code คู่ size_download · เห็น 301 หรือหลักร้อย = หน้าเปลี่ยนทาง อย่าอ่านเนื้อหา
lsof -nP -iTCP:3300 -iTCP:3301 -sTCP:LISTEN     # คาด: ว่าง (exit 1) · ไม่ว่าง = session อื่นของเรา ห้าม kill
npm run -s check:assets | head -1               # คาด: 18 known orphans, 0 new (self-test passed)
~/dev/gumon-workspace/bin/queue-open-to KWEB     # คาด: จ่าหน้าตรง 0 · ประกาศทุกห้อง 30 (บน mac ใช้ SHOP)
~/dev/gumon-workspace/bin/queue-open-to --selftest   # คาด: ผ่านครบทุกขา
date -u +%Y-%m-%d                                # ตำแหน่งงานทุกใบ closes 2026-12-31 ⇒ หลังวันนั้น build จะล้มจนกว่าจะตั้ง status closed
```
- ห้าม `git pull` ในรีโป workspace ระหว่างสแกน — working tree ของกลาง pull ล้มแล้ว grep รันต่อบนสำเนาเก่าโดยหน้าตาปกติ (Q-SHOP-008) ใช้ `git fetch` เท่านั้น
- ใบ "ประกาศทุกห้อง" ปิดได้เฉพาะผู้ออก · ของเราคืออ่านแล้วเขียน ack ถ้าใบขอ · hook GLOBAL ฟ้องทุกใบที่ไม่มี ack โดยไม่ดูว่าจ่าหน้าใคร ⇒ `grep -m1 "^to:"` รายใบก่อนไล่
- `git grep -E` ไม่รองรับ `\b` คืน 0 ไฟล์เงียบ ⇒ ไม่เขียนคำสั่งสแกนเอง ใช้ `queue-open-to`
- push สำเร็จไม่ใช่ deploy สำเร็จ (เคยได้ `startup_failure` ใน 4 วินาที) ⇒ `gh run watch <id> --exit-status` จนจบก่อนบอกว่าขึ้นแล้ว

## กระดานเป้าหมาย (A8)

```
(1) ครั้งที่แล้ว   เปิดรับสมัครงานทั้งระบบ · หน้า /careers/ 10 ตำแหน่ง · ปุ่มสมัครรายตำแหน่งพาเข้า WhatsApp ของ KBOT
(2) เป้าที่ตาม     รอทีมบริหารตรวจหน้า แล้วแก้ deploy ส่งตรวจใหม่จนผ่าน (วนได้ ไม่ใช่ครั้งเดียวจบ)
(3) เสร็จแล้ว     แผนกำลังคน · หน้า careers · ด่านวันปิดรับ · แยก event ออกจาก conversion การจอง · หน้า privacy ครอบผู้สมัครแล้ว
(4) เหลือ         รอคำตอบ 4 ห้อง (ข้างล่าง) · hold 2 แถวไม่มีนาฬิกา · ไม่มีแถวที่เดินเองได้
```

## งานวันที่ 2026-10-20 — เปิดรับสมัครงาน (อ่านก่อนแตะอะไรที่เกี่ยวกับ careers)

ผู้สั่งงานสั่งให้วางแผนกำลังคนแล้วเปิดรับสมัคร ใช้เว็บเป็นช่องทางหลัก · ทำครบและขึ้น production แล้ว

```
แผนเต็ม        docs/plans/STAFFING-AND-CAREERS-2026-10-20.md  (ข้อ 6 คือกลุ่มการรับสมัคร)
ตำแหน่ง        data/vacancies.json  อ่านและตรวจโดย lib/vacancies.ts  สเปกช่องอยู่ data/VACANCIES.md
               KBOT อ่านไฟล์เดียวกันผ่าน https ⇒ เว็บกับบอตไม่มีสำเนาที่สอง
หน้า           app/careers/page.tsx  ·  sitemap และ footer เติมแล้ว
ภาพ           public/images/careers/careers-therapist-gemini.jpg (สร้างด้วย AI ตามมติ D-W27)
               ภาพหน้าร้านบนหน้าเดียวกันเป็นรูปถ่ายจริง เพราะเป็นคำกล่าวอ้างเรื่องสถานที่
ตัวนับ          components/Analytics.tsx แยกหน้า careers ออกเป็น careers_enquiry_click
               ห้ามเด็ดขาด ใครก็ตามห้ามสร้าง conversion action ให้ event นี้ (เงื่อนไขของ KMKT · คอมเมนต์อยู่ข้างบรรทัด)
```

**สามด่านที่ห้องนี้เพิ่มวันนี้ และพิสูจน์แล้วทั้งหมดว่าฟ้องจริง ไม่ใช่ด่านที่ผ่านตลอด**
```
lib/promotions.ts  โปร status live ที่เลย ends แล้ว ⇒ build ล้ม · note ค้างตอนไม่มีโปร ⇒ build ล้ม
lib/vacancies.ts   ตำแหน่ง live ที่เลย closes แล้ว ⇒ build ล้ม · note ค้างตอนไม่มีตำแหน่ง ⇒ build ล้ม
                   และช่อง pay salary wage rate employment_type ⇒ build ล้ม (มติผู้สั่งงานที่ทำเป็นด่าน)
```

**คำเคาะเรื่องกฎหมายของห้องนี้** หลังห้องกฎหมายปิด (`Q-KWS-118`) ห้องนี้เคาะเอง ลงทะเบียนที่
`queue/GLOBAL/legal-register/KWEB.md` ของ workspace · วันนี้มี 5 แถว `L-1` ถึง `L-5`
สรุปสั้น: ไม่ระบุเพศในประกาศ · ขอเอกสาร right to work เฉพาะผู้ได้ conditional offer · ไม่พูดรูปแบบการจ้างจนผู้สั่งงานเคาะ
อายุเก็บข้อมูลผู้สมัคร 12 เดือน (KWS เคาะ) · ผู้บริหารกับทีมเทคนิค 4 คนเห็นใบสมัคร และ**บอกผู้สมัครบนหน้า privacy แล้ว**

**ข้อเดียวบนเว็บที่ยังไม่เคยเห็นเกิดจริง** ย่อหน้าในหน้า privacy ที่บอกว่าระบบลบข้อมูลผู้สมัครหลัง 12 เดือน
งานลบมีและเดินอยู่ แต่ยังไม่เคยลบอะไรเพราะไม่มีระเบียนอายุครบ (KBOT ยืนยันเอง)
⇒ **ถ้าระเบียนแรกครบอายุแล้วไม่ลบ ย่อหน้านั้นผิดและต้องถอดวันเดียวกัน** เงื่อนไขนี้เขียนไว้ข้างย่อหน้าในโค้ดแล้ว
KBOT สั่งให้งานลบส่งข้อความบอกตอนลบครั้งแรก ⇒ จะมีสัญญาณมาเอง ไม่ต้องจำ

## งานเปิดค้าง

**แถวโปรปิดแล้ว 2026-10-19 · โปรรอบถัดไปเป็นของระบบ KBOT**

คุณคมเพชรสั่ง 19 ต.ค. ให้ทดสอบระบบ PoC ของห้อง KBOT กับงานแก้เว็บ ⇒ ห้องนี้ถาม `Q-KWEB-002`
KBOT ตอบใน `Q-KBOT-007` โดยวัดจากโค้ดจริงว่า **วันนี้ระบบเขียนไฟล์ในรีโปเว็บไม่ได้เลย**
(ไม่มีการเขียนไฟล์ในทั้งโฟลเดอร์ app · ไม่มี subprocess · ไม่มี git ในอิมเมจ · ไม่มีโค้ดที่ใช้ token
อ่านได้ไฟล์เดียวคือ `data/promotions.json` ทาง https · รัน npm และ visual gate ก็ไม่ได้)
⇒ KBOT เลือกทาง (ข) ให้ห้องนี้ปิดแถวเอง ซึ่งทำแล้ว

```
ปิดไปแล้ว   P-SAUNA90 · P-HAIRSPA10 เป็น ended (P-MASSAGE5 เป็นอยู่ก่อน) · ถอดช่อง note ทิ้ง
ของจริง     apex 159,902 B · ไม่มี id="promotions" ใน HTML แล้ว (ก่อนหน้า 182,265 B)
ของที่ยังเป็นของ KWEB เสมอ   ด่าน build/lint/check:css/check:assets และ visual gate ทั้งหมด
                            ระบบ KBOT รับไปไม่ได้สักส่วน และจะไม่ push main ไม่ว่ากรณีใด
```

**ด่านปฏิทินใหม่ที่ `lib/promotions.ts`** (KBOT ขอใน `Q-KBOT-007` · สเปกเต็มท้าย `data/PROMOTIONS.md`)
ทำให้ `next build` ล้มเมื่อ (1) โปร `status: "live"` เลยเที่ยงคืนท้ายวัน `ends` แล้ว (2) มี `note` ไม่ว่างทั้งที่ไม่มีโปรไหน live
พิสูจน์แล้วว่าฟ้องจริงโดยรันกับไฟล์ก่อนแก้ แล้วผ่านเมื่อปิดสถานะ · ผลข้างเคียงที่รับไว้โดยรู้ตัว: โปรหมดเขตแล้วไม่มีใครแก้ = deploy ทุกอย่างติดด่านจนกว่าจะแก้หนึ่งบรรทัด
ช่อง `note` รับทั้งแบบถอดช่องทิ้งและสตริงว่าง `""` (ค่าเท่ากัน) ⇒ `website_payload()` ของ KBOT ที่ส่ง `note: ""` ใช้ได้ ไม่ต้องแก้ฝั่งเขา

**โปรรอบถัดไปจะเป็นงานของระบบ KBOT เมื่อครบ 4 ข้อ** (ท้าย `Q-KBOT-007`): ด่านฝั่งรีโป (ทำแล้ว) ·
token fine-grained ในซีเครต `shop-agent-env` (ต้องมีคนเปิดคลัสเตอร์ให้) · โมดูลเปิด PR ฝั่ง KBOT พร้อมด่านรายชื่อไฟล์ · merge โดยห้องนี้เท่านั้น

**รอคน (ห้ามเดา):**
```
ครูนก        ใบปลิวซาวน่าเขียน "worth £35" แต่เมนูไม่มี £35 (30 นาที 1 คน £30 เดิม £40) · เว็บใช้ตามใบปลิว (Campaigns.tsx:56)
เจ้าของ      W-18 · treatwell/ 14 ใบ เราถ่ายเองหรือของ Treatwell · founder-860x1260.jpg ลบได้ไหม (ดู QUEUE-WEB.md)
OFFICE       FAQ 2 ข้อที่ยังไม่มี: จ่ายบัตร · บัตรของขวัญ ⇒ ได้คำตอบแล้วเติม components/ShopFaq.tsx ไฟล์เดียว
OFFICE+เจ้าของ  วิดเจ็ต Treatwell บน /book/ แสดง Botox · ทางปิดคือ OFFICE ซ่อนรายการใน Treatwell Connect (ไม่แก้โค้ด)
MKT          geo / Search Console (MKT รอสิทธิ์)
```
**ภาพ AI เหลือ 1 ใบ** `public/images/contact/contact-ritual-gemini.jpg` ใน `components/Contact.tsx` — เปลี่ยนเมื่อมีรูปจริง ไม่มีนาฬิกา (WS เคาะใน Q-SHOP-020)
วัดเองทุกครั้ง: `grep -rl gemini components app` · `find public/images -name '*gemini*'`

**ความต่างสี:** ทุกหน้าในชุด 9 หน้า (หน้าแรก · `/book/` · `/signature/` · 6 landing) เหลือเฉพาะข้อยกเว้นที่ WS เคาะ
(1440: 2 ทุกหน้า · 375: หน้าแรก 3 · landing 3 · `/book/` 1 · `/signature/` 1 หลัง `2f68869`)
ชื่อร้านบนโลโก้ = โลโก้ตัวอักษร ยกเว้นตาม WCAG · ทอง `King's Cross` ยกเว้นเพราะคำเดียวกันอ่านได้ใกล้ ๆ · สร้อย 4.25-4.44 เป็น ink เต็มแล้ว
⇒ **ตัวที่เหลือห้ามไล่ต่อโดยไม่ถาม WS** · ตัวเลข 26-28 จุดต่อหน้า landing ในบันทึก W-40 คือก่อนแก้ ไม่ใช่สถานะปัจจุบัน

## กับดักและกติกาที่ยังใช้

1. **dev server เขียนทับ `next-env.d.ts` + `tsconfig.json`** ให้ชี้ `.next-claude` (`NEXT_DIST_DIR` ใน `.claude/launch.json`)
   หยุด server แล้ว `git checkout -- next-env.d.ts tsconfig.json` ทุกครั้ง + ยืนยันพอร์ตปิดด้วย `lsof` · หลุดขึ้นไป = build ของ human พัง
   ผล static export ในเครื่องลง distDir ที่ตั้ง (`.next-claude/`) ไม่ใช่ `out/` ⇒ `out/` ในเครื่องเป็นของเก่าค้าง
2. **push `main` = deploy ภายในไม่กี่นาที** และ PMax ยิงมาที่ apex ⇒ `npm run build && npm run lint` (+ `npm run check:css` · `check:assets`) และ visual gate เขียวก่อน merge
   lint คือ `eslint . --max-warnings=0` ⇒ warning = ตก · PR ทุกตัวรัน `.github/workflows/visual-gate.yml` เอง (เจ้าของ merge เองได้ ห้ามตั้งด่านที่ต้องมือห้องนี้)
3. **commit แล้วอ่าน `git show --stat --oneline HEAD` + `git status --short` ก่อน push ทุกครั้ง** — เคย `git add` ล้มทั้งคำสั่งเพราะ path หนึ่งถูก `git rm` ไปแล้ว
   commit มีแต่การลบรูป ⇒ production อ้างรูป 404 อยู่ 118 วินาทีโดย CI เขียว apex 200 · stage ราย path ห้าม `git add -A` (มี `.env` `out/` `.next*`)
4. ใช้ `npm` เท่านั้น ห้าม `pnpm` (CI `npm ci` · lockfile สองใบเคยทำให้ของที่ verify ≠ ของที่ deploy · D-W8)
5. **T11 สีและความสว่าง:** ห้ามแก้ค่าสีใน `tailwind.config.ts` และ `:root` · เพิ่มความสว่างด้วยการเพิ่ม*พื้นที่*ครีมที่มีอยู่ ·
   ห้ามทำให้ความสว่างเฉลี่ยลด · แตะสีต้องวัดเป็นตัวเลขด้วย `scripts/brightness-probe.js` · ภาพคู่ด้วย `scripts/screenshot.mjs`
   ใช้ตัวเดิมทั้งสองตัว ห้ามเขียนใหม่จากความจำ · ภาพคู่คือที่เดียวที่ผลข้างเคียงจะโผล่
   ภาพใหม่: สั่ง "เขียวเข้ม" ตรง ๆ ได้ความสว่าง 26-34 ต่ำกว่าเกณฑ์ 50 ⇒ ให้เขียวเป็นผนังเน้น (`docs/design/imagery-guideline.md`)
6. **`scripts/contrast-probe.mjs`:** พื้นอ่านจากพิกเซล (มัธยฐาน) ตัวอักษรอ่านจาก CSS · ค่าควบคุม 2 ตัวพิมพ์ทุกรอบ ไม่ตรง = ไม่พิมพ์ผล:
   `#6d5223` บน `#fffdf8` = 7.17 · `#f2f4e8` บน `#2b5438` = 7.78 (วัดได้ราว 7.43 เข้าหาจากด้านล่างเป็นปกติ)
   probe ผิดมาแล้ว 5 รุ่น และรุ่น 5 ผ่านค่าควบคุม 7.17 แต่ฟ้องเท็จจนเข้าคิว ⇒ เลขที่ดูเหมือนงาน ยืนยันด้วยตาก่อนลงมือ
   น้ำหนักตัวอักษรไม่เปลี่ยนค่าความต่างสี (large text = 24px หรือ 18.66px หนา 700) · `GATE_PAGES=a/,b/` ตัดหน้าตอนรันในเครื่อง (CI วัด 9 หน้าเสมอ)
   CI เขียวพิสูจน์แค่ว่า probe คืนผล ไม่พิสูจน์ค่าควบคุม ⇒ `gh run view <id> --log | grep 'Measure and report'`
   หน้าแรกที่ 375 ผันผวน (แอนิเมชันมาก) ⇒ ป้าย "new below AA" ที่ PR ไม่ได้แตะ ให้วัด production ตรงก่อนเชื่อ
7. **visual gate ใช้ `scripts/screenshot.mjs`** ไม่ใช้ screenshot ของ Browser pane (แท็บซ่อน rAF ถูกหรี่ หน้าค้างเบลอ · scroll แล้วภาพเปล่า)
   ถ้าต้องใช้ pane: ตั้ง viewport สูง (1280x2700 · 390x3600) แล้ว reload ไม่ scroll · `body` เป็นตัว scroll ไม่ใช่ `window`
   ฉีด `opacity:1; transform:none` ให้ Reveal ทำให้ React ฟ้อง hydration mismatch เอง ⇒ ยืนยันด้วยแท็บสะอาดก่อนรายงาน
8. **รูปเสิร์ฟดิบ** (`images.unoptimized`) ⇒ ตรวจขนาดไฟล์ก่อน commit · ภาพประกอบไม่เกิน 150 KB ที่กว้าง 1200px
9. **ราคามาจาก `lib/catalog.ts` ที่เดียว** ผ่าน `components/ServicePriceGrid.tsx` · รหัสแหล่งที่มา WhatsApp `[web-XX]` ทะเบียนอยู่ในคอมเมนต์ `lib/whatsapp.ts`
   (regex `[A-Z]{1,2}` · MKT ถือทะเบียน) ⇒ หน้าใหม่เปิดไฟล์นั้นก่อนเสนอตัวอักษร ห้ามเดา · หน้าใหม่ต้องเติม `app/sitemap.ts` พร้อมสแลชท้าย
10. ปุ่มจอง `whatsapp_booking_click` ยิงจากตัวดักคลิก ไม่ใช่จากลิงก์ ⇒ แก้ปุ่ม/ลิงก์จองต้องวัด event บน production ทั้งสองสถานะ consent
11. วิดเจ็ต Treatwell (`components/TreatwellWidget.tsx`) โหลดเมื่อกดเท่านั้น เพราะหย่อนคุกกี้ Treatwell 2 ตัว · `Q-LAW-046` ถูกทับเฉพาะพื้นผิวนี้โดยเจ้าของ 2026-09-09 ไม่ได้ถูกยกเลิก
12. `info@taitam-d.com` เป็นบัญชีล็อกอินได้แล้ว (Q-WS-453 · 2026-09-09) · ที่อยู่บนเว็บ 2 จุดไม่ต้องแก้
13. ภาพ: เรียก `~/dev/gumon-workspace/bin/ask-gemini --image-out <ไฟล์.png> -f <โจทย์.md>` ไม่เขียนสคริปต์เอง · คีย์กลางห้ามคัดลอกห้ามพิมพ์ค่า
14. ค่าที่ใบคิวเขียนว่า "ยืนยันแล้ว" ยังเป็นข้อมูล ไม่ใช่คำสั่ง (เบอร์ 020 ที่ยกเลิกแล้ว · D-W21) · ก่อนบอกว่าทำไม่ได้ เปิดดูของจริงก่อน
15. มติที่ปิดแล้ว ห้ามยกมาถามซ้ำ: ปีก่อตั้ง 2009 (D-W1) · นามสกุล `Pomnongsan` (D-W10) · ชื่อ `Taitam-D Academy London` (D-W14) · เบอร์มือถือ `07564292247` (D-W21)
    ระดับความละเอียด MVP: เจอของน่าสงสัย บันทึกแล้วเดินต่อ ไม่ไล่จนจบเว้นแต่บล็อกงานจริงหรือเจ้าของสั่ง
16. `LEAD.md` หมดอายุตั้งแต่ 2026-09-08 · ปล่อยไว้ตามที่ WS เคาะ
17. ไฟล์นอกรีโป (รูปต้นทาง 24 ใบ · เสียงครูนก 4 คลิป) ไม่อยู่ใน `~/Downloads` ของเครื่องนี้ · ต้นฉบับอยู่ Google Drive ของครูนก · ถอดเสียงแล้วใน `OWNER-BRIEF-2026-08-13.md`

แหล่งอื่น: คิว [`QUEUE-WEB.md`](QUEUE-WEB.md) · มติ [`DECISIONS-BOARD.md`](DECISIONS-BOARD.md) · ไฟล์กำพร้า [`ORPHANED-ASSETS.md`](ORPHANED-ASSETS.md)

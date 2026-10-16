# Creative Project Tracker

เว็บแอปพลิเคชันสำหรับจัดการโปรเจกต์สร้างสรรค์ เช่น ภาพวาด การ์ตูน และงานออกแบบ พัฒนาด้วย HTML, CSS, JavaScript, Node.js, Express และ MongoDB

## Features

- เพิ่ม อ่าน แก้ไข และลบโปรเจกต์ (CRUD)
- จัดหมวดหมู่: ภาพวาด, การ์ตูน, ออกแบบ และอื่น ๆ
- ติดตามสถานะ: ไอเดีย, กำลังทำ และเสร็จแล้ว
- กำหนดวันที่เป้าหมาย
- กรองรายการตามหมวดหมู่และสถานะ
- แสดงสรุปจำนวนโปรเจกต์
- แสดงสถานะการเชื่อมต่อ MongoDB

## Tech stack

- Frontend: HTML, CSS, Vanilla JavaScript, Fetch API
- Backend: Node.js, Express
- Database: MongoDB, Mongoose
- Dev tool: Nodemon

## Folder structure

```text
creative-project-tracker/
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── server/
│   ├── models/
│   │   └── Project.js
│   ├── routes/
│   │   └── projects.js
│   └── server.js
├── screenshots/
│   └── README.txt
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Requirements

- Node.js LTS และ npm
- MongoDB Community Server ที่กำลังทำงาน หรือ MongoDB Atlas

## Installation

1. Clone หรือดาวน์โหลด repository
2. เปิด Terminal ในโฟลเดอร์โปรเจกต์
3. ติดตั้ง dependencies:

   ```bash
   npm install
   ```

4. สร้างไฟล์ `.env` โดยคัดลอก `.env.example`:

   ```bat
   copy .env.example .env
   ```

5. ตรวจสอบค่าใน `.env`:

   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/creative_project_tracker
   PORT=3000
   ```

6. ตรวจสอบว่า MongoDB Server ทำงานอยู่ (MongoDB Compass เป็นโปรแกรมจัดการฐานข้อมูล แต่การเปิด Compass อย่างเดียวไม่ได้หมายความว่า MongoDB Server ทำงานแล้ว)

## Run

```bash
npm run dev
```

หรือ

```bash
npm start
```

เมื่อเชื่อมต่อสำเร็จ Terminal จะแสดงข้อความ:

```text
MongoDB connected successfully
Creative Project Tracker running at http://localhost:3000
```

เปิดเว็บที่ <http://localhost:3000>

## API endpoints

Base URL: `http://localhost:3000`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | ตรวจสอบสถานะเซิร์ฟเวอร์และฐานข้อมูล |
| GET | `/api/projects` | อ่านโปรเจกต์ทั้งหมด |
| GET | `/api/projects?status=working` | กรองตามสถานะ |
| GET | `/api/projects?category=comic` | กรองตามหมวดหมู่ |
| GET | `/api/projects/:id` | อ่านโปรเจกต์ตาม ID |
| POST | `/api/projects` | เพิ่มโปรเจกต์ |
| PATCH | `/api/projects/:id` | แก้ไขข้อมูลโปรเจกต์ |
| DELETE | `/api/projects/:id` | ลบโปรเจกต์ |

ค่าที่รองรับ:
- `status`: `idea`, `working`, `done`
- `category`: `illustration`, `comic`, `design`, `other`

### Example: create a project

Request:

```http
POST /api/projects
Content-Type: application/json
```

Body:

```json
{
  "name": "การ์ตูนสั้นตอนแรก",
  "category": "comic",
  "description": "วางโครงเรื่องและทำ thumbnail",
  "status": "working",
  "targetDate": "2026-11-15"
}
```

### HTTP status codes

- `200 OK`: อ่าน แก้ไข หรือลบสำเร็จ
- `201 Created`: สร้างโปรเจกต์สำเร็จ
- `400 Bad Request`: ข้อมูลไม่ถูกต้อง
- `404 Not Found`: ไม่พบโปรเจกต์หรือ endpoint
- `500 Internal Server Error`: เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์

## Debugging evidence

ก่อนส่งงาน ให้นักศึกษารันโปรเจกต์และถ่ายภาพหน้าจอจริง 2 ภาพ แล้วบันทึกในโฟลเดอร์ `screenshots/`

1. `backend-mongodb.png` — Terminal แสดงว่าเชื่อมต่อ MongoDB และเซิร์ฟเวอร์เริ่มทำงานสำเร็จ
2. `api-database-test.png` — ทดสอบ CRUD ผ่านหน้าเว็บหรือ API และแสดงข้อมูลที่บันทึกใน MongoDB

เมื่อมีภาพจริงแล้ว เพิ่มส่วนนี้ใน README:

```md
![Backend and MongoDB connection](screenshots/backend-mongodb.png)

![API and database test](screenshots/api-database-test.png)
```

## GitHub submission checklist

- [ ] `npm install` สำเร็จ
- [ ] MongoDB ทำงานและเชื่อมต่อสำเร็จ
- [ ] `npm run dev` สำเร็จ
- [ ] ทดสอบเพิ่ม อ่าน แก้ไข และลบข้อมูล
- [ ] เพิ่มภาพหลักฐานจริง 2 ภาพใน README
- [ ] ตรวจสอบว่า `.env` และ `node_modules/` ไม่ได้ถูกอัปโหลด
- [ ] Push repository ขึ้น GitHub
- [ ] ส่งลิงก์ repository ผ่าน Microsoft Teams

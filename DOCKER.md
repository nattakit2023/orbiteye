# 🐳 Docker Deployment Guide

ไฟล์ในโฟลเดอร์นี้ช่วยให้ deploy frontend เป็น Docker image ได้ง่าย ๆ

## โครงสร้างไฟล์

```
frontend2/
├── Dockerfile              # Multi-stage build (Node → nginx)
├── nginx.conf              # nginx config + reverse proxy + SPA fallback
├── docker-compose.yml      # รันด้วย docker compose
├── docker/
│   └── entrypoint.sh       # envsubst + start nginx
├── .dockerignore           # ลด build context
└── .env.example            # ตัวอย่าง env vars
```

---

## 🚀 Quick Start (แบบ docker compose)

### 1. ตั้งค่า env

```bash
cp .env.example .env
# แก้ค่าใน .env ให้ตรงกับ backend จริง
```

### 2. Build & Run

```bash
# build image แล้ว start container
docker compose up -d --build

# ดู logs
docker compose logs -f frontend
```

เปิดเว็บที่ `http://localhost:3000`

---

## 🔧 แบบ docker build + run (manual)

### Build

```bash
docker build \
  --build-arg VITE_API_URL=https://api.example.com \
  --build-arg VITE_BASE_URL=https://api.example.com \
  --build-arg VITE_GOOGLE_CLIENT_ID=your-client-id \
  -t orbiteye-frontend:latest .
```

### Run

```bash
docker run -d \
  --name orbiteye-frontend \
  -p 3000:80 \
  -e BACKEND_URL=http://backend:4321 \
  orbiteye-frontend:latest
```

---

## 📋 Environment Variables

### Build-time (ฝังใน JS bundle)

| Var | Default | คำอธิบาย |
|-----|---------|-----------|
| `VITE_API_URL` | `http://localhost:4321` | GraphQL endpoint ที่ browser เรียก |
| `VITE_BASE_URL` | `http://localhost:4321` | Base URL สำหรับ axios |
| `VITE_GOOGLE_CLIENT_ID` | `your-google-client-id` | Google OAuth client ID |

### Runtime (ใช้ใน nginx)

| Var | Default | คำอธิบาย |
|-----|---------|-----------|
| `BACKEND_URL` | `http://backend:4321` | URL ที่ nginx proxy `/graphql` ไปหา |

---

## 🌐 nginx features

- ✅ **SPA routing**: `try_files` fallback → `index.html` (สำหรับ React Router)
- ✅ **Gzip compression** สำหรับ text/JSON assets
- ✅ **Cache headers** ยาว 1 ปีสำหรับ hashed assets ของ Vite (`/assets/*`)
- ✅ **Security headers**: CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- ✅ **Reverse proxy** `/graphql` → backend
- ✅ **Health check endpoint** ที่ `/healthz`
- ✅ **Hidden files** (`.git`, `.env`) ถูก block
- ✅ **server_tokens off** ซ่อน nginx version

---

## 🩺 Healthcheck

```bash
curl http://localhost:3000/healthz
# → "ok\n"
```

---

## 🔍 Troubleshooting

### 1. หน้าเว็บโหลดแล้วเจอ 404 ตอน refresh

สาเหตุ: SPA fallback ไม่ทำงาน → เช็คว่า `nginx.conf` มีบรรทัดนี้:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### 2. API call ไม่ได้ / CORS error

- ตรวจสอบว่า `VITE_API_URL` ถูกต้องตอน build (มันถูกฝังใน JS แล้ว)
- ถ้าใช้ reverse proxy ตรวจสอบ `BACKEND_URL` env ตอน run container
- ดู logs: `docker compose logs frontend`

### 3. อยากเปลี่ยน VITE_API_URL โดยไม่ต้องแก้ code

ต้อง **build image ใหม่** เพราะ Vite ฝังค่านี้ลงใน JS bundle ตอน build เท่านั้น

### 4. image ใหญ่เกินไป

ใช้ `docker images orbiteye-frontend` ดูขนาด
- ถ้า > 100MB ตรวจสอบว่า `node_modules` ไม่ติดมาด้วย (เช็ค `.dockerignore`)
- ใช้ `docker history orbiteye-frontend` ดู layer ที่ใหญ่

---

## 🛑 หยุดและลบ container

```bash
docker compose down              # หยุด + ลบ container
docker compose down --volumes    # ลบ volumes ด้วย
docker image rm orbiteye-frontend:latest   # ลบ image
```
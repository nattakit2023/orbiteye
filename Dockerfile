# === Stage 1: Build Stage ===
FROM node:20-alpine AS builder

WORKDIR /app

# ติดตั้ง pnpm ก่อน (เพราะ node:20-alpine ไม่มี pnpm มาให้)
# ใช้ npm install -g แทน corepack เพราะเชื่อถือได้มากกว่าใน alpine
RUN npm install -g pnpm@9

# คัดลอกไฟล์ package เพื่อติดตั้ง dependencies ก่อน (ช่วยประหยัดเวลาบิวด์ด้วย Docker Cache)
COPY package.json pnpm-lock.yaml ./

# ติดตั้ง dependencies ทั้งหมด
RUN pnpm install

# คัดลอกซอร์สโค้ดทั้งหมดภายในโปรเจกต์
COPY . .

# สั่งบิวด์โปรเจกต์ Vite (จะได้โฟลเดอร์ dist ออกมา)
RUN pnpm run build

# === Stage 2: Production Stage ===
FROM nginx:1.25-alpine

# คัดลอกไฟล์คอนฟิกของ Nginx เข้าไปเพื่อรองรับระบบ Routing ของ React (ป้องกันปัญหา Refresh แล้วขึ้น 404)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# คัดลอกไฟล์ที่บิวด์เสร็จแล้วจาก Stage แรกมาที่โฟลเดอร์สำหรับเสิร์ฟหน้าเว็บของ Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# เปิดพอร์ตภายในตู้ (Nginx ดั้งเดิมคือพอร์ต 80)
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]

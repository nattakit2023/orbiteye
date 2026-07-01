#!/bin/sh
# =============================================================
# Entrypoint: substitute environment variables in nginx.conf
# then start nginx in the foreground.
#
# ใช้สำหรับแทนที่ ${BACKEND_URL} ใน nginx.conf ด้วยค่าจริงตอน runtime
# ถ้าไม่ตั้งค่า BACKEND_URL ไว้ ตัวแปรจะถูกลบออก และ reverse proxy
# จะกลายเป็น invalid → nginx จะ fail ตอน start
# ดังนั้นควรตั้ง BACKEND_URL=http://your-backend:4321 ทุกครั้ง
# หรือปิด reverse proxy ใน nginx.conf ถ้าไม่ต้องการ
# =============================================================
set -e

# Default BACKEND_URL if not set (ตั้ง default ให้ทำงานกับ docker-compose ได้ทันที)
: "${BACKEND_URL:=http://backend:4321}"
export BACKEND_URL

echo "[entrypoint] BACKEND_URL=${BACKEND_URL}"

# แทนที่ ${BACKEND_URL} ใน nginx config
envsubst '${BACKEND_URL}' < /etc/nginx/conf.d/default.conf > /tmp/nginx.conf
mv /tmp/nginx.conf /etc/nginx/conf.d/default.conf

# ทดสอบ config ก่อน start
nginx -t

# Start nginx ใน foreground
exec nginx -g "daemon off;"
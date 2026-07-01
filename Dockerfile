# ============================================================
# Stage 1: Build the Vite/React production bundle
# ============================================================
FROM node:20-alpine AS builder

# ค่า env เหล่านี้ถูกใช้ตอน build เพื่อฝังลงใน JS bundle (import.meta.env)
# สามารถ override ตอน build ได้ เช่น:
#   docker build --build-arg VITE_API_URL=https://api.example.com -t orbiteye-frontend .
ARG VITE_API_URL=http://localhost:4321
ARG VITE_BASE_URL=http://localhost:4321
ARG VITE_GOOGLE_CLIENT_ID=your-google-client-id

ENV VITE_API_URL=${VITE_API_URL} \
    VITE_BASE_URL=${VITE_BASE_URL} \
    VITE_GOOGLE_CLIENT_ID=${VITE_GOOGLE_CLIENT_ID}

WORKDIR /app

# ติดตั้ง dependencies ก่อน เพื่อใช้ Docker layer cache
# ใช้ `npm ci` แทน `npm install` เพื่อ build ที่ reproducible (ตาม package-lock.json)
# ใส่ --include=dev เพราะ Vite/TypeScript อยู่ใน devDependencies
COPY package*.json ./
RUN npm ci --no-audit --no-fund --include=dev

# คัดลอก source แล้ว build (ใช้ NODE_ENV=production เฉพาะตอน build)
COPY . .
RUN NODE_ENV=production npm run build

# ============================================================
# Stage 2: Serve static files with nginx
# ============================================================
FROM nginx:1.27-alpine AS production

# ติดตั้ง envsubst (มากับ gettext) — ใช้แทนที่ตัวแปรใน nginx.conf
RUN apk add --no-cache gettext

# ใส่ metadata ของ image
LABEL maintainer="Orbiteye Team" \
      org.opencontainers.image.title="Orbiteye Frontend" \
      org.opencontainers.image.description="Orbiteye satellite imagery web app (React + Vite)" \
      org.opencontainers.image.source="https://github.com/orbiteye/frontend"

# ลบ default nginx website ออก แล้วใช้ config ของเราแทน
RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/default.conf

# คัดลอก nginx config + entrypoint
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# คัดลอกเฉพาะ build output จาก stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

# nginx:alpine มี user "nginx" อยู่แล้ว
# ตั้ง permission ให้ nginx user อ่านไฟล์ได้
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown nginx:nginx /var/run/nginx.pid && \
    chmod +x /usr/local/bin/entrypoint.sh

# ใช้ non-root user เพื่อความปลอดภัย
USER nginx

EXPOSE 80

# Healthcheck เรียก /healthz ที่เราจะเพิ่มใน nginx.conf
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/healthz || exit 1

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
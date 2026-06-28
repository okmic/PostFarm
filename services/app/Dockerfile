FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build 2>&1 | tee build.log
RUN cat build.log

FROM node:20-alpine AS production

WORKDIR /app

COPY package.json ./

RUN npm install --omit=dev

COPY --from=builder /app/build ./build

RUN addgroup -g 1001 appgroup && \
    adduser -u 1001 -G appgroup -s /bin/sh -D appuser

USER appuser

EXPOSE 9999

ENV NODE_ENV=production

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:9999/health || exit 1

CMD ["node", "build/index.js"]
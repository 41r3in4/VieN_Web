FROM node:22-bookworm-slim

WORKDIR /app

COPY next-app/package.json next-app/package-lock.json ./
RUN npm ci

COPY next-app/ ./
RUN npm run build

ENV NODE_ENV=production
ENV PORT=10000
EXPOSE 10000

CMD ["npm", "start"]

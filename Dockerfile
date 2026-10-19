FROM node:22.20.0-bookworm-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --include=dev
COPY . .
ENV NODE_ENV=production
RUN npm run build
ENV PORT=10000
EXPOSE 10000
CMD ["sh", "-c", "npm run auth:migrate && npm run progress:migrate && npm run community:migrate && npm run media:migrate && npm start -- --hostname 0.0.0.0 --port ${PORT:-10000}"]

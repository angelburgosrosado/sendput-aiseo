# Dockerfile — Cloud Run, Render & VPS Container for SendPut AI (SignalForge 3.0)
FROM node:20-alpine
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build
ENV NODE_ENV=production
ENV PORT=10000
EXPOSE 10000
CMD ["node", "dist/server.cjs"]

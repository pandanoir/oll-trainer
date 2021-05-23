# ビルド環境
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
COPY __patch__/Radar.d.ts  ./node_modules/recharts/types/polar/
RUN npm run build

# 本番環境
FROM pierrezemb/gostatic as production-stage
COPY --from=build-stage /app/dist /srv/http
CMD ["-port", "8080", "-fallback", "index.html"]

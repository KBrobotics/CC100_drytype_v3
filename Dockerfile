# ---- 1) BUILD ----
# Node image działa wieloarch (arm/amd) - OK pod Wago CC100
FROM node:18-alpine AS builder

WORKDIR /app

# Kopiujemy manifesty zależności (w zależności od tego co masz w repo)
COPY package.json ./
COPY package-lock.json* ./
COPY yarn.lock* ./
COPY pnpm-lock.yaml* ./

# Instalacja zależności (auto: npm/yarn/pnpm)
RUN set -eux; \
  if [ -f yarn.lock ]; then \
    yarn install --frozen-lockfile; \
  elif [ -f pnpm-lock.yaml ]; then \
    corepack enable && pnpm install --frozen-lockfile; \
  else \
    npm ci; \
  fi

# Kopiujemy resztę projektu i budujemy
COPY . .

RUN set -eux; \
  if [ -f yarn.lock ]; then \
    yarn build; \
  elif [ -f pnpm-lock.yaml ]; then \
    pnpm build; \
  else \
    npm run build; \
  fi


# ---- 2) RUNTIME (NGINX) ----
FROM nginx:stable-alpine

# Podmieniamy konfigurację nginx tak, żeby:
# - serwował build z /usr/share/nginx/html
# - działał poprawnie dla SPA (fallback na index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Kopiujemy build do nginx
# (zakładamy standardowy output: dist/)
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# nginx startuje domyślnie
CMD ["nginx", "-g", "daemon off;"]

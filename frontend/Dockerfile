# Stage builder
FROM node:23-alpine AS builder

WORKDIR /app

# Copier package.json + package-lock.json
COPY package*.json ./

# Installer dépendances
RUN npm install

# Copier le reste
COPY . .

# Build Next.js
RUN npm run build

# Stage production
FROM node:23-alpine

WORKDIR /app

# Copier les fichiers de build (sans le dossier public)
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./

# Installer seulement les dépendances de production
RUN npm install --omit=dev

EXPOSE 3000

CMD ["npm", "start"]

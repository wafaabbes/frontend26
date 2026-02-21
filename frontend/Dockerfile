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

# Copier les fichiers de build
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./

# Copier le dossier public s'il existe (optionnel)
COPY --from=builder /app/public ./public 2>/dev/null || echo "No public directory found, skipping..."

# Installer seulement les dépendances de production
RUN npm install --omit=dev

EXPOSE 3000

CMD ["npm", "start"]

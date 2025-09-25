# Étape 1 : Build et préparer l'API avec npm
FROM node:18-alpine AS builder
WORKDIR /app

# Copier uniquement les fichiers nécessaires pour l'install
COPY package*.json ./

# Installer les deps
RUN npm ci --omit=dev

# Copier le reste du projet
COPY . .

# Générer Prisma client
RUN npx prisma generate

# Étape 2 : Image finale pour l'API
FROM node:18-alpine
WORKDIR /app

# Installer curl pour healthcheck
RUN apk add --no-cache curl

# Copier les node_modules depuis le builder
COPY --from=builder /app/node_modules ./node_modules

# Copier le code source
COPY . .

# Générer Prisma client (au cas où)
RUN npx prisma generate

# Exposer le port
EXPOSE 3000

# Commande de production
CMD ["npm", "run", "start"]

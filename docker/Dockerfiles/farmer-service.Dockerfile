FROM node:22.11.1-alpine

WORKDIR /app

# Créer un utilisateur non-root pour la sécurité
RUN groupadd -r nodejs && \
    useradd -r -g nodejs -d /home/nodejs -s /sbin/nologin nodejs && \
    mkdir -p /home/nodejs && \
    chown -R nodejs:nodejs /home/nodejs

# Copier les fichiers de dépendances
COPY services/farmer-service/package*.json ./

# Installer les dépendances de production
RUN npm ci --only=production && \
    npm cache clean --force

# Copier le code source
COPY services/farmer-service/ ./

# Changer les permissions
RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3001

CMD ["node", "index.js"]
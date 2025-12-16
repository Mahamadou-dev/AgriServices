FROM node:22-alpine

WORKDIR /app

RUN addgroup -S nodejs && \
    adduser -S -G nodejs -h /home/nodejs nodejs

COPY package*.json ./

RUN npm ci --only=production && \
    npm cache clean --force

COPY . .

RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3001

CMD ["node", "index.js"]

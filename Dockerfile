FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./

# Cài đặt tất cả dependencies (bao gồm devDependencies)
RUN npm ci --ignore-scripts
RUN npm rebuild bcrypt
RUN npm rebuild sharp

COPY . .
COPY docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh

# Build
RUN npm run build

# Không xóa devDependencies vì cần cho migration
# RUN npm ci --only=production --ignore-scripts

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]
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

COPY src/ src/

COPY docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh

# Build
RUN npm run build

# Không xóa devDependencies vì cần cho migration
RUN npm ci --only=production --ignore-scripts

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]

# FROM node:20 as builder
# WORKDIR /home/node/app
# COPY ./package.json ./
# COPY ./yarn.lock ./
# RUN chown -R node:node /home/node/app
# RUN yarn install
# COPY . .
# RUN yarn build
# RUN rm -r node_modules
# RUN yarn install --frozen-lockfile --production

# FROM node:16 as production
# WORKDIR /home/node/app
# COPY --from=builder /home/node/app ./
# EXPOSE 3000
# CMD ["node", "dist/main.js"]
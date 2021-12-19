FROM node:16.13.1-alpine as builder
WORKDIR /usr/app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

# FROM node:16.13.1-alpine
# COPY --from=builder /usr/app/dist /usr/app
CMD ["node", "/usr/app/dist/main"]
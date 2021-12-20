FROM node:16.13.1-alpine
WORKDIR /usr/app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
CMD ["node", "/usr/app/dist/main"]
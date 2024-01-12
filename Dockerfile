# Dockerfile

FROM node:21.5.0-alpine
RUN mkdir -p /app
WORKDIR /app
COPY /package.json /package-lock.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
FROM node:14

WORKDIR /app/admin-site

COPY package*.json ./

RUN npm install

COPY . /app/admin-site

CMD ["npm", "start"]
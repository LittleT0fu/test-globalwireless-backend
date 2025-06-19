# ใช้ Node.js 18 LTS เป็น base image
FROM node:18

# set working directory
WORKDIR /app

# copy package.json and package-lock.json
COPY package*.json ./

# install app dependencies
# npm ci = Clean install
RUN npm ci --only=production

# copy source code
COPY . .

# generate Prisma client
RUN npx prisma generate

# set port from env file
ENV PORT=3000
EXPOSE $PORT


# run application
CMD ["npm", "start"] 
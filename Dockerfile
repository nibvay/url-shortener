FROM node:20

# Setting working directory. 
WORKDIR /app

# Installing dependencies
COPY package*.json ./
RUN npm install

# Copying source files
COPY . ./

EXPOSE 3033

# Running the app
CMD [ "npm", "start" ]

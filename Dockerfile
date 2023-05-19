# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the app dependencies
RUN npm install

# Copy the rest of the app source code to the working directory
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the desired port
EXPOSE 3000

# Pass environment variables from .env file during build
ARG ENV_FILE
ENV ENV_FILE=.env

# Set the command to run when the container starts
# CMD [ "sh", "-c", "source ${ENV_FILE} && node ./dist/index.js" ]
# Set the command to run when the container starts
CMD [ "sh", "-c", "source ${ENV_FILE} && node ./dist/app.js" ]

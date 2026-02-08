# Sample Dockerfile Content

# Use an official base image
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . . 

# Set environment variables with fallback values
ENV MY_ENV_VAR=${MY_ENV_VAR:-default_value}

# Expose the port
EXPOSE 3000

# Command to run the application
CMD [ "npm", "start" ]

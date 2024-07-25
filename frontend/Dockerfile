# Use the official Node.js image as a base image
FROM node:20

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular app
RUN npm run build --prod

# Install serve to serve the static files
RUN npm install -g serve

# Expose the port serve runs on
EXPOSE 4200

# Serve the built Angular app
CMD ["serve", "-s", "dist"]

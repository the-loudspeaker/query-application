# Use a lightweight base image:
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json and install dependencies:
COPY package*.json ./
RUN npm install

# Copy remaining project files:
COPY . .

# Build the React app (optimized for production):
RUN npm run build

# Create a slimmer production image:
FROM nginx:alpine

# Copy the built React app into the Nginx webroot:
COPY --from=builder /app/build /usr/share/nginx/html

# Expose the port used by your React app:
EXPOSE 3100

# Start Nginx to serve the app:
CMD ["nginx", "-g", "daemon off;"]

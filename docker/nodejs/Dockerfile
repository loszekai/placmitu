FROM node:latest

WORKDIR /usr/src/app

# Copy package files and install dependencies (uncomment when adding them)
# COPY package*.json ./
# RUN npm install

# Copy all application files
COPY . .

# Keeps the container running before you add an actual start script
CMD ["tail", "-f", "/dev/null"]

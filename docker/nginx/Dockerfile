FROM nginx:latest

# Remove the default nginx config file
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom config file
COPY default.conf /etc/nginx/conf.d/

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

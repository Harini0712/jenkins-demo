# ============================================================
#  LUXE Ecommerce Website — Dockerfile
#
#  PUT THIS FILE HERE:
#  ecommerce-website/
#  ├── Dockerfile        ← HERE (root level)
#  ├── Jenkinsfile       ← HERE (root level)
#  └── ecommerce/
#      ├── index.html
#      ├── css/
#      └── js/
# ============================================================

FROM nginx:alpine

# Remove default nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy your ecommerce folder → nginx serve directory
COPY . /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
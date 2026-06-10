# --------------------------------------------------------------------------
# Dockerfile for NGINX reverse proxy.
#
# Replaces the default NGINX config with custom configs that:
#   - Proxy /api/* requests to the Express.js backend
#   - Serve React static files for all other routes
# --------------------------------------------------------------------------

FROM nginx:alpine

# Remove default NGINX config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom configs
COPY nginx.conf /etc/nginx/nginx.conf
COPY app.conf /etc/nginx/conf.d/app.conf

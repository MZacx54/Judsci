# Stage 1: Build
FROM node:18-alpine as builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# Use templates directory for envsubst support in Nginx alpine image
COPY nginx.conf /etc/nginx/templates/default.conf.template
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

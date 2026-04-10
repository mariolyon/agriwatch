# Stage 1: Build
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (including dev) for the build
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the SvelteKit app
RUN npm run build

# Stage 2: Production
FROM node:24-alpine AS runner

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# TODO Install only production dependencies
RUN npm install

# Copy the built app from the builder stage
COPY --from=builder /app/build ./build

# Expose the port the app runs on
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV PUBLIC_SUPABASE_URL=public_supabase_url
ENV PUBLIC_SUPABASE_ANON_KEY=public_supabase_anon_key
ENV DATABASE_URL=database_url
ENV WEATHER_API_KEY=weather_api_key

# Run the application
CMD ["node", "build"]

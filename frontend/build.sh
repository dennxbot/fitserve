#!/bin/bash
# Build the Vue app
npx vite build

# Copy _redirects file to dist folder for Render
if [ -f "public/_redirects" ]; then
  cp public/_redirects dist/_redirects
  echo "Copied _redirects to dist folder"
fi

echo "Build complete!"

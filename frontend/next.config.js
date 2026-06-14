// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  generateEtags: false,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      // Add remote image domains here as needed
    ],
  },
};

module.exports = nextConfig;
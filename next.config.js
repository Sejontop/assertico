/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Linting is run in CI separately; do not block builds locally.
    ignoreDuringBuilds: false
  }
};

module.exports = nextConfig;

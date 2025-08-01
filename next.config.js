/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ← this will let your build succeed even if there are lint errors
    ignoreDuringBuilds: true
  }
};

module.exports = nextConfig;

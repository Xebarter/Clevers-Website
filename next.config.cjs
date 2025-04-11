/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'same-assets.com',
      },
    ],
  },
  output: 'export',
  distDir: 'out',
};

module.exports = nextConfig;

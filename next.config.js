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
  transpilePackages: ['tailwindcss', 'postcss', 'postcss-js'],
  eslint: {
    // Disable ESLint during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore type checking during builds
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;

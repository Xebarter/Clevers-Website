/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "same-assets.com",
      },
      {
        protocol: "https",
        hostname: "ucarecdn.com",
      },
      {
        protocol: "https",
        hostname: "cdn.supabase.com",
      },
      {
        protocol: "https",
        hostname: "nniwxjnumvvrcvlctgaz.supabase.co", // Supabase storage hostname
      }
    ],
  },
  // Removed distDir to let Next.js use the default ".next" folder
  // output: 'export',
  transpilePackages: ["tailwindcss", "postcss", "postcss-js"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
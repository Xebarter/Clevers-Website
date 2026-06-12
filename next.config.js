/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    // Serve Supabase (and other remote) images directly — avoids Vercel /_next/image
    // which returns 402 when image optimization quota/billing limits are hit.
    unoptimized: true,
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
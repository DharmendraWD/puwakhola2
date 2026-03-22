/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'https://aayu.thinktankinfotech.com',
        port: '4000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
       hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;


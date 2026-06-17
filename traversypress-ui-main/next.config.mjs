/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'shdmonitoring.ub.gov.mn',
        pathname: '/image/**',
      },
    ],
  },
};

export default nextConfig;

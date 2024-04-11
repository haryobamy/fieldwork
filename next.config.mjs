/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/db/:path*', // Adjust port if needed
      },
    ];
  },
};

export default nextConfig;

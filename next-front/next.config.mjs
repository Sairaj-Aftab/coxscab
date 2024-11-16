/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.giphy.com",
      },
      {
        protocol: "https",
        hostname: "coxscab.s3.ap-southeast-2.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;

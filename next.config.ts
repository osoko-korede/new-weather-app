import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
};

module.exports = {
  images: {
    domains: ["openweathermap.org"],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Empty turbopack config to silence the warning
  turbopack: {},
  webpack: (config, { isServer }) => {
    return config;
  },
};

export default nextConfig;

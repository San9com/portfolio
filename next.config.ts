import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Force webpack instead of Turbopack to avoid build errors
  webpack: (config, { isServer }) => {
    return config;
  },
};

export default nextConfig;

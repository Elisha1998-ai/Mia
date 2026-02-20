import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    turbopack: {
      root: process.cwd(),
    },
  },
  /* config options here */
};

export default nextConfig;

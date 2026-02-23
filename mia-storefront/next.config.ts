import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["pg", "drizzle-orm"],
  /* config options here */
};

export default nextConfig;

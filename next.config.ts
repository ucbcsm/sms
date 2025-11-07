import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
    authInterrupts: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;


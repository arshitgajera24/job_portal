import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        hostname: "xauinzxf7o.ufs.sh",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: `${process.env.BACKEND_URL}/auth/:path*`,
      },
      {
        source: "/api/orders/:path*",
        destination: `${process.env.BACKEND_URL}/orders/:path*`,
      },
    ];
  },
};

export default nextConfig;

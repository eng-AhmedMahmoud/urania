import type { NextConfig } from "next";

// Static export served by nginx on the Devya VPS (https://urania.devya.dev).
// The "/" → "/en" redirect lives in deploy/nginx/urania.conf.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;

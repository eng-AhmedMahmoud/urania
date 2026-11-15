import type { NextConfig } from "next";

// Static export for Cloudflare Pages (https://urania-bp7.pages.dev).
// The "/" → "/en" redirect lives in public/_redirects.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;

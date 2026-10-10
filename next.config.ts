import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hostinger's Node.js hosting starts Next's standalone server, so the build
  // has to emit one.
  output: "standalone",
  // Admin is a private tool — never let search engines near it.
  devIndicators: false,
  async headers() {
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

// GitHub Pages 项目站点默认发布在 /<repo>/ 子路径下，需要 basePath/assetPrefix
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: true
  },
  turbopack: {
    root: process.cwd()
  }
};

export default nextConfig;

// next.config.mjs
const repo = process.env.NEXT_PUBLIC_REPO_NAME || ""; // เช่น "solutions-taitamd-shop-website"
const isProd = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isProd && repo ? `/${repo}` : "",
  assetPrefix: isProd && repo ? `/${repo}/` : "",
  images: { unoptimized: true },
};

export default nextConfig;

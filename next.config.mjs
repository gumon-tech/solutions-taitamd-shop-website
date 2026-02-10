/** @type {import('next').NextConfig} */
const repo = process.env.NEXT_PUBLIC_REPO_NAME || ""; // ใส่ชื่อ repo เช่น "my-site"
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  output: "export",          // ✅ static export
  trailingSlash: true,       // ✅ ให้ path ลงท้าย / (กัน 404 บน Pages)
  basePath: isProd && repo ? `/${repo}` : "",
  assetPrefix: isProd && repo ? `/${repo}/` : "",
  images: {
    unoptimized: true,       // ✅ GitHub Pages ไม่รองรับ next/image optimization server
  },
};

module.exports = nextConfig;

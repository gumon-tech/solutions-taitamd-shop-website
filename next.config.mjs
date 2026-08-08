// next.config.mjs
const repo = process.env.NEXT_PUBLIC_REPO_NAME || ""; // เช่น "solutions-taitamd-shop-website"
const isProd = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // แยก build cache ของ AI session ออกจากของ human — next dev ตัวที่สองใน dir เดียวกัน
  // จะ refuse แม้คนละ port เพราะ lock อยู่ใน distDir และสอง process ที่แชร์ .next ทำ cache พัง
  // ไม่ตั้ง env = ".next" เหมือนเดิมทุกประการ (production build ไม่ได้รับผลกระทบ)
  distDir: process.env.NEXT_DIST_DIR || ".next",
  trailingSlash: true,
  basePath: isProd && repo ? `/${repo}` : "",
  assetPrefix: isProd && repo ? `/${repo}/` : "",
  images: { unoptimized: true },
};

export default nextConfig;

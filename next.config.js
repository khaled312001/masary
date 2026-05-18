/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // standalone output bundles only the files Next.js needs at runtime,
  // which makes the Hostinger deployment ~10x smaller.
  output: "standalone"
};

module.exports = nextConfig;

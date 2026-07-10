/** @type {import('next').NextConfig} */
const nextConfig = {
  // @react-pdf/renderer (used to build the emailed PDF) ships native-ish font
  // deps that must not be webpack-bundled — require it at runtime instead.
  experimental: {
    serverComponentsExternalPackages: ["@react-pdf/renderer"],
  },
};

module.exports = nextConfig;

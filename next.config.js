/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep @react-pdf/renderer out of Webpack/Turbopack's server bundle so
  // it can access native Node APIs (canvas, etc.) at runtime.
  serverExternalPackages: ['@react-pdf/renderer'],
}

module.exports = nextConfig

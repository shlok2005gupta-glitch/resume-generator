/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force Vercel to include @react-pdf packages in the deployment bundle.
  // They're loaded at runtime by the worker_threads eval, not by a static
  // import, so Next.js's file tracer would otherwise exclude them.
  outputFileTracingIncludes: {
    '/api/generate': [
      './node_modules/@react-pdf/**/*',
      './node_modules/yoga-layout/**/*',
      './scripts/pdf-worker.cjs',
    ],
  },
}

module.exports = nextConfig

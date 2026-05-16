const fs = require('fs')
const path = require('path')

// Walk the full transitive dependency tree of @react-pdf/renderer at build
// time so Vercel's file tracer includes every package the worker thread needs.
function collectDeps(pkgName, seen = new Set()) {
  if (seen.has(pkgName)) return seen
  seen.add(pkgName)
  try {
    const pkgJson = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'node_modules', pkgName, 'package.json'), 'utf8')
    )
    Object.keys(pkgJson.dependencies || {}).forEach(dep => collectDeps(dep, seen))
  } catch (_) {}
  return seen
}

const reactPdfDeps = [...collectDeps('@react-pdf/renderer')]
const tracingIncludes = [
  './scripts/pdf-worker.cjs',
  ...reactPdfDeps.map(dep => `./node_modules/${dep}/**/*`),
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    '/api/generate': tracingIncludes,
  },
}

module.exports = nextConfig

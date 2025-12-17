/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  transpilePackages: ['indicatorts'],
  serverExternalPackages: ['dukascopy-node', 'fastest-validator'],
}

export default nextConfig
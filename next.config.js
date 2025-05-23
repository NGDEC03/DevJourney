/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
  },
  experimental: {
    serverActions: {},
  },
  eslint:{
    ignoreDuringBuilds:true
  },
  typescript:{
    ignoreBuildErrors:true,
  }
}

module.exports = nextConfig
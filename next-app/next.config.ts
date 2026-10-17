import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  experimental: { webpackBuildWorker: false, cpus: 1, workerThreads: true },
  turbopack: { root: process.cwd(), rules: { '*.css': { loaders: ['@tailwindcss/turbopack'], as: '*.css' } } },
};
export default nextConfig;

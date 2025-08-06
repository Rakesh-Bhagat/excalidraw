const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['@draw-app/common'],
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
};

module.exports = nextConfig;
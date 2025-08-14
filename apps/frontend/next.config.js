const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['@draw-app/common'],
    outputFileTracingRoot: path.join(__dirname, '../../'),
  
};

module.exports = nextConfig;
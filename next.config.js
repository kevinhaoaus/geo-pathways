/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Enable static export for Vercel deployment
  output: 'standalone',
  
  // Content Security Policy
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self'; frame-ancestors 'self' https:;"
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      }
    ];
  },
  
  // API routes for assessment data
  async rewrites() {
    return [
      {
        source: '/api/quiz/:path*',
        destination: '/api/quiz/:path*'
      }
    ];
  },
  
  // Environment variables
  env: {
    QUIZ_TITLE: process.env.QUIZ_TITLE || 'Earth Science Career Pathways Quiz',
    ANALYTICS_ID: process.env.ANALYTICS_ID || '',
    ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS || 'false'
  }
};

module.exports = nextConfig;
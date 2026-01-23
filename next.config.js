const checkEnvVariables = require("./check-env-variables")

checkEnvVariables()

/**
 * Medusa Cloud-related environment variables
 */
const S3_HOSTNAME = process.env.MEDUSA_CLOUD_S3_HOSTNAME
const S3_PATHNAME = process.env.MEDUSA_CLOUD_S3_PATHNAME

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "pub-9b569f3b543c482099fac0e36dc1c5b2.r2.dev",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      ...(S3_HOSTNAME && S3_PATHNAME
        ? [
            {
              protocol: "https",
              hostname: S3_HOSTNAME,
              pathname: S3_PATHNAME,
            },
          ]
        : []),
    ],
  },
  async headers() {
    // Strapi Cloud domain for preview iframe embedding
    const strapiCloudDomain = "https://rational-peace-7a8493cc74.strapiapp.com"
    
    return [
      {
        // SECURITY: Allow ONLY the dedicated /preview page to be embedded by Strapi Cloud
        // This keeps the rest of the site protected from iframe embedding
        source: "/preview",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors 'self' ${strapiCloudDomain} http://localhost:1337`,
          },
          // Do NOT set X-Frame-Options for /preview (CSP frame-ancestors takes precedence)
        ],
      },
      {
        // Allow Strapi Cloud to embed the preview API route (redirect endpoint)
        source: "/api/preview",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors 'self' ${strapiCloudDomain} http://localhost:1337`,
          },
        ],
      },
      {
        // SECURITY: Protect all other routes from iframe embedding
        // This applies to homepage, product pages, checkout, etc.
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN", // Only allow same-origin embedding
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self'", // Only allow same-origin embedding
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig

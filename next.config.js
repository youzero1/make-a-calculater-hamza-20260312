/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['typeorm', 'better-sqlite3'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      if (Array.isArray(config.externals)) {
        config.externals.push('better-sqlite3');
      } else {
        config.externals = [config.externals, 'better-sqlite3'].filter(Boolean);
      }
    }
    return config;
  },
};

module.exports = nextConfig;

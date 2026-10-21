import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@crm/ui', '@crm/auth', '@crm/env'],
  experimental: {
    serverActions: { bodySizeLimit: '5mb' },
  },
};

export default nextConfig;

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@crm/ui', '@crm/auth', '@crm/env'],
};

export default nextConfig;

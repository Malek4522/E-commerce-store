import { json } from '@remix-run/node';
import type { LoaderFunction } from '@remix-run/node';

export const loader: LoaderFunction = async () => {
  const healthcheck = {
    status: 'OK',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development',
    build: {
      version: process.env.npm_package_version,
      nodeVersion: process.version,
    },
    services: {
      api: process.env.VITE_API_URL ? 'CONFIGURED' : 'NOT_CONFIGURED',
      assets: process.env.VITE_PUBLIC_URL ? 'CONFIGURED' : 'NOT_CONFIGURED'
    }
  };

  try {
    // You could add additional checks here
    // For example, checking if your API is reachable
    return json(healthcheck);
  } catch (error) {
    healthcheck.status = 'ERROR';
    return json(healthcheck, { status: 503 });
  }
}; 
import { Hono } from 'hono';
import pkg from '../../../../package.json';

interface StatusResponse {
  name: string;
  version: string;
  uptime: number;
  timestamp: string;
  nodeVersion: string;
}

const statusRoute = new Hono();

statusRoute.get('/', (c) => {
  const response: StatusResponse = {
    name: pkg.name,
    version: pkg.version,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
  };
  return c.json(response);
});

export default statusRoute;

import { Router } from 'express';
import pkg from '../../package.json';

interface StatusResponse {
  name: string;
  version: string;
  uptime: number;
  timestamp: string;
  nodeVersion: string;
}

const router = Router();

router.get('/', (_req, res) => {
  const response: StatusResponse = {
    name: pkg.name,
    version: pkg.version,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
  };
  res.json(response);
});

export default router;

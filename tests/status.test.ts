import { describe, it, expect } from 'vitest';
import app from '../src/webhook-server/server';

describe('GET /status', () => {
  it('should return 200', async () => {
    const res = await app.request('/status');
    expect(res.status).toBe(200);
  });

  it('should return StatusResponse shape', async () => {
    const res = await app.request('/status');
    const body = await res.json();
    expect(body).toMatchObject({
      name: expect.any(String),
      version: expect.any(String),
      uptime: expect.any(Number),
      timestamp: expect.any(String),
      nodeVersion: expect.any(String),
    });
  });

  it('should have increasing uptime between consecutive calls', async () => {
    const res1 = await app.request('/status');
    const body1 = await res1.json();
    await new Promise(resolve => setTimeout(resolve, 20));
    const res2 = await app.request('/status');
    const body2 = await res2.json();
    expect(body2.uptime).toBeGreaterThan(body1.uptime);
  });

  it('should have a valid ISO 8601 timestamp', async () => {
    const res = await app.request('/status');
    const body = await res.json();
    const date = new Date(body.timestamp);
    expect(date.toISOString()).toBe(body.timestamp);
  });
});

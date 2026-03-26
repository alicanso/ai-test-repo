import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app';

describe('GET /status', () => {
  it('should return 200', async () => {
    const res = await request(app).get('/status');
    expect(res.status).toBe(200);
  });

  it('should return StatusResponse shape', async () => {
    const res = await request(app).get('/status');
    expect(res.body).toMatchObject({
      name: expect.any(String),
      version: expect.any(String),
      uptime: expect.any(Number),
      timestamp: expect.any(String),
      nodeVersion: expect.any(String),
    });
  });

  it('should have increasing uptime between consecutive calls', async () => {
    const res1 = await request(app).get('/status');
    await new Promise(resolve => setTimeout(resolve, 20));
    const res2 = await request(app).get('/status');
    expect(res2.body.uptime).toBeGreaterThan(res1.body.uptime);
  });

  it('should have a valid ISO 8601 timestamp', async () => {
    const res = await request(app).get('/status');
    const date = new Date(res.body.timestamp);
    expect(date.toISOString()).toBe(res.body.timestamp);
  });
});

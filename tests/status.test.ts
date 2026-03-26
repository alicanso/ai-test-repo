import { describe, it, expect } from 'vitest'
import { Hono } from 'hono'
import { statusRoute } from '../src/webhook-server/routes/status/handler'

const app = new Hono()
app.route('/status', statusRoute)

describe('GET /status', () => {
  it('returns 200', async () => {
    const res = await app.request('/status')
    expect(res.status).toBe(200)
  })

  it('returns StatusResponse shape', async () => {
    const res = await app.request('/status')
    const body = await res.json()
    expect(typeof body.name).toBe('string')
    expect(typeof body.version).toBe('string')
    expect(typeof body.uptime).toBe('number')
    expect(typeof body.timestamp).toBe('string')
    expect(typeof body.nodeVersion).toBe('string')
  })

  it('uptime increases between consecutive calls', async () => {
    const res1 = await app.request('/status')
    const body1 = await res1.json()
    await new Promise<void>((r) => setTimeout(r, 50))
    const res2 = await app.request('/status')
    const body2 = await res2.json()
    expect(body2.uptime).toBeGreaterThan(body1.uptime)
  })

  it('timestamp is a valid ISO 8601 string', async () => {
    const res = await app.request('/status')
    const body = await res.json()
    const date = new Date(body.timestamp)
    expect(date.toISOString()).toBe(body.timestamp)
  })
})

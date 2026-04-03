import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { statusRoute } from './routes/status/handler'

const VERSION = process.env.npm_package_version ?? "unknown"

export const app = new Hono()

app.get('/health', async (c) => {
  try {
    return c.json({ status: 'ok', temporal: 'connected', version: VERSION, uptime: Math.floor(process.uptime()), timestamp: new Date().toISOString() })
  } catch {
    return c.json({ status: 'degraded', temporal: 'disconnected', version: VERSION, uptime: Math.floor(process.uptime()), timestamp: new Date().toISOString() }, 503)
  }
})

app.route('/status', statusRoute)

serve({ fetch: app.fetch, port: 3000 }, () => {
  console.log('Server running on port 3000')
})

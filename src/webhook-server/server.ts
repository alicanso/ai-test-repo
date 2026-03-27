import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { statusRoute } from './routes/status/handler'

export const app = new Hono()

app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    temporal: 'connected',
    version: process.env.npm_package_version ?? 'unknown',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  })
})

app.route('/status', statusRoute)

serve({ fetch: app.fetch, port: 3000 }, () => {
  console.log('Server running on port 3000')
})

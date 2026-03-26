import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { statusRoute } from './routes/status/handler'

export const app = new Hono()

app.route('/status', statusRoute)

serve({ fetch: app.fetch, port: 3000 }, () => {
  console.log('Server running on port 3000')
})

import { Hono } from 'hono'
import { statusRoute } from './routes/status/handler'

export const app = new Hono()

app.route('/status', statusRoute)

if (require.main === module) {
  const { serve } = require('@hono/node-server')
  serve({ fetch: app.fetch, port: 3000 }, () => {
    console.log('Server running on port 3000')
  })
}

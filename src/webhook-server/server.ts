import { Hono } from 'hono';
import statusRoute from './routes/status/handler';

const app = new Hono();

app.route('/status', statusRoute);

export default app;

import express from 'express';
import statusRouter from './routes/status';

const app = express();

app.use('/status', statusRouter);

export default app;

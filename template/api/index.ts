import { Router } from 'express';
import example from './routes/example.route';

const router = Router();

example(router);
export default router;

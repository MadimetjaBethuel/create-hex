import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import api from './api';

const app = express();
const port = process.env.Port || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(api); // all you routes are here

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello World! from typeForge' });
});

app.listen(3000, () => {
  console.log(`Sever is running on ${port}`);
});

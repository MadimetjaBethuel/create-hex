import { Request, Response } from 'express';

export async function example(req: Request, res: Response) {
  res.send('Hello World! from create-forge');
}

import { Router } from 'express';

import { example } from '../controllers/example.controller';

export default function (router: Router) {
  router.post('/example', example);
}

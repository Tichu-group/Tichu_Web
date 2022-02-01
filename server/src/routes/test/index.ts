import { Request, Response, Router } from 'express';

const router = Router();

export default () => {
  router.get('/', (req: Request, res: Response) => {
    console.log(req.user);
    res.json({ status: 200 });
  });
  return router;
};

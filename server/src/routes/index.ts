import { Router } from 'express';
import { authenticateUser } from '../passport';
import Server from '../server';
import auth from './auth';
import test from './test';

const router = Router();

export default (_: Server) => {
  router.use('/auth', auth());
  router.use('/test', authenticateUser, test());
  return router;
};

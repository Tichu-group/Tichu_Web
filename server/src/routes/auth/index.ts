import { Router } from 'express';
import passport from 'passport';

const router = Router();

export default () => {
  router.get('/kakao', passport.authenticate('kakao'));
  router.get(
    '/kakao/callback',
    passport.authenticate('kakao', {
      failureRedirect: '/',
      successRedirect: '/'
    })
  );
  return router;
};

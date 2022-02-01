import { Router } from 'express';
import passport from 'passport';

const router = Router();

export default () => {
  router.get('/kakao', passport.authenticate('kakao'));
  router.get(
    '/kakao/callback',
    passport.authenticate('kakao', {
      failureRedirect: '/fail',
      successRedirect: '/success'
    })
  );

  router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile'] })
  );
  router.get(
    '/google/callback',
    passport.authenticate('google', {
      failureRedirect: '/fail',
      successRedirect: '/success'
    })
  );

  router.get('/facebook', passport.authenticate('facebook'));
  router.get(
    '/facebook/callback',
    passport.authenticate('facebook', {
      failureRedirect: '/fail',
      successRedirect: '/success'
    })
  );

  return router;
};

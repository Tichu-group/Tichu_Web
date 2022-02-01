import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import {
  Strategy as KakaoStrategy,
  Profile as KakaoProfile
} from 'passport-kakao';
import {
  Strategy as GoogleStrategy,
  Profile as GoogleProfile,
  VerifyCallback as GoogleVerifyCallback
} from 'passport-google-oauth20';

import config from './config';
import UserEntity from './entity/user.entity';
import { OAuthProvider } from './types/auth.type';

export default () => {
  passport.serializeUser((user: Express.User, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id: string, done) => {
    UserEntity.findOne(id)
      .then(user => {
        if (user === undefined) {
          done(Error(`No User with id: ${id} found`), null);
        }
        done(null, user);
      })
      .catch(err => {
        done(err, null);
      });
  });

  passport.use(
    new KakaoStrategy(
      {
        clientID: config.secret.kakao.clientID,
        clientSecret: config.secret.kakao.clientSecret,
        callbackURL: config.secret.kakao.callbackUrl
      },
      (
        accessToken: string,
        refreshToken: string,
        profile: KakaoProfile,
        cb
      ) => {
        console.log('kakao auth: ', accessToken, refreshToken, profile);
        UserEntity.findOne({
          where: { oAuthId: profile.id, oAuthProvider: 'kakao' }
        }).then(async user => {
          if (user === undefined) {
            const newUser = new UserEntity();
            newUser.oAuthId = profile.id;
            if (!profile.username) {
              throw new Error('no username');
            }
            newUser.userName = profile.username ?? 'unknown user';
            newUser.oAuthProvider = profile.provider as OAuthProvider;
            console.log('2');
            cb(null, await newUser.save());
          } else {
            cb(null, user);
          }
        });
      }
    )
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: config.secret.google.clientID,
        clientSecret: config.secret.google.clientSecret,
        callbackURL: config.secret.google.callbackUrl
      },
      (
        accessToken: string,
        refreshToken: string,
        profile: GoogleProfile,
        cb: GoogleVerifyCallback
      ) => {
        console.log('google auth: ', accessToken, refreshToken, profile);
        UserEntity.findOne({
          where: { oAuthId: profile.id, oAuthProvider: 'google' }
        }).then(async user => {
          if (user === undefined) {
            const newUser = new UserEntity();
            newUser.oAuthId = profile.id;
            if (!profile.displayName) {
              throw new Error('no username');
            }
            newUser.userName = profile.displayName ?? 'unknown user';
            newUser.oAuthProvider = profile.provider as OAuthProvider;
            console.log('2');
            cb(null, await newUser.save());
          } else {
            cb(null, user);
          }
        });
      }
    )
  );
};

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    console.log('authenticated');
    return next();
  }
  res.redirect('/');
};

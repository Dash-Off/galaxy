import session from "express-session";
import passport from 'passport';
import { PASSCODE } from '../config.js';
import Models from './models/index.js';
import bodyParser from "body-parser";
import { Strategy } from "passport-local";

const getSession = () => {
  const isProd = process.env.RENDER;
  const session = { 
    secret : PASSCODE, 
    resave : false, 
    saveUninitialized : false,
  };
  if (isProd) {
    session.cookie = {
      httpOnly: false,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 4 * 24 * 60 * 60 * 1000 // 4 days expiry
    }
  }

  return session;
}

const initAuth = (app) => {
  app.use(bodyParser.urlencoded({extended:true})); 
  app.use(session(getSession()));
  app.use(passport.initialize()); 
  app.use(passport.session()); 
  app.enable('trust proxy');
  passport.serializeUser(Models.User.serializeUser()); 
  passport.deserializeUser(Models.User.deserializeUser()); 
  passport.use(new Strategy(Models.User.authenticate()));
};

export default initAuth;

import session from "express-session";
import passport from 'passport';
import { PASSCODE } from '../config.js';
import Models from './models/index.js';
import bodyParser from "body-parser";

const initAuth = (app) => {
  app.use(bodyParser.urlencoded({extended:true})); 
  app.use(session({ 
    secret : PASSCODE, 
    resave : false, 
    saveUninitialized : false
}));
  app.use(passport.initialize()); 
  app.use(passport.session()); 
  passport.use(Models.User.createStrategy());
  passport.serializeUser(Models.User.serializeUser()); 
  passport.deserializeUser(Models.User.deserializeUser()); 
};

export default initAuth;

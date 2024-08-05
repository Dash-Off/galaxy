import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';

import initalizeRoutes from "./routes/index.js"
import Models from './models/index.js';
import initalizeAuthentication from './initalize-authentication.js';
import errorHandler from './middlewares/error-handler.js';

const corswhitelist = (process.env.CORS_ORIGINS || "http://localhost:5173").split(",");



const initalize = (app) => {
  app.use(cors({
    credentials: true,
    origin: function(origin, callback) {
      if (corswhitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
        // callback(null, false);
      }
    }
  }));
  app.use(express.json());
  app.use(express.urlencoded());
  mongoose.connect(process.env.MONGO_CONNECTION);
  initalizeAuthentication(app);
  initalizeRoutes(app);
  app.use(errorHandler);
  
}

export default initalize;
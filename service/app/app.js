import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';

import initalizeRoutes from "./routes/index.js"
import Models from './models/index.js';
import initalizeAuthentication from './initalize-authentication.js';
import errorHandler from './middlewares/error-handler.js';

const corswhitelist = (process.env.CORS_ORIGINS || "http://localhost:5173").split(",");
function corsOptionsDelegate(req, callback) {
  var corsOptions;
  if (corswhitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true }
  } else {
    corsOptions = { origin: false }
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
};


const initalize = (app) => {
  app.use(cors(corsOptionsDelegate));
  app.use(express.json());
  app.use(express.urlencoded());
  mongoose.connect(process.env.MONGO_CONNECTION);
  initalizeAuthentication(app);
  initalizeRoutes(app);
  app.use(errorHandler);
  
}

export default initalize;
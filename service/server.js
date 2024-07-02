import express from 'express';
import dotenv from 'dotenv';
import initalizeApp from './app/app.js';

dotenv.config();

const app = express();
const port = process.env.PORT;
initalizeApp(app);
app.listen(port, () => console.log("Server running on port:" + port));

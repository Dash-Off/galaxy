import basicRouter from './basic-route.js';
import authRouter from './auth-routes.js';
import adminRouter from './admin-routes.js';
import userRouter from './user-routes.js';
import axios from 'axios';

const initalizeRoutes = (app) => {
  app.use("/api/v1/auth/", authRouter);
  app.use("/api/v1/admin/", adminRouter);
  app.use('/api/v1/eval/', basicRouter);
  app.use('/api/v1/', userRouter);
  app.get('/status', async (req, res) => {
    try {
    await axios.get(process.env.SCHEDULER);
    console.log("Heart beats...")
    res.json({
      status: 'OK',
      message: 'Server is running',
      timestamp: new Date().toISOString()
    });
  } catch {
    console.error("Status call failed...")
    res.json({
      status: 'OK',
      message: 'Server is running',
      timestamp: new Date().toISOString(),
      error: true,
    });
  }
  });
}

export default initalizeRoutes;

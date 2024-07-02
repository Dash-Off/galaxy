import basicRouter from './basic-route.js';
import authRouter from './auth-routes.js';
import adminRouter from './admin-routes.js';
import userRouter from './user-routes.js';

const initalizeRoutes = (app) => {
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/admin", adminRouter);
  app.use('/api/v1/', userRouter);
}

export default initalizeRoutes;

import express from 'express';

import * as authController from '../controllers/auth-controller.js';
import authenticate from '../middlewares/authentication.js';

const router = express.Router();


router.route('/register').post(authController.register);
router.route('/login').post(authController.login);
router.route('/logout').post(authController.logout);
router.route('/userinfo').get(authenticate(), authController.userinfo).patch(authenticate(), authController.updateUser);


export default router;


import express from 'express';
import * as dashOffController from '../controllers/dashoff-controller.js';


const router = express.Router();

router.route('/').get(function (req, res) { 
    res.send("Logged In");
});

router.route('/myDashOffs/:id/results').post(dashOffController.postResult);

export default router;


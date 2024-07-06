import { getRouter } from "../utility.js";

import * as dashOffController from "../controllers/dashoff-controller.js";

const router = getRouter(true);

router.route('/challenges').post(dashOffController.createChallengeDashOff);
router.route('/myDashOffs').post(dashOffController.createSelfDashOff);
router.route('/saveDashOff').patch(dashOffController.saveDashOff);


export default router;


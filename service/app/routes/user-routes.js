import { getRouter } from "../utility.js";

import * as dashOffController from "../controllers/dashoff-controller.js";
import * as challengeController from "../controllers/challenge-controller.js";

const router = getRouter(true);

router.route('/challenges').post(dashOffController.createChallengeDashOff).get(challengeController.listUserChallenges);
router.route('/myDashOffs').post(dashOffController.createSelfDashOff).get(dashOffController.list);
router.route('/saveDashOff').patch(dashOffController.saveDashOff);
router.route('/completeDashOff').patch(dashOffController.completeDashOff);


export default router;


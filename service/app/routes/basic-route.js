import { getRouter } from "../utility.js";


const router = getRouter(true);

router.route('/').get(function (req, res) { 
    res.send("Logged In");
});

export default router;


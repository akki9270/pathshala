const Router = require("express-promise-router");
const router = new Router();

const { GET_ALL_REWARD, CREATE_REWARD } = require('../controller/reward.controller');

router.get('/getAllReward', GET_ALL_REWARD);
router.post('/createReward', CREATE_REWARD);

module.exports = router;
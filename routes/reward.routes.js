const Router = require("express-promise-router");
const router = new Router();

const { GET_ALL_REWARD, CREATE_REWARD, GET_REWARD_BY_ID } = require('../controller/reward.controller');

router.get('/getAllReward', GET_ALL_REWARD);
router.post('/createReward', CREATE_REWARD);
router.post('/updateReward/:id', CREATE_REWARD);
router.get('/getRewardById/:id', GET_REWARD_BY_ID);

module.exports = router;
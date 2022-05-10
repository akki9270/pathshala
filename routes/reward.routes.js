const Router = require("express-promise-router");
const router = new Router();

const { GET_ALL_REWARD, CREATE_REWARD, GET_REWARD_BY_ID, DELETE_REWARD, GET_REWARD_BY_DATE } = require('../controller/reward.controller');

router.get('/getAllReward', GET_ALL_REWARD);
router.post('/createReward', CREATE_REWARD);
router.post('/updateReward/:id', CREATE_REWARD);
router.delete('/deleteReward/:id', DELETE_REWARD);
router.get('/getRewardById/:id', GET_REWARD_BY_ID);
router.get('/getRewardByDate', GET_REWARD_BY_DATE);

module.exports = router;
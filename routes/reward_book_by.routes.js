const Router = require("express-promise-router");
const router = new Router();

const { GET_ALL_BOOKED_REWARD, BOOK_REWARD, GET_BOOKED_REWARD_BY_USER, REDEEM_REWARD, CANCLE_REWARD } = require('../controller/reward_booked_by.controller');

router.get('/getAllBookedReward/:id', GET_ALL_BOOKED_REWARD);
router.post('/bookReward', BOOK_REWARD);
router.post('/cancleReward', CANCLE_REWARD);
router.get('/getBookedReward/:id', GET_BOOKED_REWARD_BY_USER);
router.get('/redeemReward/:id', REDEEM_REWARD);


module.exports = router;
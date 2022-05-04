const { getAllBookedReward, bookReward, bookRewardByUser, redeemReward, cancleReward } = require('../service/reward_book_by.service');

exports.GET_ALL_BOOKED_REWARD = async (req, res, next) => {
    try {
        const id = req.params.id;
        let result = await getAllBookedReward(id);
        return res.status(200).send({ data: result });
    } catch (e) {
        return res.status(500).send(e);
    }
};

exports.BOOK_REWARD = async (req, res, next) => {
    const { reward_id, user_id } = req.body;
    try {
        let result = await bookReward({
            reward_id, user_id
        });
        return res.status(200).send({ data: result });
    } catch (e) {
        return res.status(500).send(e);
    }
};

exports.CANCLE_REWARD = async (req, res, next) => {
    const { reward_id, user_id } = req.body;
    try {
        let result = await cancleReward({
            reward_id, user_id
        });
        return res.status(200).send({ data: result });
    } catch (e) {
        console.log('e::', e)
        return res.status(500).send(e);
    }
};

exports.GET_BOOKED_REWARD_BY_USER = async (req, res, next) => {
    try {
        const id = req.params.id;
        let studentObj = await bookRewardByUser(id);
        return res.status(200).send({ data: studentObj });
    } catch (e) {
        return res.status(500).send(e);
    }
}

exports.REDEEM_REWARD = async (req, res, next) => {
    const id = req.params.id;
    try {
        let result = await redeemReward(id);
        return res.status(200).send({ data: result });
    } catch (e) {
        return res.status(500).send(e);
    }
};
const { getAllBookedReward, bookReward } = require('../service/reward_book_by.service');

exports.GET_ALL_BOOKED_REWARD = async (req, res, next) => {
    try {
        let result = await getAllBookedReward();
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
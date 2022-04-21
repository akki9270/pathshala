const models = require('../models');

async function getAllBookedReward() {
    try {
        let result = await models.RewardBookedBy.findAll({
            include: [
                { model: models.User, as: 'Student' },
                { model: models.Reward, as: 'Reward' }
            ],
            order: [['start_date', 'DESC']]
        });
        return { data: result }
    } catch (e) {
        return { isError: true, e: e };
    }
}

async function bookReward(rewardBooked) {
    try {
        let result = await models.RewardBookedBy.create(rewardBooked);
        return { data: result }
    } catch (e) {
        console.log(e)
        return { isError: true, e: e };
    }
}

module.exports = {
    getAllBookedReward,
    bookReward
};

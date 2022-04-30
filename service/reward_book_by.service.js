const models = require('../models');

async function getAllBookedReward() {
    try {
        let result = await models.RewardBookedBy.findAll({

            include: [
                { model: models.User, as: 'Student' },
                { model: models.Reward, as: 'Reward' }
            ],
            order: [['id', 'DESC']]
        });
        return result;
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

async function bookRewardByUser(userId) {
    try {
        let studentObj = await models.RewardBookedBy.findAll({
            include: [
                { model: models.User, as: 'Student' },
                { model: models.Reward, as: 'Reward' }
            ],
            where: {
                user_id: userId
            }
        });
        return studentObj
    } catch (e) {
        return { isError: true, e: e };
    }
}

async function redeemReward(id) {
    try {
        let result = await models.RewardBookedBy.update({isRedeem : true}, { where: { id: id } });
        return { data: result };
    } catch (e) {
        return { isError: true, e: e };
    }
}

module.exports = {
    getAllBookedReward,
    bookReward,
    bookRewardByUser,
    redeemReward
};

const models = require('../models');
const moment = require("moment");

async function getAllReward(date) {
    try {
        let result = await models.Reward.findAll({
            where: {
                start_date: {
                    [Op.gte]: moment(date).startOf('day').toDate(),
                    [Op.lt]: moment(date).endOf('day').toDate()
                }
            },
            order: [['start_date', 'ASC']]
        });
        return {data: result}
    } catch (e) {
        return {isError: true, e: e};
    }
}

async function createReward(reward) {
    try {
        let result = await models.Reward.create({reward});
        return {data: result}
    } catch (e) {
        console.log(e)
        return {isError: true, e: e};
    }
}

module.exports = {
    getAllReward,
    createReward
}

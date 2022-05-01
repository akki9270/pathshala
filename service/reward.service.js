const models = require('../models');
const moment = require("moment");
const { Op } = require("sequelize");
const { eq } = require('sequelize/lib/operators');


async function getAllReward(startDate, endDate) {
    try {
        let result = await models.Reward.findAll({
            where: {
                // start_date: {
                //     [Op.gte]: moment(startDate).startOf('day').toDate(),
                //     [Op.lt]: moment(endDate).endOf('day').toDate()
                // }
            },
            order: [['start_date', 'ASC']]
        });
        return result;
    } catch (e) {
        return { isError: true, e: e };
    }
}

async function createReward(reward) {
    try {
        let result = await models.Reward.create(reward);
        return result;
    } catch (e) {
        return { isError: true, e: e };
    }
}

async function getRewardById(id) {
    try {
        const result = await models.Reward.findOne({ where: { id, deletedAt: { [eq]: null } } })
        return result;
    } catch (e) {
        return { isError: true, e: e };
    }
}

module.exports = {
    getAllReward,
    createReward,
    getRewardById
}

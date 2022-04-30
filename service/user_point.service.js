const { eq } = require('sequelize/lib/operators');
const models = require('../models');
const { Op } = require("sequelize");
const moment = require("moment");

async function addBonusPoint(UserPoint) {
    try {
        let result = await models.UserPointHistory.create(UserPoint);
        return { data: result }
    } catch (e) {
        console.log(e)
        return { isError: true, e: e };
    }
}

async function getAllPoint() {
    try {
        const result = await models.UserPointHistory.findAll({

            include: [
                { model: models.User, as: 'Teacher' },
                { model: models.User, as: 'Student' }
            ],
            order: [['id', 'DESC']]

        });
        return result;
    } catch (e) {
        return e;
    }
}

async function studentPointHistory(userId, startDate, endDate) {
    try {
        const result = await models.UserPointHistory.findAll({
            include: [
                { model: models.User, as: 'Teacher' },
                { model: models.User, as: 'Student' }
            ],
            where: {
                user_id: userId,
                createdAt: {
                    [Op.gte]: moment(startDate).startOf('day').toDate(),
                    [Op.lt]: moment(endDate).endOf('day').toDate()
                }
            },
            order: [['id', 'DESC']]
        });
        return result;
    } catch (e) {
        return e;
    }
}

module.exports = {
    addBonusPoint,
    getAllPoint,
    studentPointHistory
}
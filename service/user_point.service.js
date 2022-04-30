const { eq } = require('sequelize/lib/operators');
const models = require('../models');

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

module.exports = {
    addBonusPoint,
    getAllPoint
}
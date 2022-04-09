const { eq } = require('sequelize/lib/operators');
const models = require('../models');

async function addBonusPoint(UserPoint) {
    try {
        let result = await models.UserPointHistory.create({ UserPoint });
        return { data: result }
    } catch (e) {
        console.log(e)
        return { isError: true, e: e };
    }
}

module.exports = {
    addBonusPoint
}
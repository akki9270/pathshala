const models = require('../models');

async function getAllLedger() {
    try {
        let result = await models.StudentLedger.findAll({
            include: [
                {model: models.User, as: 'Teacher'}
            ]
        });
        return {data: result}
    } catch (e) {
        return {isError: true, e: e};
    }
}

async function createLedger(ledger) {
    try {
        let result = await models.StudentLedger.create({ledger});
        return {data: result}
    } catch (e) {
        return {isError: true, e: e};
    }
}

module.exports = {
    getAllLedger,
    createLedger
};
